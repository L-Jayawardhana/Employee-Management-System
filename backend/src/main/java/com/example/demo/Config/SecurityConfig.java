package com.example.demo.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.demo.service.EmployeeService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(EmployeeService employeeService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(employeeService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider authProvider) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow CORS preflight requests
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/employee/**").hasAnyRole("ADMIN", "HR")
                        .requestMatchers("/api/v1/department/create").hasAnyRole("ADMIN")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/department/getAll").hasAnyRole("ADMIN", "HR")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/department/getById/**").hasAnyRole("ADMIN", "HR")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/department/update/**").hasAnyRole("ADMIN", "HR")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/department/delete/**").hasAnyRole("ADMIN")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/salary/create").hasAnyRole("ADMIN", "HR")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/salary/getByEmpId/**").hasAnyRole("ADMIN", "HR", "USER")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/salary/getById/**").hasAnyRole("ADMIN", "HR")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/attendance/**").hasAnyRole("ADMIN", "HR")// Temporarily allow all for testing
                        .requestMatchers("/api/v1/attendance/employee/{id}/dateRange/**").hasAnyRole("ADMIN", "HR", "USER")// Temporarily allow all for testing
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
