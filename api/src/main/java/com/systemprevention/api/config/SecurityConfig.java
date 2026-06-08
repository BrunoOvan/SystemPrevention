package com.systemprevention.api.config;

import com.systemprevention.api.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                        // DELTA / Groq liberado para teste
                        .requestMatchers(HttpMethod.POST, "/api/ia/delta").permitAll()

                        // Denúncias protegidas
                        .requestMatchers(HttpMethod.GET, "/api/denuncias/minhas").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/denuncias").authenticated()
                        .requestMatchers("/api/dashboard/**").authenticated()
                        // Consultas públicas/agregadas
                        .requestMatchers("/api/dashboard/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/denuncias/protocolo/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/denuncias").permitAll()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}