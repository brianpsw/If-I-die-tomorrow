package com.a307.ifIDieTomorrow.global.util;

import com.a307.ifIDieTomorrow.domain.entity.Token;
import com.a307.ifIDieTomorrow.domain.repository.TokenRepository;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Component
public class FirebaseUtil {

    private final TokenRepository tokenRepository;

    public FirebaseUtil(TokenRepository tokenRepository) throws IOException {
        this.tokenRepository = tokenRepository;
        Resource resourceContent = new ClassPathResource("if-i-die-tomorrow-firebase-adminsdk-rsuyq-a2f5940ef9.json");
        InputStream serviceAccount = resourceContent.getInputStream();

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        FirebaseApp.initializeApp(options);
    }

    @Async
    public void sendPush(List<Token> tokenList, String title, String body) throws FirebaseMessagingException {

        List<String> registrationTokens = tokenList.stream().map(o -> o.getToken()).collect(Collectors.toList());

        MulticastMessage message = MulticastMessage.builder()
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .setWebpushConfig(WebpushConfig.builder().setFcmOptions(WebpushFcmOptions.builder().setLink("https://www.google.com").build()).build())
                .addAllTokens(registrationTokens)
                .build();
        BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
// See the BatchResponse reference documentation
// for the contents of response.

        if (response.getFailureCount() > 0) {
            List<SendResponse> responses = response.getResponses();
            List<String> failedTokens = new ArrayList<>();
            for (int i = 0; i < responses.size(); i++) {
                if (!responses.get(i).isSuccessful()) {
                    // The order of responses corresponds to the order of the registration tokens.
                    failedTokens.add(registrationTokens.get(i));
                }
            }
            List<Token> filteredList = tokenList.stream()
                    .filter(token -> failedTokens.stream().anyMatch(Predicate.isEqual(token.getToken())))
                    .collect(Collectors.toList());
            tokenRepository.deleteAllInBatch(filteredList);
        }
        System.out.println(response.getSuccessCount() + " messages were sent successfully");
    }

}
