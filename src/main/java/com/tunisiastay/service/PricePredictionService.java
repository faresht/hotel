package com.tunisiastay.service;

import com.tunisiastay.entity.Hotel;
import com.tunisiastay.entity.Room;
import com.tunisiastay.entity.RoomType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for predicting room prices using Ollama API.
 */
@Service
@RequiredArgsConstructor
public class PricePredictionService {

    private static final String OLLAMA_API_URL = "http://localhost:11434/api/generate";
    private final RestTemplate restTemplate;
    private final HotelService hotelService;

    /**
     * Predicts the price for a room based on its attributes and hotel information.
     *
     * @param roomId The ID of the room to predict price for
     * @return The predicted price
     */
    public BigDecimal predictPrice(Long roomId) {
        Room room = findRoom(roomId);
        Hotel hotel = room.getHotel();
        
        // Create prompt for Ollama
        String prompt = createPrompt(room, hotel);
        
        // Call Ollama API
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama3");  // Using llama3 model, adjust as needed
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    OLLAMA_API_URL, 
                    request, 
                    Map.class
            );
            
            // Extract and process the response
            if (response.getBody() != null && response.getBody().containsKey("response")) {
                String responseText = (String) response.getBody().get("response");
                return extractPriceFromResponse(responseText, room.getPricePerNight());
            }
        } catch (Exception e) {
            // Log the error and return the current price as fallback
            System.err.println("Error calling Ollama API: " + e.getMessage());
        }
        
        // Return current price as fallback
        return room.getPricePerNight();
    }
    
    /**
     * Creates a prompt for the Ollama model based on room and hotel attributes.
     */
    private String createPrompt(Room room, Hotel hotel) {
        return String.format(
                "Based on the following hotel and room information, suggest an optimal price per night in EUR:\n" +
                "Hotel: %s\n" +
                "Location: %s\n" +
                "Hotel Category: %s\n" +
                "Hotel Rating: %s\n" +
                "Room Type: %s\n" +
                "Room Capacity: %d persons\n" +
                "Room Size: %.2f square meters\n" +
                "Bed Count: %d\n" +
                "Bed Type: %s\n" +
                "Has Balcony: %s\n" +
                "Has Sea View: %s\n" +
                "Has Kitchen: %s\n" +
                "Current Price: %.2f EUR\n\n" +
                "Provide only the suggested price as a number (e.g., 120.50).",
                hotel.getName(),
                hotel.getLocation(),
                hotel.getCategory(),
                hotel.getRating(),
                room.getType(),
                room.getCapacity(),
                room.getSize(),
                room.getBedCount(),
                room.getBedType(),
                room.isHasBalcony() ? "Yes" : "No",
                room.isHasSeaView() ? "Yes" : "No",
                room.isHasKitchen() ? "Yes" : "No",
                room.getPricePerNight()
        );
    }
    
    /**
     * Extracts the predicted price from the Ollama response.
     * Falls back to the current price if extraction fails.
     */
    private BigDecimal extractPriceFromResponse(String response, BigDecimal currentPrice) {
        try {
            // Try to extract a number from the response
            String priceStr = response.replaceAll("[^0-9.]", "").trim();
            if (!priceStr.isEmpty()) {
                return new BigDecimal(priceStr).setScale(2, RoundingMode.HALF_UP);
            }
        } catch (Exception e) {
            System.err.println("Error extracting price from response: " + e.getMessage());
        }
        
        // Return current price as fallback
        return currentPrice;
    }
    
    /**
     * Finds a room by ID.
     */
    private Room findRoom(Long roomId) {
        // This is a simplified implementation. In a real application,
        // you would use a RoomRepository to find the room.
        for (Hotel hotel : hotelService.getFeaturedHotels()) {
            for (Room room : hotelService.getHotelRooms(hotel.getId())) {
                if (room.getId().equals(roomId)) {
                    return room;
                }
            }
        }
        throw new RuntimeException("Room not found");
    }
}