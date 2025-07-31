package org.acme.service.mappingService;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderHeaderAware;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.FileReader;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@ApplicationScoped
public class MappingService {


    public List<Map<String, String>> parseCsv(String filename) throws IOException, CsvValidationException {
        Path filePath = Paths.get(System.getProperty("user.dir"), "uploads", filename);

        if (!Files.exists(filePath)) {
            throw new IOException("CSV file not found.");
        }

        List<Map<String, String>> records = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new FileReader(filePath.toFile()))) {
            String[] headers = reader.readNext(); // μπορεί να πετάξει CsvValidationException
            String[] line;

            while ((line = reader.readNext()) != null) {
                Map<String, String> row = new HashMap<>();
                for (int i = 0; i < headers.length && i < line.length; i++) {
                    row.put(headers[i], line[i]);
                }
                records.add(row);
            }
        }

        return records;
    }
}
