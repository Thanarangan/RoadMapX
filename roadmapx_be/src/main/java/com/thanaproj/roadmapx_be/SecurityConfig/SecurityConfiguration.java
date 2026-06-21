package com.thanaproj.roadmapx_be.SecurityConfig;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.thanaproj.roadmapx_be.Service.CustomUserDetails.CustomUserDetailsService;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtFilter jwtFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfiguration(JwtFilter jwtFilter,
        CustomUserDetailsService customUserDetailsService) {
        this.jwtFilter = jwtFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173", "https://roadmap-x-kappa.vercel.app"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) ->
                    response.sendError(401, "Unauthorized"))
                .accessDeniedHandler((request, response, accessDeniedException) ->
                    response.sendError(403, "Forbidden"))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/register", "/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/admin/content-managers").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/domains/admin/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/domains/admin/addDomain").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/domains/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/domains/getAllInactiveDomains").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/domains/{domainId}/approve", "/api/domains/{domainId}/reject").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/roadmap/admin/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/roadmap/admin/add").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/roadmap/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/roadmap/admin/pending").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/roadmap/admin/**").hasRole("ADMIN")
                .requestMatchers("/roadmap/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/roadmap/cm/adddraft", "/roadmap/cm/add").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.GET, "/roadmap/cm/draft").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/roadmap/cm/{roadMapId}/submit").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/roadmap/cm/{roadMapId}").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.POST, "/topics/cm/addTopic").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/topics/cm/updatetopic/**").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/topics/cm/deletetopic/**").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.POST, "/resources/add").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/resources/update/**").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/resources/delete/**").hasAnyRole("ADMIN", "CONTENT_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/domainservices/addDomainToUser/**").hasRole("STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/domainservices/current").hasRole("STUDENT")
                .requestMatchers(HttpMethod.POST, "/user-topic-progress/save").hasRole("STUDENT")
                .requestMatchers(HttpMethod.DELETE, "/user-topic-progress/delete/**").hasRole("STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/domains").authenticated()
                .requestMatchers(HttpMethod.GET, "/roadmap/domain/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/topics/roadmap/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/resources/topic/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/user-topic-progress/**").authenticated()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
