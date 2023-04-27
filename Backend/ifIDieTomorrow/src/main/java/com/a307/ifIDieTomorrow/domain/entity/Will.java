package com.a307.ifIDieTomorrow.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "will")
public class Will extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long willId;
	
	@Column(nullable = false)
	private Long userId;
	
	// 유저가 텍스트로 입력하거나 음성으로 올릴 수 있어서 null 허용
	@Column(columnDefinition = "TEXT")
	private String content;
	
	@Column
	private String videoUrl;
	
	@Column
	private String voiceUrl;
	
	// 일단 null 열어뒀습니다.
	@Column
	private String signUrl;
	
	public void createSign (String signUrl) {
		this.signUrl = signUrl;
	}
	
	public void updateVideo (String videoUrl) {
		this.videoUrl = videoUrl;
	}
	
	public void updateVoice (String voiceUrl) {
		this.voiceUrl = voiceUrl;
	}
	
}
