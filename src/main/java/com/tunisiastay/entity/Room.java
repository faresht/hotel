package com.tunisiastay.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String roomNumber;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false)
    private Integer bedCount;
    
    @Enumerated(EnumType.STRING)
    private BedType bedType;
    
    @Column(nullable = false)
    private Double size; // en m²
    
    @ElementCollection
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "amenity")
    private List<String> amenities;
    
    @ElementCollection
    @CollectionTable(name = "room_images", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "image_url")
    private List<String> images;
    
    @Column(nullable = false)
    private Boolean available = true;
    
    private Boolean hasBalcony = false;
    private Boolean hasSeaView = false;
    private Boolean hasKitchen = false;
    private Boolean hasBathroom = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;
    
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> bookings;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum RoomType {
        STANDARD, DELUXE, SUITE, PRESIDENTIAL_SUITE, FAMILY_ROOM, SINGLE, DOUBLE, TWIN
    }
    
    public enum BedType {
        SINGLE, DOUBLE, QUEEN, KING, TWIN_BEDS, SOFA_BED
    }
}
