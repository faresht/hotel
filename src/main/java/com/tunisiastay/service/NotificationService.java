package com.tunisiastay.service;

import com.tunisiastay.entity.Booking;
import com.tunisiastay.entity.Notification;
import com.tunisiastay.entity.User;
import com.tunisiastay.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Page<Notification> getUserNotifications(Long userId, int page, int size) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size));
    }
    
    public long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }
    
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
    
    public void createWelcomeNotification(User user) {
        Notification notification = Notification.builder()
                .title("Bienvenue sur TunisiaStay !")
                .message("Découvrez nos offres exclusives et gagnez des points de fidélité. Vous avez reçu 100 points de bienvenue !")
                .type(Notification.Type.INFO)
                .user(user)
                .build();
        
        notificationRepository.save(notification);
    }
    
    public void createBookingNotification(User user, Booking booking) {
        Notification notification = Notification.builder()
                .title("Réservation créée")
                .message(String.format("Votre réservation %s à %s a été créée avec succès.", 
                    booking.getBookingReference(), booking.getHotel().getName()))
                .type(Notification.Type.SUCCESS)
                .user(user)
                .build();
        
        notificationRepository.save(notification);
    }
    
    public void createLoyaltyUpgradeNotification(User user, User.LoyaltyLevel newLevel) {
        Notification notification = Notification.builder()
                .title("Niveau de fidélité mis à jour !")
                .message(String.format("Félicitations ! Vous êtes maintenant membre %s et bénéficiez d'avantages exclusifs.", 
                    newLevel.name()))
                .type(Notification.Type.SUCCESS)
                .user(user)
                .build();
        
        notificationRepository.save(notification);
    }
}
