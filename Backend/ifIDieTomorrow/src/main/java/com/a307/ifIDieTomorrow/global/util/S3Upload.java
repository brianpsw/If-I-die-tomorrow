package com.a307.ifIDieTomorrow.global.util;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class S3Upload {
	
	private final AmazonS3Client amazonS3Client;
	
	private final ImageProcess imageProcess;
	
	@Value("${S3_BUCKET}")
	private String bucket;
	
	public String upload(MultipartFile image, String folder) throws IOException, ImageProcessingException, MetadataException {
		String content = image.getContentType().split("/")[0];
		MultipartFile resizedImage;
		if ("image".equals(content)) resizedImage = imageProcess.resizeImage(image, 620);
		else resizedImage = image;
		String uuid = UUID.randomUUID().toString();
		long size = resizedImage.getSize(); // 파일 크기
		
		ObjectMetadata objectMetaData = new ObjectMetadata();
		objectMetaData.setContentType(resizedImage.getContentType());
		objectMetaData.setContentLength(size);
		
		// S3에 업로드
		amazonS3Client.putObject(
				new PutObjectRequest(bucket, folder + "/" + uuid, resizedImage.getInputStream(), objectMetaData)
						.withCannedAcl(CannedAccessControlList.PublicRead)
		);
		
		String path = amazonS3Client.getUrl(bucket, folder + "/" + uuid).toString(); // 접근가능한 URL 가져오기
		log.info("객체 업로드 완료 : " + path);
		
		return path;
	}
	
	//파일 삭제
	public void delete (String fileUrl) throws AmazonServiceException{
		amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, fileUrl));
		log.info("객체 삭제됨 : " + fileUrl);
	}
}
