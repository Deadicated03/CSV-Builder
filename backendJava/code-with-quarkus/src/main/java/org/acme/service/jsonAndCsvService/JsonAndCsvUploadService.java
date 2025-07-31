package org.acme.service.jsonAndCsvService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.*;

@ApplicationScoped
public class JsonAndCsvUploadService {

    private final ObjectMapper mapper = new ObjectMapper();

    public TemplateAnalysisResult analyzeTemplateWithCsv(File jsonFile, File csvFile) {
        try {
            JsonNode root = mapper.readTree(jsonFile);

            JsonNode propertiesNode = root.get("properties");
            JsonNode requiredNode = root.get("required");
            JsonNode errorMessagesNode = root.get("errorMessages");

            List<String> templateFields = new ArrayList<>();
            if (propertiesNode != null && propertiesNode.isObject()) {
                propertiesNode.fieldNames().forEachRemaining(templateFields::add);
            }

            List<String> requiredFields = new ArrayList<>();
            if (requiredNode != null && requiredNode.isArray()) {
                for (JsonNode n : requiredNode) {
                    requiredFields.add(n.asText());
                }
            }

            Map<String, String> errorMessages = new HashMap<>();
            if (errorMessagesNode != null && errorMessagesNode.isObject()) {
                Iterator<Map.Entry<String, JsonNode>> fields = errorMessagesNode.fields();
                while (fields.hasNext()) {
                    Map.Entry<String, JsonNode> entry = fields.next();
                    errorMessages.put(entry.getKey(), entry.getValue().asText());
                }
            }

            // CSV Headers
            List<String> csvHeaders = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
                String line = reader.readLine();
                if (line != null) {
                    csvHeaders = Arrays.asList(line.split(","));
                }
            }

            // Construct Result
            TemplateAnalysisResult result = new TemplateAnalysisResult();
            result.setCsvHeaders(csvHeaders);
            result.setTemplateFields(templateFields);
            result.setRequiredFields(requiredFields);
            result.setErrorMessages(errorMessages);
            result.setAllProperties(propertiesNode);
            result.setCsvFilename(csvFile.getName());

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error parsing uploaded files: " + e.getMessage(), e);
        }
    }
}
