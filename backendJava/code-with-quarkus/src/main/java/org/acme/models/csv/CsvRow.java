package org.acme.models.csv;

import java.util.Map;

public class CsvRow {
    private Map<String, String> fields;

    public CsvRow() {}

    public CsvRow(Map<String, String> fields) {
        this.fields = fields;
    }

    public Map<String, String> getFields() {
        return fields;
    }

    public void setFields(Map<String, String> fields) {
        this.fields = fields;
    }
}
