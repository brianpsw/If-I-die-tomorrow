package com.a307.ifIDieTomorrow.global.util;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.List;
import java.util.Random;

@Component
public class NicknameGenerator {
    private List<String[]> animals = null;
    private List<String[]> modifiers = null;
    private Random rand = SecureRandom.getInstanceStrong();

    public NicknameGenerator() throws NoSuchAlgorithmException {
    }

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

        int index = rand.nextInt(modifiers.size());
        String[] row = modifiers.get(index);

        // Return a random field from the row
        int fieldIndex = rand.nextInt(row.length);
        StringBuilder sb = new StringBuilder();
        sb.append(row[fieldIndex].trim());

        // Get a random item from the CSV file
        index = rand.nextInt(animals.size());
        row = animals.get(index);

        // Return a random field from the row
        fieldIndex = rand.nextInt(row.length);
        sb.append(' '+ row[fieldIndex].trim());
        return sb.toString();
    }
}
