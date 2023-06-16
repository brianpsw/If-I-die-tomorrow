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
	
	public static String getMimeType(InputStream inputStream) throws IOException {
		String mimeType = tika.detect(inputStream);
		log.info("MimeType : " + mimeType);
		return mimeType;
	}
	
	public static boolean imageCheck (String type) {
		List<String> validTypeList = Arrays.asList("image/jpeg", "image/png", "image/gif", "image/bmp", "image/x-windows-bmp");
		
		return validTypeList.stream().anyMatch(validType -> validType.equalsIgnoreCase(type));
	}
	
	public static boolean videoCheck (String type) {
		List<String> validTypeList = Arrays.asList("video/mp4", "video/avi", "video/webm", "application/x-matroska", "video/quicktime");
		
		return validTypeList.stream().anyMatch(validType -> validType.equalsIgnoreCase(type));
	}
	
}
