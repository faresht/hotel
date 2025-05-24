package com.tunisiastay.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    
    @NotNull(message = "Hotel ID is required")
    private Long hotelId;
    
    @NotNull(message = "Room ID is required")
    private Long roomId;
    
    @NotNull(message = "Check-in date is required")
    @Future(message = "Check-in date must be in the future")
    private LocalDate checkInDate;
    
    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;
    
    @NotNull(message = "Number of guests is required")
    @Positive(message = "Number of guests must be positive")
    private Integer guests;
    
    private String specialRequests;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
}
