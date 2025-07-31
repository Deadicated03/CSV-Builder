package org.acme.service.csvService;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;


@ApplicationScoped
public class CsvDownloadHeaderService {

        public List<String> extractHeaders(String filePath) throws IOException {
            try (CSVReader reader = new CSVReader(new FileReader(filePath))) {
                String[] headers = reader.readNext();
                if (headers != null) {
                    return Arrays.asList(headers);
                }
                return List.of();
            } catch (CsvValidationException e) {
                throw new RuntimeException(e);
            }
        }
}
