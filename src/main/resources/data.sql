-- Insert test users
INSERT INTO users (name, email, password, phone, address, role, loyalty_level, points, enabled, created_at, updated_at) VALUES
('Sophie Martin', 'sophie.martin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 20 123 456', 'Tunis, Tunisia', 'USER', 'GOLD', 2500, true, NOW(), NOW()),
('Admin TunisiaStay', 'admin@tunisiastay.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 70 123 456', 'Tunis, Tunisia', 'ADMIN', 'GOLD', 5000, true, NOW(), NOW()),
('Ahmed Ben Ali', 'ahmed.benali@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 25 789 123', 'Sousse, Tunisia', 'USER', 'SILVER', 1200, true, NOW(), NOW()),
('Marie Dubois', 'marie.dubois@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+216 22 456 789', 'Hammamet, Tunisia', 'USER', 'BRONZE', 450, true, NOW(), NOW());

-- Insert test hotels
INSERT INTO hotels (name, location, address, description, category, rating, review_count, available, featured, phone, email, website, created_at, updated_at) VALUES
('Hôtel Laico Tunis', 'Tunis Centre', 'Avenue Habib Bourguiba, Tunis 1000', 'Hôtel moderne au cœur de Tunis avec vue panoramique sur la ville et la méditerranée', 'FOUR_STARS', 4.5, 324, true, true, '+216 71 123 456', 'contact@laico-tunis.com', 'https://laico-tunis.com', NOW(), NOW()),
('Four Seasons Tunis', 'Gammarth', 'Zone Touristique Gammarth, 2078 La Marsa', 'Luxe et élégance face à la Méditerranée avec service exceptionnel', 'FIVE_STARS', 4.8, 156, true, true, '+216 71 910 910', 'reservations@fourseasons-tunis.com', 'https://fourseasons.com/tunis', NOW(), NOW()),
('Villa Didon', 'Sidi Bou Said', 'Rue Sidi Dhrif, Sidi Bou Said 2026', 'Villa de charme avec vue mer exceptionnelle dans le village pittoresque', 'LUXURY', 4.9, 89, true, true, '+216 71 740 411', 'info@villa-didon.com', 'https://villa-didon.com', NOW(), NOW()),
('Hôtel Bellevue', 'Sousse', 'Boulevard de la Corniche, Sousse 4000', 'Confort et convivialité au centre de Sousse près de la médina', 'THREE_STARS', 4.2, 267, true, false, '+216 73 225 122', 'contact@bellevue-sousse.tn', 'https://bellevue-sousse.tn', NOW(), NOW()),
('Resort Djerba', 'Djerba', 'Zone Touristique Midoun, Djerba 4116', 'Resort tout inclus sur la plage de Djerba avec animations', 'FOUR_STARS', 4.6, 445, true, true, '+216 75 757 000', 'booking@resort-djerba.com', 'https://resort-djerba.com', NOW(), NOW()),
('Riad Hammamet', 'Hammamet', 'Medina Hammamet, 8050 Hammamet', 'Riad authentique dans la médina de Hammamet avec architecture traditionnelle', 'BOUTIQUE', 4.3, 198, true, false, '+216 72 280 101', 'contact@riad-hammamet.tn', 'https://riad-hammamet.tn', NOW(), NOW());

-- Insert hotel amenities
INSERT INTO hotel_amenities (hotel_id, amenity) VALUES
(1, 'wifi'), (1, 'parking'), (1, 'restaurant'), (1, 'pool'),
(2, 'wifi'), (2, 'beach'), (2, 'spa'), (2, 'golf'), (2, 'pool'),
(3, 'wifi'), (3, 'sea-view'), (3, 'spa'), (3, 'restaurant'),
(4, 'wifi'), (4, 'pool'), (4, 'restaurant'), (4, 'parking'),
(5, 'wifi'), (5, 'beach'), (5, 'pool'), (5, 'spa'), (5, 'restaurant'),
(6, 'wifi'), (6, 'pool'), (6, 'spa'), (6, 'restaurant');

