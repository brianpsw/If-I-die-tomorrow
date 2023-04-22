package com.a307.ifIDieTomorrow.global.util;

import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class S3Upload {
	
	private final AmazonS3Client amazonS3Client;
	
	@Value("${S3_BUCKET}")
	private String bucket;
	
	public String uploadFiles(MultipartFile multipartFile, String dirName) throws IOException, IllegalArgumentException {
		File uploadFile = convert(multipartFile)  // 파일 변환할 수 없으면 에러
				.orElseThrow(() -> new IllegalArgumentException("error: MultipartFile -> File convert fail"));
		log.info("현재 uploadFiles");
		return upload(uploadFile, dirName);
	}
	
	public String upload(File uploadFile, String filePath) {
		String fileName = filePath + "/" + UUID.randomUUID();   // S3에 저장된 파일 이름
		log.info("file name = " + fileName);
		String uploadImageUrl = putS3(uploadFile, fileName); // s3로 업로드
		removeNewFile(uploadFile);
		return uploadImageUrl;
	}
	
	// S3로 업로드
	private String putS3(File uploadFile, String fileName) {
		amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile).withCannedAcl(CannedAccessControlList.PublicRead));
		return amazonS3Client.getUrl(bucket, fileName).toString();
	}
	
	// 로컬에 저장된 이미지 지우기
	private void removeNewFile(File targetFile) {
		if (targetFile.delete()) {
			log.info("File delete success");
			return;
		}
		log.warn("File delete fail"); // error를 throw 하는 게 낫지 않나?
	}
	
	// 로컬에 파일 업로드 하기
	private Optional<File> convert(MultipartFile file) throws IOException {
		File convertFile = new File(file.getOriginalFilename());
		if (convertFile.createNewFile()) {
			try (FileOutputStream fos = new FileOutputStream(convertFile)) {
				fos.write(file.getBytes());
			}
			return Optional.of(convertFile);
		}
		return Optional.empty();
	}
	
	//파일 삭제
	public void fileDelete(String fileUrl) throws AmazonServiceException{
		amazonS3Client.deleteObject(new DeleteObjectRequest(bucket, fileUrl));
		log.info(String.format("[%s] deletion complete", fileUrl));
	}
}
