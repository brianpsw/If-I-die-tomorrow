package com.a307.ifIDieTomorrow.global.util;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Random;

@Component
public class NicknameGenerator {
    private List<String[]> animals = null;
    private List<String[]> modifiers = null;
    public String getRandomItemFromCsv() throws IOException, CsvException {
        if (animals == null || modifiers == null) {
            // Load the CSV file if it's not already loaded
            Resource resourceAnimal = new ClassPathResource("animal.csv");
            CSVReader reader = new CSVReader(new InputStreamReader(resourceAnimal.getInputStream()));
            animals = reader.readAll();
            Resource resourceModifier = new ClassPathResource("modifier.csv");
            reader = new CSVReader(new InputStreamReader(resourceModifier.getInputStream()));
            modifiers = reader.readAll();
            reader.close();
        }

        Random random = new Random();
        int index = random.nextInt(modifiers.size());
        String[] row = modifiers.get(index);

        // Return a random field from the row
        int fieldIndex = random.nextInt(row.length);
        StringBuilder sb = new StringBuilder();
        sb.append(row[fieldIndex].trim());

        // Get a random item from the CSV file
        random = new Random();
        index = random.nextInt(animals.size());
        row = animals.get(index);

        // Return a random field from the row
        fieldIndex = random.nextInt(row.length);
        sb.append(' '+ row[fieldIndex].trim());
        return sb.toString();
    }
}
