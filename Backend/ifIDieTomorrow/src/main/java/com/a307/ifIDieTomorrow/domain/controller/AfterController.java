package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.service.AfterService;
import com.a307.ifIDieTomorrow.global.aop.DownloadInterceptor;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.util.FileUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Tag(name = "사후 페이지", description = "APIs for AFTER")
@RestController
@RequiredArgsConstructor
@RequestMapping("/after")
public class AfterController {
    private final AfterService afterService;
    private final FileUtil fileUtil;

    @PostMapping()
    @Operation(summary = "사후 페이지 전송", description = "사후 페이지 데이터를 전송받음.")
    public ResponseEntity<Map<String, Object>> getData(
            @RequestBody Map<String, String> passwordMap) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(afterService.getData(passwordMap.get("pwd")));
    }

    @GetMapping()
    @Operation(summary = "내 사후 페이지 전송", description = "내 사후 페이지 데이터를 전송받음.")
    public ResponseEntity<Map<String, Object>> getMyData(
            ) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(afterService.getMyData());
    }

    @GetMapping("/download")
    @DownloadInterceptor
    public ResponseEntity<Resource> downloadFile(HttpServletRequest request) throws IOException, NotFoundException {
        // Load file as Resource
        String uuid = UUID.randomUUID().toString();
        String fileName = afterService.downloadFile(uuid);
        Resource resource = fileUtil.loadFileAsResource(fileName);

        // Determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        request.setAttribute("fileName", fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
