package com.tunisiastay.service;

import com.tunisiastay.dto.AuthRequest;
import com.tunisiastay.dto.AuthResponse;
import com.tunisiastay.dto.RegisterRequest;
import com.tunisiastay.entity.User;
import com.tunisiastay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final NotificationService notificationService;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(User.Role.USER)
                .loyaltyLevel(User.LoyaltyLevel.BRONZE)
                .points(100) // Points de bienvenue
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();
        
        var savedUser = userRepository.save(user);
        
        // Notification de bienvenue
        notificationService.createWelcomeNotification(savedUser);
        
        var jwtToken = jwtService.generateToken(savedUser);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserDto(savedUser))
                .build();
    }
    
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        var jwtToken = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserDto(user))
                .build();
    }
    
    private AuthResponse.UserDto mapToUserDto(User user) {
        return AuthResponse.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .role(user.getRole())
                .loyaltyLevel(user.getLoyaltyLevel())
                .points(user.getPoints())
                .build();
    }
}
