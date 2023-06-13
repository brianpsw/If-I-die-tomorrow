package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetDiaryWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoByCategoryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Notification;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.NotificationRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService{
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepositoy;


    @Override
    public GetPageDto getNotificationByUserId(Integer pageNo, Integer pageSize) {
        pageNo = Optional.ofNullable(pageNo).orElse(0);
        pageSize = Optional.ofNullable(pageSize).orElse(10);
        PageRequest pageable = PageRequest.of(pageNo, pageSize);

        Optional<Notification> optionalNotification = getNotification();
        if(optionalNotification.isPresent()){
            Notification notification = optionalNotification.get();
            notification.setUpdatedAt(LocalDateTime.now());
            notificationRepositoy.save(notification);
        } else {
            notificationRepositoy.save(Notification.builder()
                    .userId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()).build());
            return new GetPageDto();
        }

//		페이징 객체
        Page<CreateCommentResDto> result = commentRepository.findAllByUserId(pageable, ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId());

//		dto 리스트로 변환
        List<CreateCommentResDto> data = result.getContent();

        return GetPageDto.builder()
                .data(data)
                .hasNext(result.hasNext())
                .build();
    }

    @Override
    public Long getNotificationCount() {

        Optional<Notification> optionalNotification = getNotification();
        LocalDateTime updatedTime;
        if(optionalNotification.isPresent()){
            Notification notification = optionalNotification.get();
            updatedTime = notification.getUpdatedAt();
        } else {
            return 0L;
        }

        Long count = commentRepository.CountByUserIdAndUpdatedTime(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId(), updatedTime);
        return count;
    }

    public Optional<Notification> getNotification(){
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = principal.getUserId();

        return notificationRepositoy.findByUserId(userId);
    }

}
