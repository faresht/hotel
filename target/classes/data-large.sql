-- Vider les tables existantes
DELETE FROM room_images;
DELETE FROM room_amenities;
DELETE FROM hotel_images;
DELETE FROM hotel_amenities;
DELETE FROM notifications;
DELETE FROM favorites;
DELETE FROM reviews;
DELETE FROM bookings;
DELETE FROM rooms;
DELETE FROM hotels;
DELETE FROM users;

-- Reset auto increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE hotels AUTO_INCREMENT = 1;
ALTER TABLE rooms AUTO_INCREMENT = 1;
ALTER TABLE bookings AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;
ALTER TABLE favorites AUTO_INCREMENT = 1;
ALTER TABLE notifications AUTO_INCREMENT = 1;

-- Insérer des utilisateurs (1000 utilisateurs)
INSERT INTO users (name, email, password, phone, address, role, loyalty_level, points, enabled, created_at, updated_at) VALUES
-- Admins
('Admin Principal', 'admin@tunisiastay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 70 000 001', 'Tunis, Tunisia', 'ADMIN', 'GOLD', 10000, true, NOW(), NOW()),
('Admin Secondaire', 'admin2@tunisiastay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 70 000 002', 'Tunis, Tunisia', 'ADMIN', 'GOLD', 8000, true, NOW(), NOW()),

-- Utilisateurs de test
('Utilisateur Test', 'user@tunisiastay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 20 000 001', 'Sousse, Tunisia', 'USER', 'SILVER', 1500, true, NOW(), NOW()),
('Sophie Martin', 'sophie.martin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 20 123 456', 'Tunis, Tunisia', 'USER', 'GOLD', 2500, true, NOW(), NOW()),

-- Générer 996 utilisateurs supplémentaires
('Ahmed Ben Ali', 'ahmed.benali@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 25 789 123', 'Sousse, Tunisia', 'USER', 'SILVER', 1200, true, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW()),
('Marie Dubois', 'marie.dubois@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 22 456 789', 'Hammamet, Tunisia', 'USER', 'BRONZE', 450, true, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW()),
('Karim Trabelsi', 'karim.trabelsi@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 24 567 890', 'Sfax, Tunisia', 'USER', 'GOLD', 3200, true, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW()),
('Fatma Bouazizi', 'fatma.bouazizi@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 26 678 901', 'Monastir, Tunisia', 'USER', 'SILVER', 1800, true, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW()),
('Mohamed Sassi', 'mohamed.sassi@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 28 789 012', 'Bizerte, Tunisia', 'USER', 'BRONZE', 650, true, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW()),
('Leila Khediri', 'leila.khediri@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 29 890 123', 'Djerba, Tunisia', 'USER', 'GOLD', 2900, true, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW()),
('Youssef Mejri', 'youssef.mejri@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 21 901 234', 'Tozeur, Tunisia', 'USER', 'SILVER', 1100, true, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW());

