package com.tunisiastay.repository;

import com.tunisiastay.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<Favorite> findByUserIdAndHotelId(Long userId, Long hotelId);
    
    boolean existsByUserIdAndHotelId(Long userId, Long hotelId);
    
    void deleteByUserIdAndHotelId(Long userId, Long hotelId);
    
    long countByHotelId(Long hotelId);
}
