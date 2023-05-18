package com.a307.ifIDieTomorrow.global.util;

import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

public class ConvertToMultipartFile implements MultipartFile {
	
	private final String name;
	
	private String originalFilename;
	
	private String contentType;
	
	private final byte[] content;
	
	boolean isEmpty;
	
	public ConvertToMultipartFile (String name, String originalFilename, String contentType, byte[] content) {
		this.name = name;
		this.originalFilename = originalFilename;
		this.contentType = contentType;
		this.content = (content != null ? content : new byte[0]);
		this.isEmpty = false;
	}
	
	@Override
	public String getName() {
		return this.name;
	}
	
	@Override
	public String getOriginalFilename() {
		return this.originalFilename;
	}
	
	@Override
	public String getContentType() {
		return this.contentType;
	}
	
	@Override
	public boolean isEmpty() {
		return (this.content.length == 0);
	}
	
	@Override
	public long getSize() {
		return this.content.length;
	}
	
	@Override
	public byte[] getBytes() {
		return this.content;
	}
	
	@Override
	public InputStream getInputStream() {
		return new ByteArrayInputStream(this.content);
	}
	
	@Override
	public void transferTo(File dest) throws IOException, IllegalStateException {
		FileCopyUtils.copy(this.content, dest);
	}
	
}