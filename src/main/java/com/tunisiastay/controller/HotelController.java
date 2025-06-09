package com.tunisiastay.controller;

import com.tunisiastay.dto.HotelSearchRequest;
import com.tunisiastay.entity.Hotel;
import com.tunisiastay.entity.Room;
import com.tunisiastay.service.HotelService;
import com.tunisiastay.service.PricePredictionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@Tag(name = "Hotels", description = "Hotel management APIs")
@CrossOrigin(origins = "*")
public class HotelController {

    private final HotelService hotelService;
    private final PricePredictionService pricePredictionService;

    @GetMapping("/featured")
    @Operation(summary = "Get featured hotels")
        public ResponseEntity<List<Hotel>> getFeaturedHotels() {
        return ResponseEntity.ok(hotelService.getFeaturedHotels());
    }

    @PostMapping("/search")
    @Operation(summary = "Search hotels with filters")
    public ResponseEntity<Page<Hotel>> searchHotels(@RequestBody HotelSearchRequest request) {
        return ResponseEntity.ok(hotelService.searchHotels(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hotel by ID")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @GetMapping("/{id}/rooms")
    @Operation(summary = "Get hotel rooms")
    public ResponseEntity<List<Room>> getHotelRooms(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelRooms(id));
    }

    @PostMapping("/{id}/rooms/available")
    @Operation(summary = "Get available rooms for dates")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @PathVariable Long id,
            @RequestBody HotelSearchRequest request) {
        return ResponseEntity.ok(hotelService.getAvailableRooms(id, request));
    }

    @GetMapping("/locations")
    @Operation(summary = "Get all available locations")
    public ResponseEntity<List<String>> getAllLocations() {
        return ResponseEntity.ok(hotelService.getAllLocations());
    }

    @GetMapping("/rooms/{roomId}/predict-price")
    @Operation(summary = "Predict optimal price for a room using AI")
    public ResponseEntity<Map<String, Object>> predictRoomPrice(@PathVariable Long roomId) {
        BigDecimal predictedPrice = pricePredictionService.predictPrice(roomId);

        Map<String, Object> response = new HashMap<>();
        response.put("roomId", roomId);
        response.put("predictedPrice", predictedPrice);

        return ResponseEntity.ok(response);
    }
}