-- Procédure pour générer plus d'utilisateurs
DELIMITER //
CREATE PROCEDURE GenerateUsers()
BEGIN
    DECLARE i INT DEFAULT 11;
    DECLARE user_name VARCHAR(100);
    DECLARE user_email VARCHAR(100);
    DECLARE user_phone VARCHAR(20);
    DECLARE user_address VARCHAR(200);
    DECLARE loyalty_level ENUM('BRONZE', 'SILVER', 'GOLD');
    DECLARE points INT;
    
    WHILE i <= 1000 DO
        SET user_name = CONCAT('Utilisateur ', i);
        SET user_email = CONCAT('user', i, '@tunisiastay.com');
        SET user_phone = CONCAT('+216 ', LPAD(FLOOR(RAND() * 100000000), 8, '0'));
        SET user_address = ELT(FLOOR(RAND() * 10) + 1, 'Tunis', 'Sousse', 'Sfax', 'Monastir', 'Hammamet', 'Djerba', 'Tozeur', 'Bizerte', 'Kairouan', 'Mahdia');
        SET loyalty_level = ELT(FLOOR(RAND() * 3) + 1, 'BRONZE', 'SILVER', 'GOLD');
        SET points = CASE loyalty_level
            WHEN 'BRONZE' THEN FLOOR(RAND() * 1000)
            WHEN 'SILVER' THEN FLOOR(RAND() * 2000) + 1000
            WHEN 'GOLD' THEN FLOOR(RAND() * 3000) + 2000
        END;
        
        INSERT INTO users (name, email, password, phone, address, role, loyalty_level, points, enabled, created_at, updated_at) 
        VALUES (user_name, user_email, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', user_phone, user_address, 'USER', loyalty_level, points, true, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW());
        
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL GenerateUsers();
DROP PROCEDURE GenerateUsers;

-- Insérer des hôtels (200 hôtels)
INSERT INTO hotels (name, location, address, description, category, rating, review_count, available, featured, phone, email, website, created_at, updated_at) VALUES
('Hôtel Laico Tunis', 'Tunis Centre', 'Avenue Habib Bourguiba, Tunis 1000', 'Hôtel moderne au cœur de Tunis avec vue panoramique sur la ville et la méditerranée', 'FOUR_STARS', 4.5, 324, true, true, '+216 71 123 456', 'contact@laico-tunis.com', 'https://laico-tunis.com', NOW(), NOW()),
('Four Seasons Tunis', 'Gammarth', 'Zone Touristique Gammarth, 2078 La Marsa', 'Luxe et élégance face à la Méditerranée avec service exceptionnel', 'FIVE_STARS', 4.8, 156, true, true, '+216 71 910 910', 'reservations@fourseasons-tunis.com', 'https://fourseasons.com/tunis', NOW(), NOW()),
('Villa Didon', 'Sidi Bou Said', 'Rue Sidi Dhrif, Sidi Bou Said 2026', 'Villa de charme avec vue mer exceptionnelle dans le village pittoresque', 'LUXURY', 4.9, 89, true, true, '+216 71 740 411', 'info@villa-didon.com', 'https://villa-didon.com', NOW(), NOW()),
('Hôtel Bellevue', 'Sousse', 'Boulevard de la Corniche, Sousse 4000', 'Confort et convivialité au centre de Sousse près de la médina', 'THREE_STARS', 4.2, 267, true, false, '+216 73 225 122', 'contact@bellevue-sousse.tn', 'https://bellevue-sousse.tn', NOW(), NOW()),
('Resort Djerba', 'Djerba', 'Zone Touristique Midoun, Djerba 4116', 'Resort tout inclus sur la plage de Djerba avec animations', 'FOUR_STARS', 4.6, 445, true, true, '+216 75 757 000', 'booking@resort-djerba.com', 'https://resort-djerba.com', NOW(), NOW()),
('Riad Hammamet', 'Hammamet', 'Medina Hammamet, 8050 Hammamet', 'Riad authentique dans la médina de Hammamet avec architecture traditionnelle', 'BOUTIQUE', 4.3, 198, true, false, '+216 72 280 101', 'contact@riad-hammamet.tn', 'https://riad-hammamet.tn', NOW(), NOW());

-- Procédure pour générer plus d'hôtels
DELIMITER //
CREATE PROCEDURE GenerateHotels()
BEGIN
    DECLARE i INT DEFAULT 7;
    DECLARE hotel_name VARCHAR(100);
    DECLARE hotel_location VARCHAR(100);
    DECLARE hotel_address VARCHAR(200);
    DECLARE hotel_description TEXT;
    DECLARE hotel_category ENUM('ONE_STAR', 'TWO_STARS', 'THREE_STARS', 'FOUR_STARS', 'FIVE_STARS', 'LUXURY', 'BOUTIQUE');
    DECLARE hotel_rating DECIMAL(2,1);
    DECLARE review_count INT;
    DECLARE is_featured BOOLEAN;
    DECLARE hotel_phone VARCHAR(20);
    DECLARE hotel_email VARCHAR(100);
    
    WHILE i <= 200 DO
        SET hotel_name = CONCAT('Hôtel ', ELT(FLOOR(RAND() * 20) + 1, 'Royal', 'Palace', 'Grand', 'Luxury', 'Premium', 'Elite', 'Golden', 'Diamond', 'Pearl', 'Sapphire', 'Emerald', 'Crystal', 'Majestic', 'Imperial', 'Regal', 'Noble', 'Supreme', 'Prestige', 'Excellence', 'Splendor'), ' ', ELT(FLOOR(RAND() * 15) + 1, 'Tunis', 'Sousse', 'Sfax', 'Monastir', 'Hammamet', 'Djerba', 'Tozeur', 'Bizerte', 'Kairouan', 'Mahdia', 'Nabeul', 'Gabès', 'Gafsa', 'Kasserine', 'Siliana'));
        SET hotel_location = ELT(FLOOR(RAND() * 15) + 1, 'Tunis Centre', 'Gammarth', 'Sidi Bou Said', 'Sousse', 'Djerba', 'Hammamet', 'Tozeur', 'Bizerte', 'Kairouan', 'Mahdia', 'Nabeul', 'Sfax', 'Monastir', 'Gabès', 'Douz');
        SET hotel_address = CONCAT('Avenue ', ELT(FLOOR(RAND() * 10) + 1, 'Habib Bourguiba', 'de la République', 'Mohamed V', 'de la Liberté', 'des Martyrs', 'de l''Indépendance', 'du 20 Mars', 'de la Paix', 'de l''Unité', 'de la Victoire'), ', ', hotel_location);
        SET hotel_description = CONCAT('Magnifique hôtel situé à ', hotel_location, ' offrant un service de qualité et des équipements modernes pour un séjour inoubliable.');
        SET hotel_category = ELT(FLOOR(RAND() * 7) + 1, 'ONE_STAR', 'TWO_STARS', 'THREE_STARS', 'FOUR_STARS', 'FIVE_STARS', 'LUXURY', 'BOUTIQUE');
        SET hotel_rating = ROUND(3.0 + (RAND() * 2.0), 1);
        SET review_count = FLOOR(RAND() * 500) + 10;
        SET is_featured = RAND() > 0.7;
        SET hotel_phone = CONCAT('+216 ', LPAD(FLOOR(RAND() * 100000000), 8, '0'));
        SET hotel_email = CONCAT('contact@hotel', i, '.tn');
        
        INSERT INTO hotels (name, location, address, description, category, rating, review_count, available, featured, phone, email, website, created_at, updated_at) 
        VALUES (hotel_name, hotel_location, hotel_address, hotel_description, hotel_category, hotel_rating, review_count, true, is_featured, hotel_phone, hotel_email, CONCAT('https://hotel', i, '.tn'), DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 730) DAY), NOW());
        
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL GenerateHotels();
DROP PROCEDURE GenerateHotels;

