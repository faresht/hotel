package com.tunisiastay.controller;

import com.tunisiastay.dto.BookingRequest;
import com.tunisiastay.entity.Booking;
import com.tunisiastay.entity.User;
import com.tunisiastay.repository.UserRepository;
import com.tunisiastay.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.createBooking(request, userId));
    }

    @GetMapping
    @Operation(summary = "Get user bookings")
    public ResponseEntity<List<Booking>> getUserBookings(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.getBookingById(id, userId));
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "Confirm booking")
    public ResponseEntity<Booking> confirmBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.confirmBooking(id));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }

    private Long getUserIdFromEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
