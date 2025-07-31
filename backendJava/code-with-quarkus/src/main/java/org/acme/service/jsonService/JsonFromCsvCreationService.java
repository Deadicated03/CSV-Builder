package org.acme.service.jsonService;

import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.models.json.JsonModel;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.util.Map;

@ApplicationScoped
public class JsonFromCsvCreationService {



    private final ObjectMapper mapper = new ObjectMapper();
    /**
     * Δημιουργεί ένα JSON template με properties, required και errorMessages
     */


    public byte[] generateSchema(JsonModel request) throws IOException {
        // 1. Root object
        ObjectNode root = mapper.createObjectNode();
        root.put("type", "object");


        // 2. Properties & ErrorMessages
        ObjectNode propertiesNode     = mapper.createObjectNode();
        ObjectNode errorMessagesNode  = mapper.createObjectNode();

        for (Map.Entry<String, String> e : request.getInferredTypes().entrySet()) {
            String field = e.getKey();
            String type  = e.getValue();

            switch (type) {
                case "NUMBER":
                    propertiesNode
                            .putObject(field)
                            .put("type", "number");
                    errorMessagesNode
                            .put(field, "The field " + field + " must be a NUMBER");
                    break;

                case "EMAIL":
                    propertiesNode
                            .putObject(field)
                            .put("type", "string")
                            .put("pattern", "(?!^\\d+$)^.+$");
                    errorMessagesNode
                            .put(field, "The field " + field + " must be a STRING");
                    break;

                case "DATE":
                    propertiesNode
                            .putObject(field)
                            .put("type", "string")
                            .put("pattern", "(?!^\\d+$)^.+$");  // tweak as needed
                    errorMessagesNode
                            .put(field, "The field " + field + " must be a STRING");
                    break;

                case "BOOLEAN":
                    propertiesNode
                            .putObject(field)
                            .put("type", "string")
                            .put("format", "custom-boolean");
                    errorMessagesNode
                            .put(field, "The field " + field + " must be a BOOLEAN");
                    break;

                default:
                    // STRING ή ό,τι άλλο
                    propertiesNode
                            .putObject(field)
                            .put("type", "string");
                    errorMessagesNode
                            .put(field, "The field " + field + " must be a STRING");
                    break;
            }
        }

        root.set("properties", propertiesNode);

        // 3. Required fields
        ArrayNode requiredArray = mapper.createArrayNode();
        for (String req : request.getRequired()) {
            requiredArray.add(req);
        }
        root.set("required", requiredArray);

        // 4. Error messages
        root.set("errorMessages", errorMessagesNode);

        // 5. Επιστροφή bytes
        return mapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsBytes(root);
    }
}
