package com.tunisiastay.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Getter
@Setter
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type;

    private String name;

    @Column(name = "room_number", unique = true)
    private String roomNumber;

    private String description;


    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private BigDecimal pricePerNight;

    private int capacity;

    private int bedCount;

    private String bedType;

    private double size;

    private boolean available;

    private boolean hasBalcony;

    private boolean hasSeaView;

    private boolean hasKitchen;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;


    public Room() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

}
