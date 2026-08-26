package com.greenlink.config;

import com.greenlink.entity.*;
import com.greenlink.enums.*;
import com.greenlink.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private SustainabilityServiceRepository serviceRepository;

    @Autowired
    private LearningResourceRepository learningRepository;

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private EcoEventRepository eventRepository;

    @Autowired
    private WasteSubmissionRepository wasteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Initializing GreenLink baseline seed data in PostgreSQL...");

        // 1. Roles
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER).orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_USER)));
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_ADMIN)));

        // 2. Admin User
        User adminUser = userRepository.findByEmail("admin@greenlink.org").orElseGet(() -> {
            User admin = new User("GreenLink Administrator", "admin", "admin@greenlink.org", passwordEncoder.encode("Admin@123"), "+1 800-555-0199", "100 Green Tower Way, Eco City");
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(userRole);
            admin.setRoles(roles);
            admin.setRewardPoints(500);
            return userRepository.save(admin);
        });

        // 3. Normal User
        User normalUser = userRepository.findByEmail("user@greenlink.org").orElseGet(() -> {
            User user = new User("John Eco Lover", "john_green", "user@greenlink.org", passwordEncoder.encode("User@123"), "+1 555-014-8822", "42 Sustainability Lane, Greenfield");
            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            user.setRoles(roles);
            user.setRewardPoints(120);
            return userRepository.save(user);
        });

        // 4. Badges
        if (badgeRepository.count() == 0) {
            badgeRepository.save(new Badge("RECYCLER_STARTER", "Recycling Starter", "Completed your first waste recycling request.", "♻️", 50));
            badgeRepository.save(new Badge("ECO_SELLER", "Eco Seller", "Listed sustainable handmade or upcycled products.", "🌱", 100));
            badgeRepository.save(new Badge("GREEN_LEARNER", "Green Learner", "Completed reading environmental education guides.", "📚", 150));
            badgeRepository.save(new Badge("SUSTAINABILITY_CHAMPION", "Sustainability Champion", "Achieved over 300 reward points on GreenLink.", "🏆", 300));
        }

        // 5. Categories
        Category cat1 = categoryRepository.findByName("Recycled Goods").orElseGet(() -> categoryRepository.save(new Category("Recycled Goods", "Products crafted from recycled plastic, glass, and metals", "♻️")));
        Category cat2 = categoryRepository.findByName("Organic & Homemade").orElseGet(() -> categoryRepository.save(new Category("Organic & Homemade", "Chemical-free homemade soaps, skincare, and organic foods", "🧼")));
        Category cat3 = categoryRepository.findByName("Energy Saving Devices").orElseGet(() -> categoryRepository.save(new Category("Energy Saving Devices", "Solar lamps, smart thermostats, and low-energy monitors", "💡")));
        Category cat4 = categoryRepository.findByName("Zero Waste Goods").orElseGet(() -> categoryRepository.save(new Category("Zero Waste Goods", "Bamboo toothbrushes, stainless steel straws, reusable totes", "🎒")));

        // 6. Sample Products
        if (productRepository.count() == 0) {
            Product p1 = new Product();
            p1.setSeller(normalUser);
            p1.setName("Upcycled Ocean Plastic Tote Bag");
            p1.setDescription("Durable, waterproof tote bag woven entirely out of recovered marine plastic bottles. Stylish and ocean-friendly!");
            p1.setCategory(cat1);
            p1.setPrice(new BigDecimal("24.99"));
            p1.setQuantity(25);
            p1.setImageUrl("https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80");
            p1.setSustainabilityInfo("100% Recycled PET Ocean Plastic");
            p1.setCondition("Brand New");
            p1.setLocation("Portland, OR");
            p1.setStatus(ProductStatus.APPROVED);
            productRepository.save(p1);

            Product p2 = new Product();
            p2.setSeller(normalUser);
            p2.setName("Organic Lavender & Honey Handcrafted Soap Bar");
            p2.setDescription("Cold-processed organic soap with pure essential lavender oil and local wildflower honey. Palm-oil free and zero plastic packaging.");
            p2.setCategory(cat2);
            p2.setPrice(new BigDecimal("8.50"));
            p2.setQuantity(40);
            p2.setImageUrl("https://images.unsplash.com/photo-1607006482602-76ca0fd2f88d?w=600&auto=format&fit=crop&q=80");
            p2.setSustainabilityInfo("100% Biodegradable & Organic Ingredients");
            p2.setCondition("Handmade Fresh");
            p2.setLocation("Seattle, WA");
            p2.setStatus(ProductStatus.APPROVED);
            productRepository.save(p2);

            Product p3 = new Product();
            p3.setSeller(normalUser);
            p3.setName("Portable Solar Outdoor Lantern");
            p3.setDescription("Waterproof LED lantern powered by an integrated high-efficiency solar panel. Perfect for camping, garden lighting, and emergency backup.");
            p3.setCategory(cat3);
            p3.setPrice(new BigDecimal("34.95"));
            p3.setQuantity(15);
            p3.setImageUrl("https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80");
            p3.setSustainabilityInfo("Zero Energy Grid Consumption");
            p3.setCondition("Brand New");
            p3.setLocation("Denver, CO");
            p3.setStatus(ProductStatus.APPROVED);
            productRepository.save(p3);

            Product p4 = new Product();
            p4.setSeller(normalUser);
            p4.setName("Organic Bamboo Cutlery & Straw Kit");
            p4.setDescription("Compact travel case containing reusable bamboo fork, spoon, knife, chopsticks, straw, and coconut fiber cleaning brush.");
            p4.setCategory(cat4);
            p4.setPrice(new BigDecimal("14.00"));
            p4.setQuantity(50);
            p4.setImageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80");
            p4.setSustainabilityInfo("FSC-Certified Organic Bamboo");
            p4.setCondition("Brand New");
            p4.setLocation("Austin, TX");
            p4.setStatus(ProductStatus.APPROVED);
            productRepository.save(p4);

            // Pending Product for Admin Review Demonstration
            Product pPending = new Product();
            pPending.setSeller(normalUser);
            pPending.setName("Recycled Glass Planter Pot");
            pPending.setDescription("Hand-turned flower pot molded from melted wine bottle glass.");
            pPending.setCategory(cat1);
            pPending.setPrice(new BigDecimal("19.99"));
            pPending.setQuantity(10);
            pPending.setImageUrl("https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80");
            pPending.setSustainabilityInfo("Made from upcycled glass waste");
            pPending.setCondition("Handcrafted");
            pPending.setLocation("San Francisco, CA");
            pPending.setStatus(ProductStatus.PENDING);
            productRepository.save(pPending);
        }

        // 7. Sustainability Services
        if (serviceRepository.count() == 0) {
            SustainabilityService s1 = new SustainabilityService();
            s1.setName("GreenCycle E-Waste Facility");
            s1.setDescription("Certified e-waste collection center accepting old computers, smartphones, batteries, and appliances for safe heavy metal extraction and recycling.");
            s1.setCategory("E-Waste Recycling");
            s1.setLocation("150 Industrial Parkway, Tech Park");
            s1.setContactInfo("contact@greencycle-ewaste.org | +1 888-392-7835");
            s1.setAvailability("Mon-Sat: 8:00 AM - 6:00 PM");
            s1.setImageUrl("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80");
            s1.setActive(true);
            serviceRepository.save(s1);

            SustainabilityService s2 = new SustainabilityService();
            s2.setName("Urban Organic Compost Hub");
            s2.setDescription("Drop off household food scraps and garden waste to be converted into rich organic soil nutrients for community urban farming.");
            s2.setCategory("Organic Composting");
            s2.setLocation("Community Garden Center, 5th Avenue");
            s2.setContactInfo("info@urbancompost.org | +1 888-444-9090");
            s2.setAvailability("Open 24/7 Drop-off");
            s2.setImageUrl("https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80");
            s2.setActive(true);
            serviceRepository.save(s2);
        }

        // 8. Learning Resources
        if (learningRepository.count() == 0) {
            LearningResource l1 = new LearningResource();
            l1.setTitle("Understanding Circular Economy & Zero Waste Living");
            l1.setDescription("Learn how the circular economy model eliminates waste through smart design, reuse, repair, and recycling.");
            l1.setCategory("Circular Economy");
            l1.setContent("The circular economy is a systemic approach to economic development designed to benefit businesses, society, and the environment. In contrast to the traditional 'take-make-waste' linear model, a circular economy is regenerative by design and aims to gradually decouple growth from the consumption of finite resources.\n\n### Key Principles:\n1. **Eliminate waste and pollution**: Design products so materials can be safely cycled continuously.\n2. **Circulate products and materials**: Keep items in high-value usage through repair, refurbishment, and upcycling.\n3. **Regenerate nature**: Avoid using non-renewable resources and support natural ecosystem restoration.\n\nBy choosing recycled products on GreenLink and participating in local repair hubs, you actively build a resilient circular future!");
            l1.setImageUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80");
            l1.setExternalReference("https://ellenmacarthurfoundation.org");
            learningRepository.save(l1);

            LearningResource l2 = new LearningResource();
            l2.setTitle("Home Composting 101: Turn Food Scraps into Gold");
            l2.setDescription("A beginner's guide to managing green and brown materials for healthy, odor-free backyard or balcony composting.");
            l2.setCategory("Waste Management");
            l2.setContent("Composting is nature's way of recycling organic matter back into nutrient-rich soil booster. Over 30% of household municipal waste consists of food scraps and yard trimmings that can easily be composted.\n\n### Nitrogen Greens vs Carbon Browns:\n- **Greens (High Nitrogen)**: Vegetable scraps, fruit peels, coffee grounds, fresh grass clippings.\n- **Browns (High Carbon)**: Dry leaves, cardboard boxes, straw, untreated wood sawdust.\n\nMaintain a ratio of 3 parts Browns to 1 part Greens, keep the pile moist like a wrung-out sponge, and turn weekly!");
            l2.setImageUrl("https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600&auto=format&fit=crop&q=80");
            l2.setExternalReference("https://www.epa.gov/recycle/composting-home");
            learningRepository.save(l2);
        }

        // 9. Eco-Events
        if (eventRepository.count() == 0) {
            EcoEvent e1 = new EcoEvent();
            e1.setTitle("City Riverbed & Beach Clean-up Drive");
            e1.setDescription("Join our weekend community drive to clear single-use plastic bottles, wrappers, and debris along the shoreline.");
            e1.setEventDate(LocalDate.now().plusDays(10));
            e1.setEventTime(LocalTime.of(9, 0));
            e1.setLocation("Ocean View Pier Entrance");
            e1.setCapacity(50);
            e1.setRegisteredCount(12);
            e1.setOrganizer("GreenLink Eco Action Team");
            e1.setStatus(EventStatus.UPCOMING);
            e1.setImageUrl("https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80");
            eventRepository.save(e1);

            EcoEvent e2 = new EcoEvent();
            e2.setTitle("Urban Tree Planting & Reforestation Workshop");
            e2.setDescription("Learn native tree planting techniques and plant 200 saplings in the urban greenbelt park.");
            e2.setEventDate(LocalDate.now().plusDays(18));
            e2.setEventTime(LocalTime.of(10, 30));
            e2.setLocation("Greenbelt Central Park Area B");
            e2.setCapacity(30);
            e2.setRegisteredCount(8);
            e2.setOrganizer("City Reforestation Trust");
            e2.setStatus(EventStatus.UPCOMING);
            e2.setImageUrl("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80");
            eventRepository.save(e2);
        }

        // 10. Community Posts & Comments
        if (postRepository.count() == 0) {
            CommunityPost post1 = new CommunityPost();
            post1.setUser(normalUser);
            post1.setTitle("Tips for Reducing Household Single-Use Plastics in 2026");
            post1.setContent("Hey everyone! I recently replaced all liquid dish soap bottles with solid dish soap bars and reusable glass spray bottles. Has anyone tried beeswax wraps for food storage?");
            post1.setCategory("Sustainable Lifestyle");
            post1.setLikesCount(14);
            post1 = postRepository.save(post1);

            Comment c1 = new Comment();
            c1.setUser(adminUser);
            c1.setPost(post1);
            c1.setContent("Beeswax wraps are fantastic! They last for over a year and keep bread and cheese incredibly fresh.");
            commentRepository.save(c1);
        }

        // 11. Sample Waste Submission
        if (wasteRepository.count() == 0) {
            WasteSubmission w1 = new WasteSubmission();
            w1.setUser(normalUser);
            w1.setWasteType("Used Lithium Batteries & Broken Electronics");
            w1.setDescription("Bag of 15 AA/AAA rechargeable batteries and an old broken laptop tablet.");
            w1.setQuantity("Approx 3.5 kg");
            w1.setLocation("42 Sustainability Lane");
            w1.setPreferredAction(WasteAction.RECYCLING);
            w1.setStatus(WasteStatus.SUBMITTED);
            wasteRepository.save(w1);
        }

        logger.info("GreenLink baseline seed data initialized successfully!");
    }
}
