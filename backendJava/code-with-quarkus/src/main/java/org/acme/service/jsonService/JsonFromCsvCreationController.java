package org.acme.service.jsonService;


import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.acme.models.json.JsonModel;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Path("/csv")
public class JsonFromCsvCreationController {

    @Inject
    JsonFromCsvCreationService templateService;

    @POST
    @Path("/generate-json")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response generateJson(JsonModel request) {
        try {
            byte[] content = templateService.generateSchema(request);
            String filename = request.getName().trim() + ".json";

            return Response
                    .ok(new ByteArrayInputStream(content))
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .build();

        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error generating JSON template: " + e.getMessage())
                    .build();
        }
    }
}
