package com.a307.ifIDieTomorrow.global.util;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import org.imgscalr.Scalr;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class ImageProcess {
	
	/**
	 * 이미지 크기를 줄이는 메서드
	 * @param multipartFile 원본 파일
	 * @param targetWidth 목표 가로 길이
	 * @return resized image
	 */
	public MultipartFile resizeImage (MultipartFile multipartFile, int targetWidth) throws IOException, MetadataException, ImageProcessingException {
		
		// 이미지 처리를 위해 버퍼드이미지로 변환해야 함, IOException 발생 가능
		BufferedImage originalImage = ImageIO.read(multipartFile.getInputStream());
		int originalHeight = originalImage.getHeight();
		int originalWidth = originalImage.getWidth();
		String fileFormat = multipartFile.getContentType().substring(multipartFile.getContentType().lastIndexOf("/") + 1);
		
		// 이미지 크기가 충분히 작거나 gif 파일이면(1mb 이하의 gif 파일만 프론트에서 넘어옴) 처리할 필요가 없음
		if(originalWidth <= targetWidth || (!"png".equals(fileFormat) && !"jpeg".equals(fileFormat) && !"bmp".equals(fileFormat))) return multipartFile;
		
		// 목표로 하는 이미지의 가로 사이즈는 {targetWidth}px
		int targetHeight = targetWidth * originalHeight / originalWidth;
		
		// 이미지 처리(SMOOTH 스케일을 주면 속도보다 이미지의 부드러움, FAST 스케일을 주면 부드러움 보단 속도)
		Image resizedImage = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);
		BufferedImage newImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
		Graphics graphics = newImage.getGraphics();
		graphics.drawImage(resizedImage, 0, 0, null);
		graphics.dispose();
		
		// JPG 파일 회전 처리 부분
		if ("jpeg".equals(fileFormat)) {
			int rotate = 1;
			// 회전 정보를 알아내기 위해 사진의 Metadata 를 가져옴
			// IOException, ImageProcessingException 발생 가능
			Metadata metadata = ImageMetadataReader.readMetadata(multipartFile.getInputStream());
			Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
			// MetadataException 발생 가능
			rotate = directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
			
			// Metadata 기반으로 사진을 회전시킴
			switch (rotate) {
				case 1:
					break;
				case 3:
					newImage = Scalr.rotate(newImage, Scalr.Rotation.CW_180, null);
					break;
				case 6:
					newImage = Scalr.rotate(newImage, Scalr.Rotation.CW_90, null);
					break;
				case 8:
					newImage = Scalr.rotate(newImage, Scalr.Rotation.CW_270, null);
					break;
			}
		}
		
		// 리사이즈된 이미지를 MultipartFile 로 바꾸기 위한 전처리
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		// IOException 발생 가능
		ImageIO.write(newImage, fileFormat, baos);
		baos.flush();
		
		return new ConvertToMultipartFile(multipartFile.getOriginalFilename(), fileFormat, multipartFile.getContentType(), baos.toByteArray());
		
	}
	
}