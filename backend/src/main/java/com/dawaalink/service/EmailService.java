package com.dawaalink.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final RestTemplate restTemplate;
    
    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    public EmailService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendVerificationEmail(String to, String code) {
        String subject = "Verify your DawaaLink Account";
        String html = buildHtmlTemplate("Welcome to DawaaLink", 
                "Your confirmation code is: <strong>" + code + "</strong><br><br>Please enter this code in the app to activate your account.");
        sendResendEmail(to, subject, html);
    }

    public void sendSwapUpdate(String to, String message) {
        String subject = "DawaaLink: Swap Update";
        String html = buildHtmlTemplate("Swap Status Update", message);
        sendResendEmail(to, subject, html);
    }

    private void sendResendEmail(String to, String subject, String htmlBody) {
        if (resendApiKey == null || resendApiKey.isEmpty() || "re_your_api_key_here".equals(resendApiKey)) {
            System.out.println("WARNING: RESEND_API_KEY not configured. Skipping email to " + to);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> body = Map.of(
                    "from", "noreply@dawaa-link.com",
                    "to", List.of(to),
                    "subject", subject,
                    "html", htmlBody
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity("https://api.resend.com/emails", request, String.class);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    private String buildHtmlTemplate(String title, String content) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head><style>" +
                "body { font-family: 'Inter', sans-serif; background-color: #FCFBFF; color: #1A1A2E; margin: 0; padding: 20px; }" +
                ".container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 14px rgba(84, 33, 172, 0.1); }" +
                ".header { background-color: #5421AC; padding: 20px; text-align: center; color: #FFFFFF; font-size: 24px; font-weight: bold; }" +
                ".content { padding: 30px; font-size: 16px; line-height: 1.6; color: #4A4453; }" +
                ".footer { background-color: #F5F2FF; padding: 15px; text-align: center; font-size: 12px; color: #7B7485; }" +
                "</style></head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>DawaaLink</div>" +
                "<div class='content'>" +
                "<h2>" + title + "</h2>" +
                "<p>" + content + "</p>" +
                "</div>" +
                "<div class='footer'>&copy; 2026 DawaaLink. All rights reserved.</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
