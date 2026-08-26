package com.greenlink.service;

import com.greenlink.dto.AdminDto.AdminDashboardStats;
import com.greenlink.enums.ProductStatus;
import com.greenlink.enums.WasteStatus;
import com.greenlink.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private WasteSubmissionRepository wasteRepository;

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private EcoEventRepository eventRepository;

    @Autowired
    private RewardTransactionRepository rewardRepository;

    public AdminDashboardStats getAdminDashboardStats() {
        AdminDashboardStats stats = new AdminDashboardStats();

        stats.setTotalUsers(userRepository.count());
        stats.setActiveUsers(userRepository.findAll().stream().filter(u -> u.isActive()).count());

        stats.setTotalProducts(productRepository.count());
        stats.setPendingProducts(productRepository.countByStatus(ProductStatus.PENDING));
        stats.setApprovedProducts(productRepository.countByStatus(ProductStatus.APPROVED));

        stats.setTotalOrders(orderRepository.count());

        stats.setTotalWasteSubmissions(wasteRepository.count());
        stats.setPendingWasteRequests(wasteRepository.countByStatus(WasteStatus.SUBMITTED) + wasteRepository.countByStatus(WasteStatus.UNDER_REVIEW));

        stats.setTotalCommunityPosts(postRepository.count());
        stats.setTotalEcoEvents(eventRepository.count());

        long totalPoints = rewardRepository.findAll().stream().mapToLong(r -> r.getPoints()).sum();
        stats.setTotalRewardPointsAwarded(totalPoints);

        return stats;
    }
}
