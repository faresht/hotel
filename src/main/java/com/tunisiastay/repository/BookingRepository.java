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
import java.time.Month;
import java.util.List;
import java.util.Map;

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

    @Query("SELECT FUNCTION('MONTH', b.checkInDate) as month, " +
           "COUNT(b) as reservations, " +
           "SUM(b.totalAmount) as revenue " +
           "FROM Booking b " +
           "WHERE FUNCTION('YEAR', b.checkInDate) = FUNCTION('YEAR', CURRENT_DATE) " +
           "AND b.status IN ('CONFIRMED', 'COMPLETED') " +
           "GROUP BY FUNCTION('MONTH', b.checkInDate) " +
           "ORDER BY FUNCTION('MONTH', b.checkInDate)")
    List<Map<String, Object>> getMonthlyStatistics();

    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE FUNCTION('MONTH', b.checkInDate) = :month " +
           "AND FUNCTION('YEAR', b.checkInDate) = :year " +
           "AND b.status IN ('CONFIRMED', 'COMPLETED')")
    long countBookingsByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(b.nights) FROM Booking b " +
           "WHERE b.checkInDate >= :startDate AND b.checkOutDate <= :endDate " +
           "AND b.status IN ('CONFIRMED', 'COMPLETED')")
    Long getTotalRoomNightsBetweenDates(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
}
