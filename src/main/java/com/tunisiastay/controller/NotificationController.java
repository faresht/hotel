package com.tunisiastay.controller;

import com.tunisiastay.entity.Notification;
import com.tunisiastay.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Notification management APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @GetMapping
    @Operation(summary = "Get user notifications")
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }
    
    @GetMapping("/paginated")
    @Operation(summary = "Get paginated user notifications")
    public ResponseEntity<Page<Notification>> getUserNotificationsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, page, size));
    }
    
    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notifications count")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }
    
    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/mark-all-read")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
    
    private Long getUserIdFromEmail(String email) {
        return 1L; // Placeholder
    }
}
