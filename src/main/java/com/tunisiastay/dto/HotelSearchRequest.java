package com.tunisiastay.dto;

import com.tunisiastay.entity.Hotel;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class HotelSearchRequest {
    
    private String location;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private Hotel.Category category;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal minRating;
    private String sortBy = "rating"; // rating, price-low, price-high, reviews
    private int page = 0;
    private int size = 10;
}
