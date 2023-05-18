package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoByCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoResDto;
import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.domain.entity.After;
import com.a307.ifIDieTomorrow.domain.repository.*;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AfterServiceImpl implements AfterService{
    private final AfterRepository afterRepository;
    private final BucketRepository bucketRepository;
    private final DiaryRepository diaryRepository;
    private final PhotoService photoService;
    private final WillService willService;
    private final WillRepository willRepository;
    private final FileUtil fileUtil;

    @Override
    public Map<String, Object> getData(String pwd) throws NotFoundException {
        After after = afterRepository.findByUuid(pwd).orElseThrow(() -> new NotFoundException("사후 페이지가 존재하지 않습니다."));
        HashMap<String, Object> result = new HashMap<>();
        result.put("photos", photoService.getPhotoByUser(after.getUserId()));
        result.put("diaries", diaryRepository.findAllByUserIdIdWithUserNickName(after.getUserId()));
        result.put("buckets", bucketRepository.findAllByUserIdWithUserNickName(after.getUserId()));
        result.put("will", willRepository.getByUserId(after.getUserId()));
        return result;
    }

    @Override
    public Map<String, Object> getMyData() throws NotFoundException {
        HashMap<String, Object> result = new HashMap<>();
        result.put("photos", photoService.getPhotoByUser(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()));
        result.put("diaries", diaryRepository.findAllByUserIdIdWithUserNickName(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()));
        result.put("buckets", bucketRepository.findAllByUserIdWithUserNickName(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()));
        result.put("will", willService.getWillByUserId());
        return result;
    }

    @Override
    public String downloadFile(String uuid) throws NotFoundException, IOException {
        Map<String, Object> result = getMyData();

        String basicDirectory = "./";
        fileUtil.createDirectory(basicDirectory + uuid);
        String commonDirectory = basicDirectory + uuid + "/";
        fileUtil.copyDirectory("./IIDT", basicDirectory + uuid);
        fileUtil.downloadFile(((GetWillByUserResDto)result.get("will")).getVideoUrl(), commonDirectory + "will/" + ((GetWillByUserResDto)result.get("will")).getVideoUrl().substring(((GetWillByUserResDto)result.get("will")).getVideoUrl().lastIndexOf("/") + 1) + fileUtil.getContentType(((GetWillByUserResDto)result.get("will")).getVideoUrl()));
        fileUtil.downloadFile(((GetWillByUserResDto)result.get("will")).getSignUrl(), commonDirectory + "will/" + ((GetWillByUserResDto)result.get("will")).getSignUrl().substring(((GetWillByUserResDto)result.get("will")).getSignUrl().lastIndexOf("/") + 1) + fileUtil.getContentType(((GetWillByUserResDto)result.get("will")).getSignUrl()));
        for (GetBucketResDto item : (ArrayList<GetBucketResDto>)result.get("buckets")
             ) {
            if(item.getImageUrl() != null && !"".equals(item.getImageUrl())){
                fileUtil.downloadFile(item.getImageUrl(), commonDirectory + "bucket/" + item.getImageUrl().substring(item.getImageUrl().lastIndexOf("/")) + fileUtil.getContentType(item.getImageUrl()));
            }
        }
        for (GetDiaryResDto item : (ArrayList<GetDiaryResDto>)result.get("diaries")
        ) {
            if(item.getImageUrl() != null && !"".equals(item.getImageUrl())){
                fileUtil.downloadFile(item.getImageUrl(), commonDirectory + "diary/"+ item.getImageUrl().substring(item.getImageUrl().lastIndexOf("/")) + fileUtil.getContentType(item.getImageUrl()));
            }
        }
        for (GetPhotoByCategoryResDto item : (ArrayList<GetPhotoByCategoryResDto>)result.get("photos")
             ) {

            if(item.getCategory().getImageUrl() != null && !"".equals(item.getCategory().getImageUrl())){
                fileUtil.downloadFile(item.getCategory().getImageUrl(), commonDirectory + "category/" + (item.getCategory().getImageUrl().substring(item.getCategory().getImageUrl().lastIndexOf("/"))) + fileUtil.getContentType(item.getCategory().getImageUrl()));
            }
            for (GetPhotoResDto photo : item.getPhotos()
                 ) {
                if((photo.getImageUrl() != null && !"".equals(photo.getImageUrl()))){
                    fileUtil.downloadFile(photo.getImageUrl(), commonDirectory + "photo/" + photo.getImageUrl().substring(photo.getImageUrl().lastIndexOf("/")) + fileUtil.getContentType(photo.getImageUrl()));
                }
            }
        }
        fileUtil.saveHashMapToJson(result, commonDirectory + "data.json");
        fileUtil.zipDirectory(commonDirectory, basicDirectory + uuid + ".zip" );

        return basicDirectory + uuid + ".zip";
    }
}