-- Insérer des équipements pour tous les hôtels
INSERT INTO hotel_amenities (hotel_id, amenity)
SELECT h.id, 'wifi' FROM hotels h;

INSERT INTO hotel_amenities (hotel_id, amenity)
SELECT h.id, 'parking' FROM hotels h WHERE RAND() > 0.3;

INSERT INTO hotel_amenities (hotel_id, amenity)
SELECT h.id, 'restaurant' FROM hotels h WHERE RAND() > 0.2;

INSERT INTO hotel_amenities (hotel_id, amenity)
SELECT h.id, 'pool' FROM hotels h WHERE RAND() > 0.4;

INSERT INTO hotel_amenities (hotel_id, amenity)
SELECT h.id, 'spa' FROM hotels h WHERE RAND() > 0.6;

INSERT INTO hotel_amenities (hotel_id, amenity)
SELECT h.id, 'beach' FROM hotels h WHERE h.location IN ('Djerba', 'Hammamet', 'Sousse', 'Monastir', 'Mahdia') AND RAND() > 0.3;

-- Insérer des images pour tous les hôtels
INSERT INTO hotel_images (hotel_id, image_url)
SELECT id, CONCAT('/placeholder.svg?height=400&width=600&text=Hotel+', id, '+Exterior') FROM hotels;

