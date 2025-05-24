package com.tunisiastay.service;

import com.tunisiastay.dto.BookingRequest;
import com.tunisiastay.entity.Booking;
import com.tunisiastay.entity.Hotel;
import com.tunisiastay.entity.Room;
import com.tunisiastay.entity.User;
import com.tunisiastay.repository.BookingRepository;
import com.tunisiastay.repository.HotelRepository;
import com.tunisiastay.repository.RoomRepository;
import com.tunisiastay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    @Transactional
    public Booking createBooking(BookingRequest request, Long userId) {
        // Validation
        if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        // Vérifier la disponibilité
        if (!isRoomAvailable(room.getId(), request.getCheckInDate(), request.getCheckOutDate())) {
            throw new RuntimeException("Room is not available for selected dates");
        }
        
        // Calculer le prix
        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal totalAmount = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        
        // Appliquer la réduction fidélité
        BigDecimal discountAmount = calculateLoyaltyDiscount(user, totalAmount);
        totalAmount = totalAmount.subtract(discountAmount);
        
        Booking booking = Booking.builder()
                .bookingReference(generateBookingReference())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .nights((int) nights)
                .guests(request.getGuests())
                .totalAmount(totalAmount)
                .originalPrice(room.getPricePerNight().multiply(BigDecimal.valueOf(nights)))
                .discountAmount(discountAmount)
                .status(Booking.Status.PENDING)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .specialRequests(request.getSpecialRequests())
                .guestName(request.getGuestName() != null ? request.getGuestName() : user.getName())
                .guestEmail(request.getGuestEmail() != null ? request.getGuestEmail() : user.getEmail())
                .guestPhone(request.getGuestPhone() != null ? request.getGuestPhone() : user.getPhone())
                .user(user)
                .hotel(hotel)
                .room(room)
                .build();
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Ajouter des points de fidélité
        addLoyaltyPoints(user, totalAmount);
        
        // Notification
        notificationService.createBookingNotification(user, savedBooking);
        
        return savedBooking;
    }
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Booking getBookingById(Long id, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        return booking;
    }
    
    @Transactional
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.Status.CONFIRMED);
        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        
        return bookingRepository.save(booking);
    }
    
    @Transactional
    public Booking cancelBooking(Long bookingId, Long userId) {
        Booking booking = getBookingById(bookingId, userId);
        
        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }
        
        booking.setStatus(Booking.Status.CANCELLED);
        booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED);
        
        return bookingRepository.save(booking);
    }
    
    private boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        List<Booking.Status> conflictingStatuses = List.of(
            Booking.Status.CONFIRMED, 
            Booking.Status.PENDING
        );
        
        return !bookingRepository.existsByRoomIdAndCheckInDateLessThanEqualAndCheckOutDateGreaterThanAndStatusIn(
            roomId, checkOut, checkIn, conflictingStatuses
        );
    }
    
    private String generateBookingReference() {
        return "TS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private BigDecimal calculateLoyaltyDiscount(User user, BigDecimal amount) {
        return switch (user.getLoyaltyLevel()) {
            case BRONZE -> amount.multiply(BigDecimal.valueOf(0.05)); // 5%
            case SILVER -> amount.multiply(BigDecimal.valueOf(0.10)); // 10%
            case GOLD -> amount.multiply(BigDecimal.valueOf(0.15)); // 15%
        };
    }
    
    private void addLoyaltyPoints(User user, BigDecimal amount) {
        int pointsToAdd = amount.intValue() / 10; // 1 point par 10€
        user.setPoints(user.getPoints() + pointsToAdd);
        
        // Mise à jour du niveau de fidélité
        updateLoyaltyLevel(user);
        
        userRepository.save(user);
    }
    
    private void updateLoyaltyLevel(User user) {
        int points = user.getPoints();
        User.LoyaltyLevel newLevel = user.getLoyaltyLevel();
        
        if (points >= 2500 && user.getLoyaltyLevel() != User.LoyaltyLevel.GOLD) {
            newLevel = User.LoyaltyLevel.GOLD;
        } else if (points >= 1000 && user.getLoyaltyLevel() == User.LoyaltyLevel.BRONZE) {
            newLevel = User.LoyaltyLevel.SILVER;
        }
        
        if (newLevel != user.getLoyaltyLevel()) {
            user.setLoyaltyLevel(newLevel);
            notificationService.createLoyaltyUpgradeNotification(user, newLevel);
        }
    }
}
