package com.example.thirdprojectback.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    // 시크릿 키를 application.yml 또는 환경변수에서 주입받음
    @Value("${JWT_SECRET_KEY:my-secret-key-which-is-very-very-secret-123456}")
    private String secretKeyString;

    // 토큰 만료 시간 (기본 1시간)
    @Value("${JWT_EXPIRATION_MS:3600000}")
    private long expirationTimeMs;

    private SecretKey secretKey;

    // 시크릿 키 초기화
    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    // 토큰 생성
    public String generateToken(Long userId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTimeMs);

        return Jwts.builder()
                .claim("userId", userId)           // 사용자 ID를 클레임에 포함
                .subject(email)                    // subject는 일반적으로 고유 식별자 (여기선 email)
                .issuedAt(now)                     // 토큰 발급 시각
                .expiration(expiryDate)            // 만료 시간
                .signWith(secretKey)               // 서명
                .compact();
    }


    // 토큰에서 이메일 추출
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("토큰 유효성 실패: " + e.getMessage());
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("userId", Long.class);
    }
}