INSERT INTO hotel_images (hotel_id, image_url)
SELECT id, CONCAT('/placeholder.svg?height=400&width=600&text=Hotel+', id, '+Lobby') FROM hotels WHERE RAND() > 0.5;

-- Procédure pour générer des chambres (5000 chambres)
DELIMITER //
CREATE PROCEDURE GenerateRooms()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE hotel_id INT;
    DECLARE room_name VARCHAR(100);
    DECLARE room_number VARCHAR(10);
    DECLARE room_description TEXT;
    DECLARE room_type ENUM('STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL_SUITE');
    DECLARE price DECIMAL(10,2);
    DECLARE capacity INT;
    DECLARE bed_count INT;
    DECLARE bed_type ENUM('SINGLE', 'DOUBLE', 'QUEEN', 'KING', 'TWIN_BEDS');
    DECLARE room_size DECIMAL(5,2);
    DECLARE has_balcony BOOLEAN;
    DECLARE has_sea_view BOOLEAN;
    DECLARE has_kitchen BOOLEAN;
    DECLARE rooms_per_hotel INT;
    DECLARE room_counter INT;
    
    -- Pour chaque hôtel, créer entre 15 et 40 chambres
    hotel_loop: LOOP
        SELECT id INTO hotel_id FROM hotels WHERE id = i;
        IF hotel_id IS NULL THEN
            LEAVE hotel_loop;
        END IF;
        
        SET rooms_per_hotel = FLOOR(RAND() * 26) + 15; -- Entre 15 et 40 chambres
        SET room_counter = 1;
        
        room_loop: WHILE room_counter <= rooms_per_hotel DO
            SET room_number = CONCAT(i, LPAD(room_counter, 2, '0'));
            SET room_type = ELT(FLOOR(RAND() * 4) + 1, 'STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL_SUITE');
            SET room_name = CONCAT('Chambre ', 
                CASE room_type
                    WHEN 'STANDARD' THEN 'Standard'
                    WHEN 'DELUXE' THEN 'Deluxe'
                    WHEN 'SUITE' THEN 'Suite'
                    WHEN 'PRESIDENTIAL_SUITE' THEN 'Suite Présidentielle'
                END);
            SET room_description = CONCAT('Belle chambre ', LOWER(room_name), ' avec tout le confort moderne.');
            SET price = CASE room_type
                WHEN 'STANDARD' THEN ROUND(50 + (RAND() * 100), 2)
                WHEN 'DELUXE' THEN ROUND(120 + (RAND() * 150), 2)
                WHEN 'SUITE' THEN ROUND(250 + (RAND() * 200), 2)
                WHEN 'PRESIDENTIAL_SUITE' THEN ROUND(400 + (RAND() * 300), 2)
            END;
            SET capacity = CASE room_type
                WHEN 'STANDARD' THEN FLOOR(RAND() * 2) + 2
                WHEN 'DELUXE' THEN FLOOR(RAND() * 2) + 2
                WHEN 'SUITE' THEN FLOOR(RAND() * 3) + 3
                WHEN 'PRESIDENTIAL_SUITE' THEN FLOOR(RAND() * 4) + 4
            END;
            SET bed_count = CASE 
                WHEN capacity <= 2 THEN 1
                WHEN capacity <= 4 THEN FLOOR(RAND() * 2) + 1
                ELSE 2
            END;
            SET bed_type = ELT(FLOOR(RAND() * 5) + 1, 'SINGLE', 'DOUBLE', 'QUEEN', 'KING', 'TWIN_BEDS');
            SET room_size = CASE room_type
                WHEN 'STANDARD' THEN ROUND(15 + (RAND() * 15), 1)
                WHEN 'DELUXE' THEN ROUND(25 + (RAND() * 20), 1)
                WHEN 'SUITE' THEN ROUND(40 + (RAND() * 30), 1)
                WHEN 'PRESIDENTIAL_SUITE' THEN ROUND(60 + (RAND() * 40), 1)
            END;
            SET has_balcony = RAND() > 0.4;
            SET has_sea_view = RAND() > 0.6;
            SET has_kitchen = room_type IN ('SUITE', 'PRESIDENTIAL_SUITE') AND RAND() > 0.5;
            
            INSERT INTO rooms (name, room_number, description, type, price_per_night, capacity, bed_count, bed_type, size, available, has_balcony, has_sea_view, has_kitchen, has_bathroom, hotel_id, created_at, updated_at)
            VALUES (room_name, room_number, room_description, room_type, price, capacity, bed_count, bed_type, room_size, RAND() > 0.1, has_balcony, has_sea_view, has_kitchen, true, hotel_id, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY), NOW());
            
            SET room_counter = room_counter + 1;
        END WHILE room_loop;
        
        SET i = i + 1;
        IF i > 200 THEN
            LEAVE hotel_loop;
        END IF;
    END LOOP hotel_loop;
