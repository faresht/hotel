-- Vider les tables existantes
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

-- Note: Les procédures stockées ont été remplacées par des insertions directes pour éviter les problèmes de syntaxe DELIMITER

-- Insérer des hôtels (200 hôtels)
INSERT INTO hotels (name, location, address, description, category, rating, review_count, available, featured, phone, email, website, created_at, updated_at) VALUES
('Hôtel Laico Tunis', 'Tunis Centre', 'Avenue Habib Bourguiba, Tunis 1000', 'Hôtel moderne au cœur de Tunis avec vue panoramique sur la ville et la méditerranée', 'FOUR_STARS', 4.5, 324, true, true, '+216 71 123 456', 'contact@laico-tunis.com', 'https://laico-tunis.com', NOW(), NOW()),
('Four Seasons Tunis', 'Gammarth', 'Zone Touristique Gammarth, 2078 La Marsa', 'Luxe et élégance face à la Méditerranée avec service exceptionnel', 'FIVE_STARS', 4.8, 156, true, true, '+216 71 910 910', 'reservations@fourseasons-tunis.com', 'https://fourseasons.com/tunis', NOW(), NOW()),
('Villa Didon', 'Sidi Bou Said', 'Rue Sidi Dhrif, Sidi Bou Said 2026', 'Villa de charme avec vue mer exceptionnelle dans le village pittoresque', 'LUXURY', 4.9, 89, true, true, '+216 71 740 411', 'info@villa-didon.com', 'https://villa-didon.com', NOW(), NOW()),
('Hôtel Bellevue', 'Sousse', 'Boulevard de la Corniche, Sousse 4000', 'Confort et convivialité au centre de Sousse près de la médina', 'THREE_STARS', 4.2, 267, true, false, '+216 73 225 122', 'contact@bellevue-sousse.tn', 'https://bellevue-sousse.tn', NOW(), NOW()),
('Resort Djerba', 'Djerba', 'Zone Touristique Midoun, Djerba 4116', 'Resort tout inclus sur la plage de Djerba avec animations', 'FOUR_STARS', 4.6, 445, true, true, '+216 75 757 000', 'booking@resort-djerba.com', 'https://resort-djerba.com', NOW(), NOW()),
('Riad Hammamet', 'Hammamet', 'Medina Hammamet, 8050 Hammamet', 'Riad authentique dans la médina de Hammamet avec architecture traditionnelle', 'BOUTIQUE', 4.3, 198, true, false, '+216 72 280 101', 'contact@riad-hammamet.tn', 'https://riad-hammamet.tn', NOW(), NOW());

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

-- Insérer quelques chambres pour chaque hôtel
INSERT INTO rooms (name, room_number, description, type, price_per_night, capacity, bed_count, bed_type, size, available, has_balcony, has_sea_view, has_kitchen, hotel_id, created_at, updated_at) VALUES
-- Laico Tunis rooms
('Chambre Standard', '101', 'Chambre confortable avec vue sur la ville', 'SINGLE', 120.00, 2, 1, 'DOUBLE', 25.0, true, false, false, false, 1, NOW(), NOW()),
('Suite Deluxe', '201', 'Suite spacieuse avec balcon et vue panoramique', 'DELUXE', 180.00, 3, 1, 'KING', 40.0, true, true, false, false, 1, NOW(), NOW()),
-- Four Seasons rooms
('Chambre Vue Mer', '301', 'Chambre luxueuse avec vue directe sur la mer', 'DELUXE', 280.00, 2, 1, 'KING', 35.0, true, true, true, false, 2, NOW(), NOW()),
('Suite Présidentielle', '401', 'Suite présidentielle avec terrasse privée', 'SUITE', 500.00, 4, 2, 'KING', 80.0, true, true, true, true, 2, NOW(), NOW()),
-- Villa Didon rooms
('Chambre Charme', '501', 'Chambre de charme avec décoration authentique', 'DELUXE', 350.00, 2, 1, 'QUEEN', 30.0, true, true, true, false, 3, NOW(), NOW()),
-- Bellevue rooms
('Chambre Économique', '601', 'Chambre simple et confortable', 'SINGLE', 85.00, 2, 1, 'DOUBLE', 20.0, true, false, false, false, 4, NOW(), NOW()),
-- Resort Djerba rooms
('Chambre Resort', '701', 'Chambre tout inclus avec accès plage', 'DOUBLE', 180.00, 3, 2, 'TWIN_BEDS', 30.0, true, true, false, false, 5, NOW(), NOW()),
-- Riad Hammamet rooms
('Chambre Traditionnelle', '801', 'Chambre avec architecture traditionnelle tunisienne', 'FAMILY', 95.00, 2, 1, 'DOUBLE', 22.0, true, false, false, false, 6, NOW(), NOW());

