package com.a307.ifIDieTomorrow.global.util;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Component
public class FileUtil {

    public void zipDirectory(String sourceDir, String zipFilePath) throws IOException {
        Path sourcePath = Paths.get(sourceDir);
        FileOutputStream fos = new FileOutputStream(zipFilePath);
        ZipOutputStream zipOut = new ZipOutputStream(fos);

        zipFile(sourcePath.toFile(), sourcePath.getFileName().toString(), zipOut);

        zipOut.close();
        fos.close();
    }

    public void zipFile(File fileToZip, String fileName, ZipOutputStream zipOut) throws IOException {
        if (fileToZip.isHidden()) {
            return;
        }
        if (fileToZip.isDirectory()) {
            if (fileName.endsWith("/")) {
                zipOut.putNextEntry(new ZipEntry(fileName));
                zipOut.closeEntry();
            } else {
                zipOut.putNextEntry(new ZipEntry(fileName + "/"));
                zipOut.closeEntry();
            }
            File[] children = fileToZip.listFiles();
            for (File childFile : children) {
                zipFile(childFile, fileName + "/" + childFile.getName(), zipOut);
            }
            return;
        }
        FileInputStream fis = new FileInputStream(fileToZip);
        ZipEntry zipEntry = new ZipEntry(fileName);
        zipOut.putNextEntry(zipEntry);

        byte[] bytes = new byte[1024];
        int length;
        while ((length = fis.read(bytes)) >= 0) {
            zipOut.write(bytes, 0, length);
        }
        fis.close();
    }

    public void downloadFile(String fileUrl, String savePath) throws IOException {
        URL url = new URL(fileUrl);
        Path path = Path.of(savePath);

        try (BufferedInputStream in = new BufferedInputStream(url.openStream())) {
            Files.copy(in, path, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    public Resource loadFileAsResource(String fileName) throws FileNotFoundException {
        try {
//            Path filePath = Paths.get("C:/uploads").resolve(fileName).normalize();
            File filePath = new File(fileName);
//            Resource resource = new UrlResource(filePath.toUri());
            Resource resource = new UrlResource(filePath.toURI());

            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("File not found: " + fileName);
            }
        } catch (MalformedURLException | FileNotFoundException ex) {
            throw new FileNotFoundException("File not found: " + fileName);
        }
    }

    public String getContentType(String fileUrl) throws IOException {
        URL url = new URL(fileUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("HEAD");

        return '.' + connection.getContentType().substring(connection.getContentType().lastIndexOf('/')+1);
    }

    public void createDirectory(String directoryPath) throws IOException {
        Path path = Paths.get(directoryPath);
        Files.createDirectories(path);
    }

    public void copyDirectory(String sourceDirectory, String destinationDirectory) throws IOException {
        File sourcePath = new File(sourceDirectory);
        File destinationPath = new File(destinationDirectory);

        try {
            FileUtils.copyDirectory(sourcePath, destinationPath);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}