END //
DELIMITER ;

CALL GenerateRooms();
DROP PROCEDURE GenerateRooms;

-- Insérer des équipements pour toutes les chambres
INSERT INTO room_amenities (room_id, amenity)
SELECT id, 'wifi' FROM rooms;

INSERT INTO room_amenities (room_id, amenity)
SELECT id, 'air-conditioning' FROM rooms WHERE RAND() > 0.1;

INSERT INTO room_amenities (room_id, amenity)
SELECT id, 'tv' FROM rooms WHERE RAND() > 0.2;

INSERT INTO room_amenities (room_id, amenity)
SELECT id, 'minibar' FROM rooms WHERE type IN ('DELUXE', 'SUITE', 'PRESIDENTIAL_SUITE') AND RAND() > 0.3;

INSERT INTO room_amenities (room_id, amenity)
SELECT id, 'safe' FROM rooms WHERE type IN ('SUITE', 'PRESIDENTIAL_SUITE') AND RAND() > 0.4;

-- Insérer des images pour toutes les chambres
INSERT INTO room_images (room_id, image_url)
SELECT id, CONCAT('/placeholder.svg?height=300&width=400&text=Room+', id) FROM rooms;

-- Procédure pour générer des réservations (10000 réservations)
DELIMITER //
CREATE PROCEDURE GenerateBookings()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE user_id INT;
    DECLARE hotel_id INT;
    DECLARE room_id INT;
    DECLARE booking_ref VARCHAR(20);
    DECLARE check_in DATE;
    DECLARE check_out DATE;
    DECLARE nights INT;
    DECLARE guests INT;
    DECLARE room_price DECIMAL(10,2);
    DECLARE total_amount DECIMAL(10,2);
    DECLARE original_price DECIMAL(10,2);
    DECLARE discount_amount DECIMAL(10,2);
    DECLARE booking_status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
    DECLARE payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED');
    DECLARE guest_name VARCHAR(100);
    DECLARE guest_email VARCHAR(100);
    DECLARE guest_phone VARCHAR(20);
    
    WHILE i <= 10000 DO
        -- Sélectionner un utilisateur aléatoire
        SELECT id, name, email, phone INTO user_id, guest_name, guest_email, guest_phone 
        FROM users WHERE role = 'USER' ORDER BY RAND() LIMIT 1;
        
        -- Sélectionner une chambre disponible aléatoire
        SELECT r.id, r.hotel_id, r.price_per_night, r.capacity 
        INTO room_id, hotel_id, room_price, guests
        FROM rooms r WHERE r.available = true ORDER BY RAND() LIMIT 1;
        
        -- Générer des dates aléatoires
        SET check_in = DATE_ADD(CURDATE(), INTERVAL FLOOR(RAND() * 365) - 180 DAY);
        SET nights = FLOOR(RAND() * 10) + 1;
        SET check_out = DATE_ADD(check_in, INTERVAL nights DAY);
        
        -- Calculer les prix
        SET original_price = room_price * nights;
        SET discount_amount = original_price * (RAND() * 0.2); -- Jusqu'à 20% de réduction
        SET total_amount = original_price - discount_amount;
        
        -- Statuts aléatoires
        SET booking_status = ELT(FLOOR(RAND() * 4) + 1, 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
        SET payment_status = CASE booking_status
            WHEN 'CONFIRMED' THEN 'PAID'
            WHEN 'COMPLETED' THEN 'PAID'
            WHEN 'CANCELLED' THEN ELT(FLOOR(RAND() * 2) + 1, 'REFUNDED', 'FAILED')
            ELSE 'PENDING'
        END;
        
        SET booking_ref = CONCAT('TS-', UPPER(SUBSTRING(MD5(RAND()), 1, 8)));
        
        INSERT INTO bookings (booking_reference, check_in_date, check_out_date, nights, guests, total_amount, original_price, discount_amount, status, payment_status, special_requests, guest_name, guest_email, guest_phone, user_id, hotel_id, room_id, created_at, updated_at)
        VALUES (booking_ref, check_in, check_out, nights, guests, total_amount, original_price, discount_amount, booking_status, payment_status, 
                CASE WHEN RAND() > 0.7 THEN ELT(FLOOR(RAND() * 5) + 1, 'Vue sur mer', 'Étage élevé', 'Lit king size', 'Arrivée tardive', 'Chambre calme') ELSE NULL END,
                guest_name, guest_email, guest_phone, user_id, hotel_id, room_id, 
                DATE_SUB(check_in, INTERVAL FLOOR(RAND() * 30) DAY), NOW());
        
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL GenerateBookings();
DROP PROCEDURE GenerateBookings;

-- Procédure pour générer des avis (5000 avis)
DELIMITER //
CREATE PROCEDURE GenerateReviews()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE booking_id INT;
    DECLARE user_id INT;
    DECLARE hotel_id INT;
    DECLARE rating INT;
    DECLARE review_title VARCHAR(200);
    DECLARE review_comment TEXT;
    DECLARE cleanliness_rating INT;
    DECLARE service_rating INT;
    DECLARE location_rating INT;
    DECLARE value_rating INT;
    
    WHILE i <= 5000 DO
        -- Sélectionner une réservation confirmée ou terminée
        SELECT b.id, b.user_id, b.hotel_id 
        INTO booking_id, user_id, hotel_id
        FROM bookings b 
        WHERE b.status IN ('CONFIRMED', 'COMPLETED') 
        AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.booking_id = b.id)
        ORDER BY RAND() LIMIT 1;
        
        IF booking_id IS NOT NULL THEN
            SET rating = FLOOR(RAND() * 5) + 1;
            SET cleanliness_rating = FLOOR(RAND() * 5) + 1;
            SET service_rating = FLOOR(RAND() * 5) + 1;
            SET location_rating = FLOOR(RAND() * 5) + 1;
            SET value_rating = FLOOR(RAND() * 5) + 1;
            
            SET review_title = CASE 
                WHEN rating >= 4 THEN ELT(FLOOR(RAND() * 5) + 1, 'Excellent séjour', 'Très satisfait', 'Je recommande', 'Parfait', 'Magnifique expérience')
                WHEN rating = 3 THEN ELT(FLOOR(RAND() * 3) + 1, 'Correct', 'Séjour moyen', 'Peut mieux faire')
                ELSE ELT(FLOOR(RAND() * 3) + 1, 'Décevant', 'Pas terrible', 'À éviter')
            END;
            
            SET review_comment = CASE 
                WHEN rating >= 4 THEN 'Très bon hôtel avec un excellent service. Je recommande vivement cet établissement pour un séjour réussi.'
                WHEN rating = 3 THEN 'Hôtel correct dans l''ensemble. Quelques points à améliorer mais globalement satisfaisant.'
                ELSE 'Séjour décevant. L''hôtel ne correspond pas aux attentes et le service laisse à désirer.'
            END;
            
            INSERT INTO reviews (rating, title, comment, cleanliness_rating, service_rating, location_rating, value_rating, verified, user_id, hotel_id, booking_id, created_at, updated_at)
            VALUES (rating, review_title, review_comment, cleanliness_rating, service_rating, location_rating, value_rating, true, user_id, hotel_id, booking_id, 
                    DATE_ADD((SELECT created_at FROM bookings WHERE id = booking_id), INTERVAL FLOOR(RAND() * 30) DAY), NOW());
        END IF;
        
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL GenerateReviews();
DROP PROCEDURE GenerateReviews;

