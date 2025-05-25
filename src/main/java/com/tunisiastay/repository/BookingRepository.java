package com.tunisiastay.repository;

import com.tunisiastay.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Booking> findByHotelIdOrderByCreatedAtDesc(Long hotelId);
    
    Page<Booking> findByStatusOrderByCreatedAtDesc(Booking.Status status, Pageable pageable);
    
    Page<Booking> findByBookingReferenceContainingIgnoreCaseOrGuestNameContainingIgnoreCaseOrGuestEmailContainingIgnoreCase(
        String reference, String name, String email, Pageable pageable);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED'")
    long countConfirmedBookings();
    
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status = 'CONFIRMED' AND b.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt >= :startDate AND b.createdAt <= :endDate")
    long countBookingsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status = 'CONFIRMED' AND " +
           "b.paymentStatus = 'PAID' AND b.createdAt >= :startDate AND b.createdAt <= :endDate")
    BigDecimal getRevenueBetweenDates(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);
    
    boolean existsByRoomIdAndCheckInDateLessThanEqualAndCheckOutDateGreaterThanAndStatusIn(
        Long roomId, LocalDate checkOut, LocalDate checkIn, List<Booking.Status> statuses);
}
