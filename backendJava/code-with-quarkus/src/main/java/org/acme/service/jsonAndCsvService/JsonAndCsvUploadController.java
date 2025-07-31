package org.acme.service.jsonAndCsvService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.acme.service.csvService.CsvUploadService;
import org.acme.models.json.JsonModel;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@Path("/mapping")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)
public class JsonAndCsvUploadController {


    @Inject
    JsonAndCsvUploadService templateService;

    @POST
    @Path("/upload-all")
    public Response uploadAll(MultipartFormDataInput input) {

        try {
            Map<String, List<InputPart>> formData = input.getFormDataMap();
            List<InputPart> fileParts = formData.get("files");
            System.out.println(fileParts);

            if (fileParts == null || fileParts.size() != 2) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Exactly two files must be uploaded.")
                        .build();
            }

            java.nio.file.Path uploadDir = Paths.get("uploads");
            Files.createDirectories(uploadDir);


            File jsonFile = null;
            File csvFile = null;

            for (InputPart part : fileParts) {
                String contentType = part.getMediaType().toString();
                String contentDisposition = part.getHeaders().getFirst("Content-Disposition");

                String fileName = null;
                if (contentDisposition != null && contentDisposition.contains("filename=")) {
                    fileName = contentDisposition
                            .split("filename=")[1]
                            .replace("\"", "")
                            .trim()
                            .toLowerCase(); // για εύκολη σύγκριση
                }

                System.out.println("Detected filename: " + fileName);
                InputStream inputStream = part.getBody(InputStream.class, null);
                java.nio.file.Path targetPath;
                if (fileName.endsWith(".json")) {
                    targetPath = uploadDir.resolve("template.json");
                    jsonFile = targetPath.toFile();
                } else if (fileName.endsWith(".csv")) {
                    targetPath = uploadDir.resolve("template.csv");
                    csvFile = targetPath.toFile();
                } else {
                    continue;
                }

                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            if (jsonFile == null || csvFile == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Both JSON and CSV files are required.")
                        .build();
            }

            TemplateAnalysisResult result = templateService.analyzeTemplateWithCsv(jsonFile, csvFile);
            return Response.ok(result).build();

        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Upload failed: " + e.getMessage())
                    .build();
        }
    }
}
