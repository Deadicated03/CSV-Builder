package org.acme.service.jsonAndCsvService;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

public class TemplateAnalysisResult {

    private List<String> csvHeaders;
    private List<String> templateFields;
    private List<String> requiredFields;
    private Map<String, String> errorMessages;
    private JsonNode allProperties;
    private String csvFilename;

    public List<String> getCsvHeaders() {
        return csvHeaders;
    }

    public void setCsvHeaders(List<String> csvHeaders) {
        this.csvHeaders = csvHeaders;
    }

    public List<String> getTemplateFields() {
        return templateFields;
    }

    public void setTemplateFields(List<String> templateFields) {
        this.templateFields = templateFields;
    }

    public List<String> getRequiredFields() {
        return requiredFields;
    }

    public void setRequiredFields(List<String> requiredFields) {
        this.requiredFields = requiredFields;
    }

    public Map<String, String> getErrorMessages() {
        return errorMessages;
    }

    public void setErrorMessages(Map<String, String> errorMessages) {
        this.errorMessages = errorMessages;
    }

    public JsonNode getAllProperties() {
        return allProperties;
    }

    public void setAllProperties(JsonNode allProperties) {
        this.allProperties = allProperties;
    }

    public String getCsvFilename() {
        return csvFilename;
    }

    public void setCsvFilename(String csvFilename) {
        this.csvFilename = csvFilename;
    }
}
