package org.acme.service.mappingService;

import com.opencsv.exceptions.CsvValidationException;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Path("/mapping")
public class MappingController {


    @Inject
    MappingService mappingService;

    @GET
    @Path("/csv/{filename}")
    public Response getCsvContent(@PathParam("filename") String filename) {
        try {
            List<Map<String, String>> result = mappingService.parseCsv(filename);
            return Response.ok(result).build();
        } catch (IOException | CsvValidationException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }
}
