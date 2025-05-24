package com.tunisiastay.controller;

import com.tunisiastay.entity.Booking;
import com.tunisiastay.entity.Hotel;
import com.tunisiastay.entity.User;
import com.tunisiastay.repository.BookingRepository;
import com.tunisiastay.repository.HotelRepository;
import com.tunisiastay.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin management APIs")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;
    
    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard data")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Statistiques principales
        dashboard.put("totalUsers", userRepository.countUsers());
        dashboard.put("totalHotels", hotelRepository.countAvailableHotels());
        dashboard.put("totalBookings", bookingRepository.countConfirmedBookings());
        dashboard.put("totalRevenue", bookingRepository.getTotalRevenue());
        
        // Données mensuelles
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        
        dashboard.put("monthlyBookings", bookingRepository.countBookingsBetweenDates(startOfMonth, endOfMonth));
        dashboard.put("monthlyRevenue", bookingRepository.getRevenueBetweenDates(startOfMonth, endOfMonth));
        
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userRepository.findAll(PageRequest.of(page, size)));
    }
    
    @GetMapping("/hotels")
    @Operation(summary = "Get all hotels")
    public ResponseEntity<Page<Hotel>> getAllHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(hotelRepository.findAll(PageRequest.of(page, size)));
    }
    
    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings")
    public ResponseEntity<Page<Booking>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingRepository.findAll(PageRequest.of(page, size)));
    }
    
    @GetMapping("/bookings/pending")
    @Operation(summary = "Get pending bookings")
    public ResponseEntity<Page<Booking>> getPendingBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingRepository.findByStatusOrderByCreatedAtDesc(
            Booking.Status.PENDING, PageRequest.of(page, size)));
    }
}
