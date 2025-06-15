function generateRandomPrice(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

const PRODUCTS = {
    fruits: [
        {
            id: 1,
            name: "Fresh Apples",
            price: 2.99,
            image: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg",
            category: "fruits",
            rating: 4.8,
            description: "Sweet and crispy red apples, perfect for snacking",
            available: true,
            unit: "kg",
            specs: ["Fresh", "Organic", "Local Farm"],
            stock: 100,
            featured: true
        },
        {
            id: 2,
            name: "Bananas",
            price: 1.99,
            image: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg",
            category: "fruits",
            rating: 4.7,
            description: "Ripe yellow bananas, rich in potassium",
            available: true,
            unit: "dozen",
            specs: ["Fresh", "Ready to Eat"]
        },
        {
            id: 3,
            name: "Fresh Oranges",
            price: 3.49,
            image: "https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg",
            category: "fruits",
            rating: 4.6,
            description: "Juicy oranges, rich in Vitamin C",
            available: true,
            unit: "kg",
            specs: ["Sweet", "Seedless", "Fresh"]
        },
        {
            id: 4,
            name: "Strawberries",
            price: 4.99,
            image: "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg",
            category: "fruits",
            rating: 4.9,
            description: "Sweet and fresh strawberries",
            available: true,
            unit: "box",
            specs: ["Organic", "Fresh Picked"]
        },
        {
            id: 15,
            name: "Green Grapes",
            price: 3.99,
            image: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg",
            category: "fruits",
            rating: 4.5,
            description: "Sweet and juicy green grapes",
            available: true,
            unit: "kg",
            specs: ["Fresh", "Seedless"]
        },
        {
            id: 16,
            name: "Mangoes",
            price: 5.99,
            image: "https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg",
            category: "fruits",
            rating: 4.9,
            description: "Sweet and ripe mangoes",
            available: true,
            unit: "kg",
            specs: ["Premium Quality", "Seasonal"]
        }
    ],
    vegetables: [
        {
            id: 5,
            name: "Fresh Tomatoes",
            price: 3.49,
            image: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg",
            category: "vegetables",
            rating: 4.6,
            description: "Ripe red tomatoes, perfect for salads",
            available: true,
            unit: "kg",
            specs: ["Fresh", "Local Farm"]
        },
        {
            id: 6,
            name: "Spinach",
            price: 2.49,
            image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg",
            category: "vegetables",
            rating: 4.7,
            description: "Fresh green spinach leaves",
            available: true,
            unit: "bunch",
            specs: ["Organic", "Fresh"]
        },
        {
            id: 7,
            name: "Carrots",
            price: 1.99,
            image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg",
            category: "vegetables",
            rating: 4.5,
            description: "Fresh and crunchy carrots",
            available: true,
            unit: "kg",
            specs: ["Organic", "Fresh", "Local"]
        },
        {
            id: 8,
            name: "Potatoes",
            price: 2.99,
            image: "https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg",
            category: "vegetables",
            rating: 4.4,
            description: "Fresh potatoes for cooking",
            available: true,
            unit: "kg",
            specs: ["Fresh", "Local Farm"]
        },
        {
            id: 17,
            name: "Bell Peppers",
            price: 2.99,
            image: "https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg",
            category: "vegetables",
            rating: 4.6,
            description: "Fresh colorful bell peppers",
            available: true,
            unit: "kg",
            specs: ["Organic", "Mixed Colors"]
        }
    ],
    dairy: [
        {
            id: 9,
            name: "Fresh Milk",
            price: 3.99,
            image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg",
            category: "dairy",
            rating: 4.8,
            description: "Fresh whole milk from local dairy farms",
            available: true,
            unit: "liter",
            specs: ["Pasteurized", "Vitamin D"],
            stock: 50
        },
        {
            id: 10,
            name: "Cheese",
            price: 5.99,
            image: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg",
            category: "dairy",
            rating: 4.7,
            description: "Premium cheddar cheese",
            available: true,
            unit: "pack",
            specs: ["Aged", "Natural"]
        },
        {
            id: 11,
            name: "Yogurt",
            price: 2.49,
            image: "https://images.pexels.com/photos/373882/pexels-photo-373882.jpeg",
            category: "dairy",
            rating: 4.6,
            description: "Creamy natural yogurt",
            available: true,
            unit: "pack",
            specs: ["Probiotic", "Low Fat"]
        },
        {
            id: 18,
            name: "Greek Yogurt",
            price: 4.49,
            image: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
            category: "dairy",
            rating: 4.7,
            description: "Creamy Greek yogurt",
            available: true,
            unit: "pack",
            specs: ["High Protein", "Low Fat"]
        }
    ],
    bakery: [
        {
            id: 12,
            name: "Whole Wheat Bread",
            price: 2.99,
            image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
            category: "bakery",
            rating: 4.6,
            description: "Freshly baked whole wheat bread",
            available: true,
            unit: "loaf",
            specs: ["Fresh Baked", "100% Whole Wheat"]
        },
        {
            id: 13,
            name: "Croissants",
            price: 3.99,
            image: "https://images.pexels.com/photos/3724/food-morning-breakfast-orange.jpg",
            category: "bakery",
            rating: 4.8,
            description: "Freshly baked butter croissants",
            available: true,
            unit: "pack",
            specs: ["Fresh Baked", "Buttery"]
        },
        {
            id: 14,
            name: "Muffins",
            price: 4.99,
            image: "https://images.pexels.com/photos/3872955/pexels-photo-3872955.jpeg",
            category: "bakery",
            rating: 4.7,
            description: "Assorted fresh muffins",
            available: true,
            unit: "pack",
            specs: ["Fresh Baked", "Assorted Flavors"]
        }
    ],
    combos: [
        {
            id: 101,
            name: "Weekly Essentials Pack",
            price: 499,
            originalPrice: 650,
            image: "https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg",
            category: "combos",
            rating: 4.9,
            description: "Essential groceries pack for a week",
            available: true,
            unit: "pack",
            items: [
                "2kg Rice",
                "1kg Dal",
                "1L Cooking Oil",
                "1kg Sugar",
                "500g Tea"
            ],
            savings: "151",
            tag: "Best Value"
        },
        {
            id: 102,
            name: "Fresh Fruits Basket",
            price: 399,
            originalPrice: 500,
            image: "https://images.pexels.com/photos/1027022/pexels-photo-1027022.jpeg",
            category: "combos",
            rating: 4.8,
            description: "Assorted fresh fruits pack",
            available: true,
            unit: "pack",
            items: [
                "1kg Apples",
                "1kg Oranges",
                "1kg Bananas",
                "500g Grapes"
            ],
            savings: "101",
            tag: "Popular"
        },
        {
            id: 103,
            name: "Breakfast Combo",
            price: 299,
            originalPrice: 399,
            image: "https://images.pexels.com/photos/5137026/pexels-photo-5137026.jpeg",
            category: "combos",
            rating: 4.7,
            description: "Complete breakfast essentials",
            available: true,
            unit: "pack",
            items: [
                "1 Bread Pack",
                "6 Eggs",
                "1L Milk",
                "200g Butter",
                "100g Tea"
            ],
            savings: "100",
            tag: "Morning Special"
        },
        {
            id: 104,
            name: "Healthy Snacks Pack",
            price: 449,
            originalPrice: 599,
            image: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
            category: "combos",
            rating: 4.6,
            description: "Assorted healthy snacks",
            available: true,
            unit: "pack",
            items: [
                "Mixed Nuts 500g",
                "Greek Yogurt 400g",
                "Granola 250g",
                "Dark Chocolate 100g"
            ],
            savings: "150",
            tag: "Healthy Choice"
        }
    ],
    snacks: [
        {
            id: 201,
            name: "Mixed Nuts Pack",
            price: 299,
            onlinePrice: 279,
            image: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg",
            category: "snacks",
            rating: 4.7,
            description: "Healthy mixed nuts pack",
            available: true,
            unit: "pack",
            specs: ["Premium Quality", "No Added Sugar"]
        }
    ],
    beverages: [
        {
            id: 301,
            name: "Green Tea Pack",
            price: 199,
            onlinePrice: 179,
            image: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg",
            category: "beverages",
            rating: 4.6,
            description: "Organic green tea bags",
            available: true,
            unit: "pack",
            specs: ["25 Tea Bags", "Natural"]
        }
    ],
    personal_care: [
        {
            id: 401,
            name: "Colgate MaxFresh Toothpaste",
            price: 89,
            image: "https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg",
            category: "personal_care",
            rating: 4.7,
            description: "Fresh mint toothpaste for complete oral care",
            available: true,
            unit: "pack",
            specs: ["Complete Protection", "Fresh Breath"]
        },
        {
            id: 402,
            name: "Dove Shampoo",
            price: 199,
            image: "https://images.pexels.com/photos/6621140/pexels-photo-6621140.jpeg",
            category: "personal_care",
            rating: 4.8,
            description: "Nourishing shampoo for smooth hair",
            available: true,
            unit: "bottle",
            specs: ["Damage Repair", "Smooth Hair"]
        },
        {
            id: 403,
            name: "Dettol Soap",
            price: 45,
            image: "https://images.pexels.com/photos/6621264/pexels-photo-6621264.jpeg",
            category: "personal_care",
            rating: 4.6,
            description: "Antibacterial soap for protection",
            available: true,
            unit: "piece",
            specs: ["Germ Protection", "Fresh Scent"]
        },
        {
            id: 404,
            name: "Face Serum",
            price: 299,
            image: "https://images.pexels.com/photos/6621555/pexels-photo-6621555.jpeg",
            category: "personal_care",
            rating: 4.8,
            description: "Vitamin C enriched face serum",
            available: true,
            unit: "bottle",
            specs: ["Vitamin C", "Anti-aging", "Serums"]
        },
        {
            id: 405,
            name: "Face Cream",
            price: 199,
            image: "https://images.pexels.com/photos/6621424/pexels-photo-6621424.jpeg",
            category: "personal_care",
            rating: 4.7,
            description: "Moisturizing face cream",
            available: true,
            unit: "jar",
            specs: ["Moisturizing", "All Skin Types", "Creams"]
        },
        {
            id: 406,
            name: "Hair Oil",
            price: 149,
            image: "https://images.pexels.com/photos/6621503/pexels-photo-6621503.jpeg",
            category: "personal_care",
            rating: 4.6,
            description: "Nourishing hair oil",
            available: true,
            unit: "bottle",
            specs: ["Hair Care", "Natural", "Oils"]
        },
        {
            id: 407,
            name: "Face Mask",
            price: 99,
            image: "https://images.pexels.com/photos/6621489/pexels-photo-6621489.jpeg",
            category: "personal_care",
            rating: 4.5,
            description: "Clay face mask",
            available: true,
            unit: "pack",
            specs: ["Deep Cleansing", "Clay Mask", "Masks"]
        }
    ],
    kitchen: [
        {
            id: 501,
            name: "Non-stick Pan",
            price: 599,
            image: "https://images.pexels.com/photos/4109907/pexels-photo-4109907.jpeg",
            category: "kitchen",
            rating: 4.6,
            description: "Premium non-stick cooking pan",
            available: true,
            unit: "piece",
            specs: ["Non-stick", "Durable"]
        },
        {
            id: 502,
            name: "Cutting Board",
            price: 299,
            image: "https://images.pexels.com/photos/4226876/pexels-photo-4226876.jpeg",
            category: "kitchen",
            rating: 4.5,
            description: "Wooden cutting board",
            available: true,
            unit: "piece",
            specs: ["Eco-friendly", "Durable"]
        },
        {
            id: 503,
            name: "Kitchen Knife Set",
            price: 899,
            image: "https://images.pexels.com/photos/4226805/pexels-photo-4226805.jpeg",
            category: "kitchen",
            rating: 4.7,
            description: "Professional kitchen knife set",
            available: true,
            unit: "set",
            specs: ["Stainless Steel", "Sharp Edge"]
        },
        {
            id: 504,
            name: "Food Processor",
            price: 1999,
            image: "https://images.pexels.com/photos/4226893/pexels-photo-4226893.jpeg",
            category: "kitchen",
            rating: 4.8,
            description: "Multi-function food processor",
            available: true,
            unit: "piece",
            specs: ["Electric", "Multi-function"]
        },
        {
            id: 505,
            name: "Storage Containers",
            price: 399,
            image: "https://images.pexels.com/photos/4226866/pexels-photo-4226866.jpeg",
            category: "kitchen",
            rating: 4.6,
            description: "Airtight storage containers set",
            available: true,
            unit: "set",
            specs: ["Airtight", "BPA Free"]
        }
    ],
    ready_to_eat: [
        {
            id: 601,
            name: "Instant Noodles",
            price: 49,
            image: "https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg",
            category: "ready_to_eat",
            rating: 4.4,
            description: "Quick and tasty instant noodles",
            available: true,
            unit: "pack",
            specs: ["Ready in 3 mins", "Spicy"]
        },
        {
            id: 602,
            name: "Frozen Pizza",
            price: 299,
            image: "https://images.pexels.com/photos/845811/pexels-photo-845811.jpeg",
            category: "ready_to_eat",
            rating: 4.3,
            description: "Classic margherita frozen pizza",
            available: true,
            unit: "pack",
            specs: ["Ready to Cook", "Serves 2"]
        },
        {
            id: 603,
            name: "Canned Soup",
            price: 89,
            image: "https://images.pexels.com/photos/5908226/pexels-photo-5908226.jpeg",
            category: "ready_to_eat",
            rating: 4.2,
            description: "Vegetable soup ready to heat",
            available: true,
            unit: "can",
            specs: ["Ready to Heat", "Healthy"]
        },
        {
            id: 604,
            name: "Pasta Pack",
            price: 149,
            image: "https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg",
            category: "ready_to_eat",
            rating: 4.5,
            description: "Ready to cook pasta pack",
            available: true,
            unit: "pack",
            specs: ["Quick Cook", "Italian"]
        },
        {
            id: 605,
            name: "Microwave Meals",
            price: 199,
            image: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg",
            category: "ready_to_eat",
            rating: 4.3,
            description: "Assorted microwave meals",
            available: true,
            unit: "pack",
            specs: ["Microwave Ready", "Quick Meal"]
        }
    ]
};

const CATEGORIES = [
    { id: 'all', name: 'All Items', icon: 'fas fa-border-all' },
    { id: 'combos', name: 'Combo Offers', icon: 'fas fa-tags' },
    { id: 'fruits', name: 'Fruits', icon: 'fas fa-apple-alt' },
    { id: 'vegetables', name: 'Vegetables', icon: 'fas fa-carrot' },
    { id: 'dairy', name: 'Dairy', icon: 'fas fa-cheese' },
    { id: 'bakery', name: 'Bakery', icon: 'fas fa-bread-slice' },
    { id: 'beverages', name: 'Beverages', icon: 'fas fa-mug-hot' },
    { id: 'snacks', name: 'Snacks', icon: 'fas fa-cookie' },
    { id: 'household', name: 'Household', icon: 'fas fa-home' },
    { id: 'personal_care', name: 'Personal Care', icon: 'fas fa-pump-soap' },
    { id: 'kitchen', name: 'Kitchen', icon: 'fas fa-utensils' },
    { id: 'ready_to_eat', name: 'Ready to Eat', icon: 'fas fa-hamburger' }
];

let USERS = {
    'admin@freshmart.com': {
        name: 'Admin',
        password: 'admin123',
        role: 'admin',
        orders: []
    }
    // ... other initial users
};

const CAROUSEL_ITEMS = [
    {
        id: 1,
        image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
        title: "Fresh Produce",
        description: "20% off on all fresh fruits and vegetables",
        couponCode: "FRESH20"
    },
    {
        id: 2,
        image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg",
        title: "Organic Week",
        description: "Buy organic products at special prices",
        couponCode: "ORGANIC15"
    },
    {
        id: 3,
        image: "https://images.pexels.com/photos/2294477/pexels-photo-2294477.jpeg",
        title: "Daily Essentials",
        description: "Get 10% off on daily essentials",
        couponCode: "DAILY10"
    }
];

// Order Status Types
const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// Admin Settings
const ADMIN_SETTINGS = {
    orderStatuses: ORDER_STATUS,
    paymentMethods: ['COD', 'Online Payment', 'UPI'],
    deliverySlots: [
        { id: 'morning', time: '9 AM - 12 PM' },
        { id: 'afternoon', time: '2 PM - 5 PM' },
        { id: 'evening', time: '6 PM - 9 PM' }
    ],
    notifications: {
        orderConfirmation: true,
        orderStatus: true,
        promotions: true
    }
};

// Analytics Data Structure
const ANALYTICS = {
    sales: {
        daily: {},
        weekly: {},
        monthly: {}
    },
    users: {
        new: [],
        active: [],
        total: 0
    },
    products: {
        popular: [],
        outOfStock: [],
        lowStock: []
    },
    orders: {
        pending: [],
        processing: [],
        completed: [],
        cancelled: []
    }
};

// Export all data (in a real app, this would be a database)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CATEGORIES,
        PRODUCTS,
        USERS,
        ORDER_STATUS,
        CAROUSEL_ITEMS,
        ADMIN_SETTINGS,
        ANALYTICS,
        saveUsers,
        loadUsers
    };
}

// Initialize data when the file loads
loadUsers();

// Function to generate mock notifications for admin panel
function generateNotifications() {
    const notifications = [];
    
    // Check for low stock items
    Object.values(PRODUCTS).flat().forEach(product => {
        if (product.stock < 10 && product.available) {
            notifications.push({
                id: 'NOTIF' + Date.now(),
                type: 'stock',
                message: `Low stock alert: ${product.name} (${product.stock} ${product.unit} remaining)`,
                priority: 'high',
                timestamp: new Date().toISOString()
            });
        }
    });

    // Check for pending orders
    Object.values(USERS).forEach(user => {
        if (user.orders) {
            user.orders.forEach(order => {
                if (order.status === ORDER_STATUS.PENDING) {
                    notifications.push({
                        id: 'NOTIF' + Date.now(),
                        type: 'order',
                        message: `New order #${order.id} needs processing`,
                        priority: 'medium',
                        timestamp: order.createdAt
                    });
                }
            });
        }
    });

    return notifications.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, 10); // Return only the 10 most recent notifications
}

function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        USERS = JSON.parse(savedUsers);
    }
} 