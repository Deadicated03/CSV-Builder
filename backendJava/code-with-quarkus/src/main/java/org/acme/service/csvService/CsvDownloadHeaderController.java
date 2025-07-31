package org.acme.service.csvService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import org.acme.service.csvService.CsvDownloadHeaderService;

@Path("/csv")
public class CsvDownloadHeaderController {

    @Inject
    CsvDownloadHeaderService csvService;

    @GET
    @Path("/download-headers")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadHeaders(@QueryParam("file") String file, @QueryParam("name") @DefaultValue("headers") String name) {
        try {
            if (file == null || file.isEmpty()) {
                throw new NotFoundException("No file provided");
            }

            String uploadsDir = "uploads"; // προσαρμόζεται αν έχεις άλλο path
            File csvFile = new File(uploadsDir, file);

            if (!csvFile.exists()) {
                throw new NotFoundException("File not found on server");
            }

            List<String> headers = csvService.extractHeaders(csvFile.getAbsolutePath());
            String content = String.join(",", headers) + "\n";

            // Δημιουργία προσωρινού αρχείου
            File tempFile = File.createTempFile("upload-", ".csv");
            try (FileWriter writer = new FileWriter(tempFile)) {
                writer.write(content);
            }

            return Response.ok(tempFile)
                    .header("Content-Disposition", "attachment; filename=" + name + ".csv")
                    .build();

        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Failed to process file").build();
        }
    }
}

