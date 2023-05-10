package com.a307.ifIDieTomorrow.global.util;

import com.a307.ifIDieTomorrow.domain.dto.diary.FamousSayingDto;
import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class FamousSayingGenerator {
    private List<String[]> contents = null;
    private List<String[]> authors = null;
    private Random rand = SecureRandom.getInstanceStrong();

    public FamousSayingGenerator () throws NoSuchAlgorithmException {
    }

    public FamousSayingDto getRandomItemFromCsv() throws IOException, CsvException {
        if (contents == null || authors == null) {
            // Load the CSV file if it's not already loaded
            Resource resourceContent = new ClassPathResource("famous_saying_content.csv");
            CSVReader reader = new CSVReader(new InputStreamReader(resourceContent.getInputStream()));
            contents = reader.readAll();
            Resource resourceAuthor = new ClassPathResource("famous_saying_author.csv");
            reader = new CSVReader(new InputStreamReader(resourceAuthor.getInputStream()));
            authors = reader.readAll();
            reader.close();
        }
    
        System.out.println(authors.size());
        System.out.println(contents.size());

        int index = rand.nextInt(authors.size());
        String content = contents.get(index)[0];
    
        // Return a random field from the row
//        StringBuilder sb = new StringBuilder();
//        sb.append(row[0]);

        // Get a random item from the CSV file
        String author = authors.get(index)[0];

        // Return a random field from the row
//        sb.append(" -" + row[0].trim());
        return FamousSayingDto.builder()
                .content(content)
                .author(author)
                .build();
    }
}