-- Générer des favoris (2000 favoris)
INSERT INTO favorites (user_id, hotel_id, created_at)
SELECT 
    u.id,
    h.id,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY)
FROM users u
CROSS JOIN hotels h
WHERE u.role = 'USER'
AND RAND() > 0.95
LIMIT 2000;

-- Générer des notifications (3000 notifications)
DELIMITER //
CREATE PROCEDURE GenerateNotifications()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE user_id INT;
    DECLARE notif_title VARCHAR(200);
    DECLARE notif_message TEXT;
    DECLARE notif_type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR');
    DECLARE is_read BOOLEAN;
    
    WHILE i <= 3000 DO
        SELECT id INTO user_id FROM users WHERE role = 'USER' ORDER BY RAND() LIMIT 1;
        
        SET notif_type = ELT(FLOOR(RAND() * 4) + 1, 'INFO', 'SUCCESS', 'WARNING', 'ERROR');
        SET is_read = RAND() > 0.3;
        
        SET notif_title = CASE notif_type
            WHEN 'INFO' THEN ELT(FLOOR(RAND() * 3) + 1, 'Nouvelle offre disponible', 'Mise à jour de votre profil', 'Newsletter TunisiaStay')
            WHEN 'SUCCESS' THEN ELT(FLOOR(RAND() * 3) + 1, 'Réservation confirmée', 'Paiement réussi', 'Points de fidélité ajoutés')
            WHEN 'WARNING' THEN ELT(FLOOR(RAND() * 3) + 1, 'Réservation en attente', 'Vérification requise', 'Offre limitée')
            WHEN 'ERROR' THEN ELT(FLOOR(RAND() * 3) + 1, 'Problème de paiement', 'Réservation annulée', 'Erreur système')
        END;
        
        SET notif_message = CONCAT('Message de notification automatique pour ', notif_title, '. Consultez votre compte pour plus de détails.');
        
        INSERT INTO notifications (title, message, type, is_read, user_id, created_at)
        VALUES (notif_title, notif_message, notif_type, is_read, user_id, DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 90) DAY));
        
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL GenerateNotifications();
DROP PROCEDURE GenerateNotifications;

-- Mettre à jour les statistiques des hôtels
UPDATE hotels h SET 
    review_count = (SELECT COUNT(*) FROM reviews r WHERE r.hotel_id = h.id),
    rating = (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.hotel_id = h.id)
WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.hotel_id = h.id);

-- Afficher les statistiques finales
SELECT 'Statistiques de la base de données' as Info;
SELECT COUNT(*) as 'Nombre d\'utilisateurs' FROM users;
SELECT COUNT(*) as 'Nombre d\'hôtels' FROM hotels;
SELECT COUNT(*) as 'Nombre de chambres' FROM rooms;
SELECT COUNT(*) as 'Nombre de réservations' FROM bookings;
SELECT COUNT(*) as 'Nombre d\'avis' FROM reviews;
SELECT COUNT(*) as 'Nombre de favoris' FROM favorites;
SELECT COUNT(*) as 'Nombre de notifications' FROM notifications;