-- Insert hotel images
INSERT INTO hotel_images (hotel_id, image_url) VALUES
(1, '/placeholder.svg?height=400&width=600&text=Laico+Tunis+Exterior'),
(1, '/placeholder.svg?height=400&width=600&text=Laico+Tunis+Lobby'),
(2, '/placeholder.svg?height=400&width=600&text=Four+Seasons+Beach'),
(2, '/placeholder.svg?height=400&width=600&text=Four+Seasons+Pool'),
(3, '/placeholder.svg?height=400&width=600&text=Villa+Didon+View'),
(3, '/placeholder.svg?height=400&width=600&text=Villa+Didon+Terrace'),
(4, '/placeholder.svg?height=400&width=600&text=Bellevue+Exterior'),
(5, '/placeholder.svg?height=400&width=600&text=Resort+Djerba+Beach'),
(6, '/placeholder.svg?height=400&width=600&text=Riad+Hammamet+Courtyard');

-- Insert rooms
INSERT INTO rooms (name, room_number, description, type, price_per_night, capacity, bed_count, bed_type, size, available, has_balcony, has_sea_view, has_kitchen, has_bathroom, hotel_id, created_at, updated_at) VALUES
-- Laico Tunis rooms
('Chambre Standard', '101', 'Chambre confortable avec vue sur la ville', 'STANDARD', 120.00, 2, 1, 'DOUBLE', 25.0, true, false, false, false, true, 1, NOW(), NOW()),
('Suite Deluxe', '201', 'Suite spacieuse avec balcon et vue panoramique', 'DELUXE', 180.00, 3, 1, 'KING', 40.0, true, true, false, false, true, 1, NOW(), NOW()),
-- Four Seasons rooms
('Chambre Vue Mer', '301', 'Chambre luxueuse avec vue directe sur la mer', 'DELUXE', 280.00, 2, 1, 'KING', 35.0, true, true, true, false, true, 2, NOW(), NOW()),
('Suite Présidentielle', '401', 'Suite présidentielle avec terrasse privée', 'PRESIDENTIAL_SUITE', 500.00, 4, 2, 'KING', 80.0, true, true, true, true, true, 2, NOW(), NOW()),
-- Villa Didon rooms
('Chambre Charme', '501', 'Chambre de charme avec décoration authentique', 'DELUXE', 350.00, 2, 1, 'QUEEN', 30.0, true, true, true, false, true, 3, NOW(), NOW()),
-- Bellevue rooms
('Chambre Économique', '601', 'Chambre simple et confortable', 'STANDARD', 85.00, 2, 1, 'DOUBLE', 20.0, true, false, false, false, true, 4, NOW(), NOW()),
-- Resort Djerba rooms
('Chambre Resort', '701', 'Chambre tout inclus avec accès plage', 'STANDARD', 180.00, 3, 2, 'TWIN_BEDS', 30.0, true, true, false, false, true, 5, NOW(), NOW()),
-- Riad Hammamet rooms
('Chambre Traditionnelle', '801', 'Chambre avec architecture traditionnelle tunisienne', 'STANDARD', 95.00, 2, 1, 'DOUBLE', 22.0, true, false, false, false, true, 6, NOW(), NOW());

-- Insert room amenities
INSERT INTO room_amenities (room_id, amenity) VALUES
(1, 'wifi'), (1, 'air-conditioning'), (1, 'tv'),
(2, 'wifi'), (2, 'air-conditioning'), (2, 'tv'), (2, 'minibar'),
(3, 'wifi'), (3, 'air-conditioning'), (3, 'tv'), (3, 'minibar'), (3, 'safe'),
(4, 'wifi'), (4, 'air-conditioning'), (4, 'tv'), (4, 'minibar'), (4, 'safe'), (4, 'jacuzzi'),
(5, 'wifi'), (5, 'air-conditioning'), (5, 'tv'), (5, 'minibar'),
(6, 'wifi'), (6, 'air-conditioning'), (6, 'tv'),
(7, 'wifi'), (7, 'air-conditioning'), (7, 'tv'), (7, 'minibar'),
(8, 'wifi'), (8, 'air-conditioning'), (8, 'tv');

