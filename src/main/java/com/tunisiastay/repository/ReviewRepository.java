package com.tunisiastay.repository;

import com.tunisiastay.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByHotelIdOrderByCreatedAtDesc(Long hotelId);
    
    Page<Review> findByHotelIdOrderByCreatedAtDesc(Long hotelId, Pageable pageable);
    
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    boolean existsByUserIdAndHotelId(Long userId, Long hotelId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.hotel.id = :hotelId")
    BigDecimal getAverageRatingByHotelId(@Param("hotelId") Long hotelId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.hotel.id = :hotelId")
    long countByHotelId(@Param("hotelId") Long hotelId);
    
    @Query("SELECT r FROM Review r WHERE r.verified = true ORDER BY r.createdAt DESC")
    Page<Review> findVerifiedReviews(Pageable pageable);
}
