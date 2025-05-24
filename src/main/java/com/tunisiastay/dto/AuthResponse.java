package com.tunisiastay.dto;

import com.tunisiastay.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private UserDto user;
    
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String address;
        private String bio;
        private String avatar;
        private User.Role role;
        private User.LoyaltyLevel loyaltyLevel;
        private Integer points;
    }
}
