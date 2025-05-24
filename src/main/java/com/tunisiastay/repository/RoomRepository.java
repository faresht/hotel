package com.tunisiastay.repository;

import com.tunisiastay.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    List<Room> findByHotelIdAndAvailableTrue(Long hotelId);
    
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.available = true AND " +
           "r.capacity >= :guests AND " +
           "NOT EXISTS (SELECT b FROM Booking b WHERE b.room = r AND " +
           "b.status IN ('CONFIRMED', 'PENDING') AND " +
           "((b.checkInDate <= :checkOut AND b.checkOutDate > :checkIn)))")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId,
                                 @Param("checkIn") LocalDate checkIn,
                                 @Param("checkOut") LocalDate checkOut,
                                 @Param("guests") Integer guests);
    
    @Query("SELECT MIN(r.pricePerNight) FROM Room r WHERE r.hotel.id = :hotelId AND r.available = true")
    BigDecimal findMinPriceByHotelId(@Param("hotelId") Long hotelId);
    
    List<Room> findByTypeAndAvailableTrue(Room.RoomType type);
}
