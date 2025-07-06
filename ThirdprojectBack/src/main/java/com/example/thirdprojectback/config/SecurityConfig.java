package com.example.thirdprojectback.config;

import com.example.thirdprojectback.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity // Spring Security 활성화
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // JwtAuthenticationFilter를 생성자 주입받습니다.
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // 1. PasswordEncoder 빈 등록 (비밀번호 암호화를 위해 필요)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. AuthenticationManager 빈 등록 (사용자 인증을 위해 필요, 주로 로그인 시 사용)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // 3. SecurityFilterChain 설정 (핵심 보안 설정)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 보호 비활성화 (REST API에서는 일반적으로 토큰 기반 인증 사용 시 비활성화)
            .csrf(AbstractHttpConfigurer::disable)
            // CORS 설정 적용
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 세션 사용 안 함 (JWT 사용 시 필수: 서버는 사용자 상태를 저장하지 않습니다)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // HTTP 요청에 대한 접근 규칙 설정
            .authorizeHttpRequests(authorize -> authorize
                // 인증 없이 접근 허용할 경로 설정
                .requestMatchers(
                    "/api/auth/**",     // 인증/로그인/회원가입 관련 API
                    "/swagger-ui/**",   // Swagger UI 접근 허용
                    "/v3/api-docs/**",  // OpenAPI 문서 접근 허용
                    "/h2-console/**",   // H2-Console 접근 허용 (개발 환경에서만 사용 권장)
                    "/error",           // Spring Boot 기본 오류 페이지 접근 허용
                    "/api/members/register", // 회원가입 엔드포인트도 permitAll에 추가 (AuthController에서 분리됨)
                    "/api/members/login" // 로그인 엔드포인트도 permitAll에 추가
                    // 여기에 기타 공개 경로를 추가합니다.
                ).permitAll()
                // 나머지 모든 요청은 인증 필요
                .anyRequest().authenticated()
            );

        // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 이전에 추가
        // 이렇게 하면 모든 요청이 먼저 JWT 필터를 거쳐 인증 여부를 확인합니다.
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS(Cross-Origin Resource Sharing) 설정 빈
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);          // 자격 증명 허용 (쿠키, HTTP 인증 등)
        config.addAllowedOriginPattern("*");       // 모든 Origin 허용 (운영 환경에서는 특정 도메인만 허용하도록 변경 권장)
        config.addAllowedHeader("*");              // 모든 헤더 허용
        config.addAllowedMethod("*");              // 모든 HTTP 메서드 (GET, POST, PUT, DELETE 등) 허용
        source.registerCorsConfiguration("/**", config); // 모든 경로에 CORS 설정 적용
        return source; // CorsConfigurationSource를 구현한 객체를 직접 반환
    }
}