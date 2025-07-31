package org.acme.service.csvService;

import com.opencsv.CSVReader;
import jakarta.enterprise.context.ApplicationScoped;
import org.acme.models.csv.CsvRow;
import com.opencsv.exceptions.CsvValidationException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;

@ApplicationScoped
public class CsvUploadService {

    public List<CsvRow> handleFile(File file) throws IOException, CsvValidationException {
        List<CsvRow> rows = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new FileReader(file))) {
            String[] headers = reader.readNext();
            if (headers == null) return rows;

            String[] line;
            while ((line = reader.readNext()) != null) {
                Map<String, String> map = new LinkedHashMap<>();
                for (int i = 0; i < headers.length && i < line.length; i++) {
                    map.put(headers[i], line[i]);
                }
                rows.add(new CsvRow(map));
            }
        }

        return rows;
    }

    public Map<String, String> predictTypes(List<Map<String, Object>> data) {
        Map<String, String> types = new HashMap<>();

        if (data == null || data.isEmpty()) return types;

        int sampleSize = Math.min(data.size(), 50);

        for (String key : data.get(0).keySet()) {
            int emailCount = 0, numberCount = 0, booleanCount = 0, dateCount = 0;

            for (int i = 0; i < sampleSize; i++) {
                Object raw = data.get(i).get(key);
                String val = raw != null ? raw.toString().trim() : "";

                if (isEmail(val)) emailCount++;
                else if (isNumber(val)) numberCount++;
                else if (isBoolean(val)) booleanCount++;
                else if (isDate(val)) dateCount++;
            }

            int total = sampleSize;
            if (emailCount >= total * 0.5) types.put(key, "EMAIL");
            else if (booleanCount >= total * 0.5) types.put(key, "BOOLEAN");
            else if (numberCount >= total * 0.5) types.put(key, "NUMBER");
            else if (dateCount >= total * 0.5) types.put(key, "DATE");
            else types.put(key, "STRING");
        }

        return types;
    }

    private boolean isBoolean(String val) {
        return List.of("true", "false", "yes", "no", "1", "0").contains(val.toLowerCase());
    }

    private boolean isNumber(String val) {
        if (val == null || val.trim().isEmpty()) return false;
        try {
            Double.parseDouble(val);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private boolean isEmail(String val) {
        String regex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        return Pattern.matches(regex, val);
    }

    private boolean isDate(String val) {
        try {
            return val != null && !val.isEmpty() && new Date(val) != null;
        } catch (Exception e) {
            return false;
        }
    }


}
