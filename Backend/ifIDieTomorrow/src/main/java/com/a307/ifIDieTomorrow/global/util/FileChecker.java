package com.a307.ifIDieTomorrow.global.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Slf4j
public class FileChecker {

	private static final Tika tika = new Tika();
	
	public static boolean imageCheck (InputStream inputStream) throws IOException {
		List<String> validTypeList = Arrays.asList("image/jpeg", "image/png", "image/gif", "image/bmp", "image/x-windows-bmp");
		
		String mimeType = tika.detect(inputStream);
		log.info("MimeType : " + mimeType);
		
		return validTypeList.stream().anyMatch(validType -> validType.equalsIgnoreCase(mimeType));
	}
	
	public static boolean videoCheck (InputStream inputStream) throws IOException {
		List<String> validTypeList = Arrays.asList("video/mp4", "video/avi", "video/webm", "application/x-matroska", "video/quicktime", "application/octet-stream");
		
		String mimeType = tika.detect(inputStream);
		log.info("MimeType : " + mimeType);
		
		return validTypeList.stream().anyMatch(validType -> validType.equalsIgnoreCase(mimeType));
	}
	
}