-- Insert room images
INSERT INTO room_images (room_id, image_url) VALUES
(1, '/placeholder.svg?height=300&width=400&text=Standard+Room'),
(2, '/placeholder.svg?height=300&width=400&text=Deluxe+Suite'),
(3, '/placeholder.svg?height=300&width=400&text=Sea+View+Room'),
(4, '/placeholder.svg?height=300&width=400&text=Presidential+Suite'),
(5, '/placeholder.svg?height=300&width=400&text=Charm+Room'),
(6, '/placeholder.svg?height=300&width=400&text=Economic+Room'),
(7, '/placeholder.svg?height=300&width=400&text=Resort+Room'),
(8, '/placeholder.svg?height=300&width=400&text=Traditional+Room');

-- Insert sample bookings
INSERT INTO bookings (booking_reference, check_in_date, check_out_date, nights, guests, total_amount, original_price, discount_amount, status, payment_status, special_requests, guest_name, guest_email, guest_phone, user_id, hotel_id, room_id, created_at, updated_at) VALUES
('TS-ABC12345', '2024-02-15', '2024-02-20', 5, 2, 1330.00, 1400.00, 70.00, 'CONFIRMED', 'PAID', 'Vue sur mer si possible', 'Sophie Martin', 'sophie.martin@example.com', '+216 20 123 456', 1, 2, 3, NOW(), NOW()),
('TS-DEF67890', '2024-03-10', '2024-03-13', 3, 2, 945.00, 1050.00, 105.00, 'CONFIRMED', 'PAID', 'Arrivée tardive', 'Ahmed Ben Ali', 'ahmed.benali@email.com', '+216 25 789 123', 3, 3, 5, NOW(), NOW()),
('TS-GHI11111', '2024-02-25', '2024-02-27', 2, 1, 228.00, 240.00, 12.00, 'PENDING', 'PENDING', '', 'Marie Dubois', 'marie.dubois@email.com', '+216 22 456 789', 4, 1, 1, NOW(), NOW());

-- Insert sample reviews
INSERT INTO reviews (rating, title, comment, cleanliness_rating, service_rating, location_rating, value_rating, verified, user_id, hotel_id, booking_id, created_at, updated_at) VALUES
(5, 'Séjour exceptionnel', 'Hôtel magnifique avec un service impeccable. La vue sur mer était à couper le souffle !', 5, 5, 5, 4, true, 1, 2, 1, NOW(), NOW()),
(4, 'Très bon hôtel', 'Cadre authentique et charmant. Quelques petits détails à améliorer mais globalement très satisfait.', 4, 4, 5, 4, true, 3, 3, 2, NOW(), NOW());

-- Insert sample favorites
INSERT INTO favorites (user_id, hotel_id, created_at) VALUES
(1, 2, NOW()),
(1, 3, NOW()),
(3, 1, NOW()),
(4, 5, NOW());

-- Insert sample notifications
INSERT INTO notifications (title, message, type, is_read, user_id, created_at) VALUES
('Bienvenue sur TunisiaStay !', 'Découvrez nos offres exclusives et gagnez des points de fidélité.', 'INFO', false, 1, NOW()),
('Réservation confirmée', 'Votre réservation TS-ABC12345 au Four Seasons Tunis a été confirmée.', 'SUCCESS', false, 1, NOW()),
('Nouveau niveau de fidélité', 'Félicitations ! Vous êtes maintenant membre Gold.', 'SUCCESS', true, 1, NOW()),
('Bienvenue sur TunisiaStay !', 'Découvrez nos offres exclusives et gagnez des points de fidélité.', 'INFO', false, 3, NOW()),
('Réservation confirmée', 'Votre réservation TS-DEF67890 à Villa Didon a été confirmée.', 'SUCCESS', false, 3, NOW());
