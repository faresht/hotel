package com.tunisiastay.controller;

import com.tunisiastay.entity.Booking;
import com.tunisiastay.entity.Hotel;
import com.tunisiastay.entity.Room;
import com.tunisiastay.entity.User;
import com.tunisiastay.repository.BookingRepository;
import com.tunisiastay.repository.HotelRepository;
import com.tunisiastay.repository.RoomRepository;
import com.tunisiastay.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin management APIs")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    
    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard data")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Statistiques principales
        dashboard.put("totalUsers", userRepository.countUsers());
        dashboard.put("totalHotels", hotelRepository.countAvailableHotels());
        dashboard.put("totalRooms", roomRepository.count());
        dashboard.put("totalBookings", bookingRepository.countConfirmedBookings());
        dashboard.put("totalRevenue", bookingRepository.getTotalRevenue());
        
        // Données mensuelles
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        
        dashboard.put("monthlyBookings", bookingRepository.countBookingsBetweenDates(startOfMonth, endOfMonth));
        dashboard.put("monthlyRevenue", bookingRepository.getRevenueBetweenDates(startOfMonth, endOfMonth));
        
        // Statistiques par statut
        dashboard.put("pendingBookings", bookingRepository.findByStatusOrderByCreatedAtDesc(Booking.Status.PENDING, PageRequest.of(0, 1)).getTotalElements());
        dashboard.put("confirmedBookings", bookingRepository.findByStatusOrderByCreatedAtDesc(Booking.Status.CONFIRMED, PageRequest.of(0, 1)).getTotalElements());
        dashboard.put("cancelledBookings", bookingRepository.findByStatusOrderByCreatedAtDesc(Booking.Status.CANCELLED, PageRequest.of(0, 1)).getTotalElements());
        
        return ResponseEntity.ok(dashboard);
    }
    
    // ==================== GESTION DES UTILISATEURS ====================
    
    @GetMapping("/users")
    @Operation(summary = "Get all users with pagination and search")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<User> users;
        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search, search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/users/{id}")
    @Operation(summary = "Update user")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());
            user.setAddress(userDetails.getAddress());
            user.setRole(userDetails.getRole());
            user.setLoyaltyLevel(userDetails.getLoyaltyLevel());
            user.setPoints(userDetails.getPoints());
            user.setEnabled(userDetails.isEnabled());
            user.setUpdatedAt(LocalDateTime.now());
            
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/users/{id}/toggle-status")
    @Operation(summary = "Toggle user enabled status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEnabled(!user.isEnabled());
            user.setUpdatedAt(LocalDateTime.now());
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    // ==================== GESTION DES HÔTELS ====================
    
    @GetMapping("/hotels")
    @Operation(summary = "Get all hotels with pagination and search")
    public ResponseEntity<Page<Hotel>> getAllHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Hotel> hotels;
        if (search != null && !search.trim().isEmpty()) {
            hotels = hotelRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
                search, search, pageable);
        } else {
            hotels = hotelRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(hotels);
    }
    
    @GetMapping("/hotels/{id}")
    @Operation(summary = "Get hotel by ID")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        Optional<Hotel> hotel = hotelRepository.findById(id);
        return hotel.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/hotels")
    @Operation(summary = "Create new hotel")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        hotel.setCreatedAt(LocalDateTime.now());
        hotel.setUpdatedAt(LocalDateTime.now());
        Hotel savedHotel = hotelRepository.save(hotel);
        return ResponseEntity.ok(savedHotel);
    }
    
    @PutMapping("/hotels/{id}")
    @Operation(summary = "Update hotel")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotelDetails) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(id);
        if (optionalHotel.isPresent()) {
            Hotel hotel = optionalHotel.get();
            hotel.setName(hotelDetails.getName());
            hotel.setLocation(hotelDetails.getLocation());
            hotel.setAddress(hotelDetails.getAddress());
            hotel.setDescription(hotelDetails.getDescription());
            hotel.setCategory(hotelDetails.getCategory());
            hotel.setRating(hotelDetails.getRating());
            hotel.setAvailable(hotelDetails.getAvailable());
            hotel.setFeatured(hotelDetails.getFeatured());
            hotel.setPhone(hotelDetails.getPhone());
            hotel.setEmail(hotelDetails.getEmail());
            hotel.setUpdatedAt(LocalDateTime.now());
            
            Hotel savedHotel = hotelRepository.save(hotel);
            return ResponseEntity.ok(savedHotel);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/hotels/{id}")
    @Operation(summary = "Delete hotel")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        if (hotelRepository.existsById(id)) {
            hotelRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/hotels/{id}/toggle-availability")
    @Operation(summary = "Toggle hotel availability")
    public ResponseEntity<Hotel> toggleHotelAvailability(@PathVariable Long id) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(id);
        if (optionalHotel.isPresent()) {
            Hotel hotel = optionalHotel.get();
            hotel.setAvailable(!hotel.getAvailable());
            hotel.setUpdatedAt(LocalDateTime.now());
            Hotel savedHotel = hotelRepository.save(hotel);
            return ResponseEntity.ok(savedHotel);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/hotels/{id}/toggle-featured")
    @Operation(summary = "Toggle hotel featured status")
    public ResponseEntity<Hotel> toggleHotelFeatured(@PathVariable Long id) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(id);
        if (optionalHotel.isPresent()) {
            Hotel hotel = optionalHotel.get();
            hotel.setFeatured(!hotel.getFeatured());
            hotel.setUpdatedAt(LocalDateTime.now());
            Hotel savedHotel = hotelRepository.save(hotel);
            return ResponseEntity.ok(savedHotel);
        }
        return ResponseEntity.notFound().build();
    }
    
    // ==================== GESTION DES CHAMBRES ====================
    
    @GetMapping("/rooms")
    @Operation(summary = "Get all rooms with pagination and search")
    public ResponseEntity<Page<Room>> getAllRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long hotelId) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Room> rooms;
        if (hotelId != null) {
            if (search != null && !search.trim().isEmpty()) {
                rooms = roomRepository.findByHotelIdAndNameContainingIgnoreCase(hotelId, search, pageable);
            } else {
                rooms = roomRepository.findByHotelId(hotelId, pageable);
            }
        } else if (search != null && !search.trim().isEmpty()) {
            rooms = roomRepository.findByNameContainingIgnoreCaseOrRoomNumberContainingIgnoreCase(
                search, search, pageable);
        } else {
            rooms = roomRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(rooms);
    }
    
    @GetMapping("/rooms/{id}")
    @Operation(summary = "Get room by ID")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Optional<Room> room = roomRepository.findById(id);
        return room.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/rooms")
    @Operation(summary = "Create new room")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        room.setCreatedAt(LocalDateTime.now());
        room.setUpdatedAt(LocalDateTime.now());
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.ok(savedRoom);
    }
    
    @PutMapping("/rooms/{id}")
    @Operation(summary = "Update room")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get();
            room.setName(roomDetails.getName());
            room.setRoomNumber(roomDetails.getRoomNumber());
            room.setDescription(roomDetails.getDescription());
            room.setType(roomDetails.getType());
            room.setPricePerNight(roomDetails.getPricePerNight());
            room.setCapacity(roomDetails.getCapacity());
            room.setBedCount(roomDetails.getBedCount());
            room.setBedType(roomDetails.getBedType());
            room.setSize(roomDetails.getSize());
            room.setAvailable(roomDetails.isAvailable());
            room.setHasBalcony(roomDetails.isHasBalcony());
            room.setHasSeaView(roomDetails.isHasSeaView());
            room.setHasKitchen(roomDetails.isHasKitchen());
            room.setUpdatedAt(LocalDateTime.now());
            
            Room savedRoom = roomRepository.save(room);
            return ResponseEntity.ok(savedRoom);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/rooms/{id}")
    @Operation(summary = "Delete room")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/rooms/{id}/toggle-availability")
    @Operation(summary = "Toggle room availability")
    public ResponseEntity<Room> toggleRoomAvailability(@PathVariable Long id) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get();
            room.setAvailable(!room.isAvailable());
            room.setUpdatedAt(LocalDateTime.now());
            Room savedRoom = roomRepository.save(room);
            return ResponseEntity.ok(savedRoom);
        }
        return ResponseEntity.notFound().build();
    }
    
    // ==================== GESTION DES RÉSERVATIONS ====================
    
    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings with pagination and search")
    public ResponseEntity<Page<Booking>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Booking> bookings;
        if (status != null && !status.trim().isEmpty()) {
            Booking.Status bookingStatus = Booking.Status.valueOf(status.toUpperCase());
            bookings = bookingRepository.findByStatusOrderByCreatedAtDesc(bookingStatus, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            bookings = bookingRepository.findByBookingReferenceContainingIgnoreCaseOrGuestNameContainingIgnoreCaseOrGuestEmailContainingIgnoreCase(
                search, search, search, pageable);
        } else {
            bookings = bookingRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/bookings/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        return booking.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/bookings/{id}")
    @Operation(summary = "Update booking")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking bookingDetails) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(bookingDetails.getStatus());
            booking.setPaymentStatus(bookingDetails.getPaymentStatus());
            booking.setSpecialRequests(bookingDetails.getSpecialRequests());
            booking.setUpdatedAt(LocalDateTime.now());
            
            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(savedBooking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/bookings/{id}/status")
    @Operation(summary = "Update booking status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(Booking.Status.valueOf(status.toUpperCase()));
            booking.setUpdatedAt(LocalDateTime.now());
            
            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(savedBooking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/bookings/{id}")
    @Operation(summary = "Delete booking")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/bookings/pending")
    @Operation(summary = "Get pending bookings")
    public ResponseEntity<Page<Booking>> getPendingBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookingRepository.findByStatusOrderByCreatedAtDesc(
            Booking.Status.PENDING, PageRequest.of(page, size)));
    }
    
    // ==================== STATISTIQUES AVANCÉES ====================
    
    @GetMapping("/stats/revenue-by-month")
    @Operation(summary = "Get revenue statistics by month")
    public ResponseEntity<List<Map<String, Object>>> getRevenueByMonth() {
        // Cette méthode nécessiterait une requête SQL personnalisée
        // Pour l'instant, retourner des données simulées
        return ResponseEntity.ok(List.of());
    }
    
    @GetMapping("/stats/top-hotels")
    @Operation(summary = "Get top performing hotels")
    public ResponseEntity<List<Map<String, Object>>> getTopHotels() {
        // Cette méthode nécessiterait une requête SQL personnalisée
        return ResponseEntity.ok(List.of());
    }
    
    @GetMapping("/stats/user-growth")
    @Operation(summary = "Get user growth statistics")
    public ResponseEntity<List<Map<String, Object>>> getUserGrowth() {
        // Cette méthode nécessiterait une requête SQL personnalisée
        return ResponseEntity.ok(List.of());
    }
}