-- Room amenities and images are not supported in the current entity model
-- If you need to add these features, update the Room entity class with @ElementCollection annotations
-- similar to how it's done in the Hotel entity class

-- Insérer quelques réservations
INSERT INTO bookings (booking_reference, check_in_date, check_out_date, nights, guests, total_amount, original_price, discount_amount, status, payment_status, special_requests, guest_name, guest_email, guest_phone, user_id, hotel_id, room_id, created_at, updated_at) VALUES
('TS-ABC12345', '2024-02-15', '2024-02-20', 5, 2, 1330.00, 1400.00, 70.00, 'CONFIRMED', 'PAID', 'Vue sur mer si possible', 'Sophie Martin', 'sophie.martin@example.com', '+216 20 123 456', 1, 2, 3, NOW(), NOW()),
('TS-DEF67890', '2024-03-10', '2024-03-13', 3, 2, 945.00, 1050.00, 105.00, 'CONFIRMED', 'PAID', 'Arrivée tardive', 'Ahmed Ben Ali', 'ahmed.benali@email.com', '+216 25 789 123', 3, 3, 5, NOW(), NOW()),
('TS-GHI11111', '2024-02-25', '2024-02-27', 2, 1, 228.00, 240.00, 12.00, 'PENDING', 'PENDING', '', 'Marie Dubois', 'marie.dubois@email.com', '+216 22 456 789', 4, 1, 1, NOW(), NOW());

-- Insérer quelques avis
INSERT INTO reviews (rating, title, comment, cleanliness_rating, service_rating, location_rating, value_rating, verified, user_id, hotel_id, booking_id, created_at, updated_at) VALUES
(5, 'Séjour exceptionnel', 'Hôtel magnifique avec un service impeccable. La vue sur mer était à couper le souffle !', 5, 5, 5, 4, true, 1, 2, 1, NOW(), NOW()),
(4, 'Très bon hôtel', 'Cadre authentique et charmant. Quelques petits détails à améliorer mais globalement très satisfait.', 4, 4, 5, 4, true, 3, 3, 2, NOW(), NOW());

-- Insérer quelques favoris
INSERT INTO favorites (user_id, hotel_id, created_at) VALUES
(1, 2, NOW()),
(1, 3, NOW()),
(3, 1, NOW()),
(4, 5, NOW());

-- Insérer quelques notifications
INSERT INTO notifications (title, message, type, is_read, user_id, created_at) VALUES
('Bienvenue sur TunisiaStay !', 'Découvrez nos offres exclusives et gagnez des points de fidélité.', 'INFO', false, 1, NOW()),
('Réservation confirmée', 'Votre réservation TS-ABC12345 au Four Seasons Tunis a été confirmée.', 'SUCCESS', false, 1, NOW()),
('Nouveau niveau de fidélité', 'Félicitations ! Vous êtes maintenant membre Gold.', 'SUCCESS', true, 1, NOW()),
('Bienvenue sur TunisiaStay !', 'Découvrez nos offres exclusives et gagnez des points de fidélité.', 'INFO', false, 3, NOW()),
('Réservation confirmée', 'Votre réservation TS-DEF67890 à Villa Didon a été confirmée.', 'SUCCESS', false, 3, NOW());

-- Mettre à jour les statistiques des hôtels
UPDATE hotels h SET 
    review_count = (SELECT COUNT(*) FROM reviews r WHERE r.hotel_id = h.id),
    rating = (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.hotel_id = h.id)
WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.hotel_id = h.id);

-- Afficher les statistiques finales
SELECT 'Statistiques de la base de données' as Info;
SELECT COUNT(*) as 'Nombre d''utilisateurs' FROM users;
SELECT COUNT(*) as 'Nombre d''hôtels' FROM hotels;
SELECT COUNT(*) as 'Nombre de chambres' FROM rooms;
SELECT COUNT(*) as 'Nombre de réservations' FROM bookings;
SELECT COUNT(*) as 'Nombre d''avis' FROM reviews;
SELECT COUNT(*) as 'Nombre de favoris' FROM favorites;
SELECT COUNT(*) as 'Nombre de notifications' FROM notifications;