package com.tunisiastay.repository;

import com.tunisiastay.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    List<Hotel> findByFeaturedTrue();
    
    List<Hotel> findByAvailableTrue();
    
    @Query("SELECT h FROM Hotel h WHERE h.available = true AND " +
           "(:location IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:category IS NULL OR h.category = :category) AND " +
           "(:minRating IS NULL OR h.rating >= :minRating)")
    Page<Hotel> searchHotels(@Param("location") String location,
                            @Param("category") Hotel.Category category,
                            @Param("minRating") BigDecimal minRating,
                            Pageable pageable);
    
    @Query("SELECT DISTINCT h.location FROM Hotel h WHERE h.available = true ORDER BY h.location")
    List<String> findAllLocations();
    
    @Query("SELECT COUNT(h) FROM Hotel h WHERE h.available = true")
    long countAvailableHotels();
    
    @Query("SELECT h FROM Hotel h WHERE h.available = true AND " +
           "EXISTS (SELECT r FROM Room r WHERE r.hotel = h AND r.available = true AND " +
           "r.pricePerNight BETWEEN :minPrice AND :maxPrice)")
    Page<Hotel> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                @Param("maxPrice") BigDecimal maxPrice,
                                Pageable pageable);
}
