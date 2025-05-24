package com.tunisiastay.service;

import com.tunisiastay.dto.HotelSearchRequest;
import com.tunisiastay.entity.Hotel;
import com.tunisiastay.entity.Room;
import com.tunisiastay.repository.FavoriteRepository;
import com.tunisiastay.repository.HotelRepository;
import com.tunisiastay.repository.ReviewRepository;
import com.tunisiastay.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {
    
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteRepository favoriteRepository;
    
    public List<Hotel> getFeaturedHotels() {
        return hotelRepository.findByFeaturedTrue();
    }
    
    public Page<Hotel> searchHotels(HotelSearchRequest request) {
        Pageable pageable = createPageable(request);
        
        if (request.getMinPrice() != null && request.getMaxPrice() != null) {
            return hotelRepository.findByPriceRange(
                request.getMinPrice(), 
                request.getMaxPrice(), 
                pageable
            );
        }
        
        return hotelRepository.searchHotels(
            request.getLocation(),
            request.getCategory(),
            request.getMinRating(),
            pageable
        );
    }
    
    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }
    
    public List<Room> getHotelRooms(Long hotelId) {
        return roomRepository.findByHotelIdAndAvailableTrue(hotelId);
    }
    
    public List<Room> getAvailableRooms(Long hotelId, HotelSearchRequest request) {
        if (request.getCheckIn() != null && request.getCheckOut() != null) {
            return roomRepository.findAvailableRooms(
                hotelId,
                request.getCheckIn(),
                request.getCheckOut(),
                request.getGuests() != null ? request.getGuests() : 1
            );
        }
        return roomRepository.findByHotelIdAndAvailableTrue(hotelId);
    }
    
    public List<String> getAllLocations() {
        return hotelRepository.findAllLocations();
    }
    
    public boolean isHotelFavorite(Long hotelId, Long userId) {
        return favoriteRepository.existsByUserIdAndHotelId(userId, hotelId);
    }
    
    public void updateHotelRating(Long hotelId) {
        BigDecimal avgRating = reviewRepository.getAverageRatingByHotelId(hotelId);
        long reviewCount = reviewRepository.countByHotelId(hotelId);
        
        Hotel hotel = getHotelById(hotelId);
        hotel.setRating(avgRating != null ? avgRating : BigDecimal.ZERO);
        hotel.setReviewCount((int) reviewCount);
        
        hotelRepository.save(hotel);
    }
    
    private Pageable createPageable(HotelSearchRequest request) {
        Sort sort = switch (request.getSortBy()) {
            case "price-low" -> Sort.by("rooms.pricePerNight").ascending();
            case "price-high" -> Sort.by("rooms.pricePerNight").descending();
            case "reviews" -> Sort.by("reviewCount").descending();
            default -> Sort.by("rating").descending();
        };
        
        return PageRequest.of(request.getPage(), request.getSize(), sort);
    }
}
