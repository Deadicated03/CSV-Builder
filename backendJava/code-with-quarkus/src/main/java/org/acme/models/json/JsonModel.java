package org.acme.models.json;

import java.util.List;
import java.util.Map;

public class JsonModel {

    private Map<String, String> inferredTypes;
    private List<String> required;
    private String name;

    public JsonModel() {
    }

    public Map<String, String> getInferredTypes() {
        return inferredTypes;
    }

    public void setInferredTypes(Map<String, String> inferredTypes) {
        this.inferredTypes = inferredTypes;
    }

    public List<String> getRequired() {
        return required;
    }

    public void setRequired(List<String> required) {
        this.required = required;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
