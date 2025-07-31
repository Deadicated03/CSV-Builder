package org.acme.service.csvService;

import com.opencsv.exceptions.CsvValidationException;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.acme.models.csv.CsvRow;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/csv")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)
public class CsvUploadController {

    @Inject
    CsvUploadService csvService;

    @Inject
    @ConfigProperty(name = "csv.upload.dir", defaultValue = "uploads")
    String uploadDir;

    @POST
    @Path("/upload")
    public Response uploadCsv(MultipartFormDataInput input) {
        try {
            // 1. Ανάγνωση του multipart form
            Map<String, List<InputPart>> form = input.getFormDataMap();
            List<InputPart> fileParts = form.get("file");
            if (fileParts == null || fileParts.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Missing file part")
                        .build();
            }

            // 2. Πρώτο αρχείο και stream
            InputPart filePart = fileParts.get(0);
            InputStream fileStream = filePart.getBody(InputStream.class, null);

            // 3. Δημιουργία φακέλου uploads, αν δεν υπάρχει
            java.nio.file.Path uploadsPath = Paths.get(System.getProperty("user.dir"), uploadDir);
            if (!Files.exists(uploadsPath)) {
                Files.createDirectories(uploadsPath);
            }

            // 4. Μοναδικό όνομα και αντιγραφή αρχείου
            String filename = "Temporary" + ".csv";
            java.nio.file.Path destination = uploadsPath.resolve(filename);
            Files.copy(fileStream, destination, StandardCopyOption.REPLACE_EXISTING);

            File savedFile = destination.toFile();
            List<CsvRow> data = csvService.handleFile(savedFile);

            // 6. Flatten & πρόβλεψη τύπων
            List<Map<String, Object>> flatData = data.stream()
                    .map(row -> {
                        Map<String, Object> m = new HashMap<>();
                        m.putAll(row.getFields());
                        return m;
                    })
                    .collect(Collectors.toList());
            Map<String, String> inferredTypes = csvService.predictTypes(flatData);

            // 7. Δημιουργία response
            Map<String, Object> result = new HashMap<>();
            result.put("message", "CSV parsed successfully");
            result.put("rowCount", data.size());
            result.put("data", data.stream().map(CsvRow::getFields).toList());
            result.put("uploadedFilename", filename);
            result.put("uploadPath", destination.toString());
            result.put("inferredTypes", inferredTypes);

            return Response.ok(result).build();

        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error processing file: " + e.getMessage())
                    .build();
        } catch (CsvValidationException e) {
            throw new RuntimeException(e);
        }
    }
}
