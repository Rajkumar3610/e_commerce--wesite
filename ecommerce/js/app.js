// Add this to the top of your CSS in index.html or in a separate style tag
document.head.insertAdjacentHTML('beforeend', `
    <style>
        html {
            scroll-behavior: smooth !important;
        }
        
        .smooth-scroll {
            scroll-behavior: smooth !important;
            -webkit-overflow-scrolling: touch;
        }
        
        #main-content {
            scroll-behavior: smooth !important;
            -webkit-overflow-scrolling: touch;
        }
        
        .category-scroll {
            scroll-behavior: smooth !important;
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
        }
        
        .category-scroll::-webkit-scrollbar {
            display: none;
        }
    </style>
`);

if (typeof PRODUCTS === 'undefined' || typeof CATEGORIES === 'undefined' || typeof USERS === 'undefined') {
    console.error('Required data not loaded. Make sure data.js is loaded before app.js');
}

let currentPage = 'home';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedCategory = 'all';

// Authentication state
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Add this at the top of your file with other state variables
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Add this at the top with other state variables
// let locationPermissionDenied = localStorage.getItem('locationPermissionDenied') === 'true';
// let lastKnownLocation = localStorage.getItem('lastKnownLocation');

// Add this at the top of your file with other state variables
let isLoading = true;

// Update API URLs
const API_URL = 'http://localhost/freshmart/server/api';

function navigateTo(page) {
    if (page === 'profile' && !isLoggedIn()) {
        showLoginModal();
        return;
    }

    const mainContent = document.getElementById('main-content');
    mainContent.classList.add('page-transition');

    setTimeout(() => {
        currentPage = page;
        renderPage();
        setTimeout(() => {
            mainContent.classList.remove('page-transition');
        }, 500);
    }, 300);
}

function renderPage() {
    const mainContent = document.getElementById('main-content');
    
    switch(currentPage) {
        case 'home':
            renderHome();
            break;
        case 'search':
            renderSearch();
            break;
        case 'cart':
            renderCart();
            break;
        case 'profile':
            renderProfile();
            break;
        case 'orders':
            renderOrders();
            break;
        case 'wishlist':
            renderWishlist();
            break;
    }
    updateActiveNav();
}

function updateActiveNav() {
    document.querySelectorAll('nav button').forEach(btn => {
        const page = btn.getAttribute('data-page');
        if (page === currentPage) {
            btn.classList.add('active');
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'absolute inset-0 bg-white/20 rounded-lg transform scale-0 transition-transform duration-500';
            btn.appendChild(ripple);
            setTimeout(() => {
                ripple.classList.add('scale-100', 'opacity-0');
                setTimeout(() => ripple.remove(), 500);
            }, 0);
        } else {
            btn.classList.remove('active');
        }
    });
}

function renderHeader() {
    return `
        <header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
            <div class="max-w-md mx-auto px-4 py-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <button onclick="navigateTo('home')" class="text-xl font-bold text-green-600">
                            FRESH MART
                        </button>
                    </div>
                    <div class="flex items-center space-x-4">
                        ${isLoggedIn() ? `
                            <button onclick="navigateTo('profile')" 
                                class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity">
                                ${USERS[currentUser.email].profilePic ? 
                                    `<img src="${USERS[currentUser.email].profilePic}" class="w-full h-full object-cover">` :
                                    `<div class="w-full h-full bg-blue-100 flex items-center justify-center">
                                        <i class="fas fa-user text-blue-600"></i>
                                    </div>`
                                }
                            </button>
                        ` : `
                            <button onclick="showLoginModal()" 
                                class="text-blue-600 hover:text-blue-700 transition-colors">
                                Login
                            </button>
                        `}
                    </div>
                </div>
            </div>
        </header>
    `;
}

function renderCarousel() {
    return `
        <div class="relative mb-6 overflow-hidden rounded-xl">
            <div id="carousel" class="flex transition-transform duration-300">
                ${CAROUSEL_ITEMS.map(item => `
                    <div class="w-full flex-shrink-0">
                        <div class="relative h-48 bg-gradient-to-r from-green-500 to-green-600 p-6">
                            <div class="relative z-10">
                                <h2 class="text-2xl font-bold text-white mb-2">${item.title}</h2>
                                <p class="text-white opacity-90 mb-4">${item.description}</p>
                                <div class="bg-white text-green-500 px-4 py-2 rounded-lg inline-block">
                                    Use code: ${item.couponCode}
                                </div>
                            </div>
                            <img src="${item.image}" 
                                alt="${item.title}" 
                                class="absolute right-0 top-0 h-full w-1/2 object-cover opacity-50">
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="prevSlide()" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button onclick="nextSlide()" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
}

function renderHome() {
    const mainContent = document.getElementById('main-content');
    mainContent.className = 'relative min-h-screen overflow-y-auto smooth-scroll pb-16';
    
    let html = `
        ${renderHeader()}
        <div class="pt-16 pb-24">
            <div class="p-4">
                <!-- Welcome Message -->
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold">Welcome${currentUser ? `, ${currentUser.name}` : ' Back'}</h1>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="toggleTheme()" 
                            class="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                            <i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>
                        </button>
                    </div>
                </div>

                <!-- Featured Carousel - Removed arrows -->
                <div class="mb-6">
                    <div class="relative overflow-hidden rounded-xl">
                        <div id="featured-carousel" class="flex transition-transform duration-300 ease-in-out">
                            ${CAROUSEL_ITEMS.map((item, index) => `
                                <div class="w-full flex-shrink-0">
                                    <div class="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6">
                                        <div class="relative z-10">
                                            <h2 class="text-2xl font-bold text-white mb-2">${item.title}</h2>
                                            <p class="text-white opacity-90 mb-4">${item.description}</p>
                                            <div class="bg-white text-purple-500 px-4 py-2 rounded-lg inline-block">
                                                Code: ${item.couponCode}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                            ${CAROUSEL_ITEMS.map((_, index) => `
                                <button onclick="goToFeaturedSlide(${index})" 
                                    class="w-2 h-2 rounded-full bg-white/50 featured-indicator"></button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Categories with loading animation -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4">Categories</h3>
                    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide category-scroll">
                        ${CATEGORIES.map(category => `
                            <button 
                                onclick="filterByCategory('${category.id}')"
                                class="flex flex-col items-center p-3 rounded-xl ${
                                    selectedCategory === category.id ? 'bg-purple-600 text-white' : 'bg-gray-50'
                                } min-w-[80px] transition-all duration-300 hover:scale-105 ${
                                    isLoading ? 'animate-pulse' : ''
                                }">
                                <i class="${category.icon} text-xl mb-1"></i>
                                <span class="text-sm whitespace-nowrap">${category.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Selected Category Display -->
                ${selectedCategory !== 'all' ? `
                    <div class="mb-4 flex items-center justify-between">
                        <div class="flex items-center">
                            <h2 class="text-xl font-bold">
                                ${CATEGORIES.find(cat => cat.id === selectedCategory)?.name || 'All Products'}
                            </h2>
                            <span class="ml-2 text-gray-500 text-sm">
                                (${getFilteredProducts().length} items)
                            </span>
                        </div>
                        ${selectedCategory !== 'all' ? `
                            <button onclick="filterByCategory('all')" 
                                class="text-blue-600 text-sm hover:underline">
                                View All Products
                            </button>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Products Grid with loading animation -->
                <div class="grid grid-cols-2 gap-4">
                    ${isLoading ? 
                        Array(6).fill('').map(() => `
                            <div class="bg-white p-4 rounded-xl shadow-sm animate-pulse">
                                <div class="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        `).join('') 
                        : 
                        getFilteredProducts().map(product => renderProduct(product)).join('')
                    }
                </div>
            </div>
        </div>

        <!-- Updated Footer with dark mode support -->
        <nav class="fixed bottom-0 left-0 right-0 transition-colors duration-300
            ${isDarkMode ? 
                'bg-gradient-to-t from-gray-900 to-gray-800 border-gray-700' : 
                'bg-gradient-to-t from-gray-100 to-white border-gray-200'} 
            backdrop-blur-lg border-t shadow-sm">
            <div class="max-w-md mx-auto px-4">
                <div class="flex justify-between py-3">
                    ${['home', 'search', 'cart', 'profile'].map(page => `
                        <button onclick="navigateTo('${page}')" 
                            class="flex flex-col items-center transition-all duration-300 hover:scale-110 
                            ${currentPage === page ? 
                                'text-blue-600' : 
                                isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                            }">
                            <i class="fas fa-${getIconForPage(page)} text-lg"></i>
                            <span class="text-xs mt-1">${page.charAt(0).toUpperCase() + page.slice(1)}</span>
                            ${currentPage === page ? 
                                '<div class="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>' : 
                                ''
                            }
                        </button>
                    `).join('')}
                </div>
            </div>
        </nav>
    `;
    
    mainContent.innerHTML = html;
    if (!isLoading) {
        initializeCarousels();
    }
}

// Helper function for footer icons
function getIconForPage(page) {
    switch(page) {
        case 'home': return 'home';
        case 'search': return 'search';
        case 'cart': return 'shopping-cart';
        case 'profile': return 'user';
        default: return '';
    }
}

function renderSearch() {
    const mainContent = document.getElementById('main-content');
    
    let html = `
        ${renderHeader()}
        <div class="pt-16 pb-24">
            <div class="p-4">
                <!-- Search Bar with hover effect -->
                <div class="relative mb-6 group">
                    <input type="text" 
                        id="searchInput"
                        placeholder="Search products..." 
                        onkeyup="handleSearch()"
                        class="w-full px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-gray-200"
                    >
                    <i class="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors"></i>
                </div>

                <!-- Popular Categories with improved hover effects -->
                <div class="mb-6">
                    <h3 class="text-sm text-gray-500 mb-3">Popular Categories</h3>
                    <div class="flex flex-wrap gap-2">
                        ${getPopularSubcategories().map(subcat => `
                            <button 
                                onclick="filterBySubcategory('${subcat.id}')"
                                class="px-4 py-2 rounded-full border border-gray-200 text-sm 
                                    ${selectedSubcategory === subcat.id ? 
                                        'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 
                                        'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:scale-105'
                                    }
                                    transition-all duration-300 ease-in-out transform hover:shadow-md"
                            >
                                ${subcat.name}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Search Results with improved hover effects -->
                <div id="searchResults" class="grid grid-cols-2 gap-4">
                    ${getFilteredProducts().map(product => `
                        <div onclick="showProductDetails(${product.id})" 
                            class="bg-white p-4 rounded-xl shadow-sm cursor-pointer 
                                transform transition-all duration-300 ease-in-out
                                hover:shadow-lg hover:scale-105 hover:bg-blue-50 
                                active:scale-95 active:bg-blue-100"
                        >
                            <div class="relative overflow-hidden rounded-lg">
                                <img src="${product.image}" 
                                    alt="${product.name}" 
                                    class="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                                >
                                ${product.onlinePrice ? `
                                    <span class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full
                                        transform transition-transform duration-300 hover:scale-110">
                                        Online Only
                                    </span>
                                ` : ''}
                            </div>
                            <h4 class="font-medium text-sm mt-2 mb-1 truncate">${product.name}</h4>
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-bold text-blue-600">₹${product.onlinePrice || product.price}</div>
                                    ${product.onlinePrice ? `
                                        <div class="text-xs text-gray-500 line-through">₹${product.price}</div>
                                    ` : ''}
                                </div>
                                <div class="flex items-center text-sm bg-gray-50 px-2 py-1 rounded-full">
                                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                                    ${product.rating}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = html;
}

// Add this helper function to get popular subcategories
function getPopularSubcategories() {
    return [
        { id: 'oils', name: 'Oils & Gels' },
        { id: 'creams', name: 'Face Creams' },
        { id: 'serums', name: 'Face Serums' },
        { id: 'shampoos', name: 'Hair Care' },
        { id: 'soaps', name: 'Bath & Body' },
        { id: 'toothpaste', name: 'Oral Care' },
        { id: 'facewash', name: 'Face Wash' },
        { id: 'masks', name: 'Face Masks' },
        { id: 'sunscreen', name: 'Sun Care' },
        { id: 'deodorants', name: 'Deodorants' },
        { id: 'lotions', name: 'Body Lotions' },
        { id: 'haircare', name: 'Hair Styling' },
        { id: 'makeup', name: 'Makeup' },
        { id: 'skincare', name: 'Skin Care' },
        { id: 'babycare', name: 'Baby Care' },
        { id: 'mensgrooming', name: 'Men\'s Grooming' }
    ];
}

// Add this variable to track selected subcategory
let selectedSubcategory = null;

// Update the search handler for better product matching
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    
    let filteredProducts = Object.values(PRODUCTS)
        .flat()
        .filter(product => {
            const matchesSearch = 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.specs?.some(spec => spec.toLowerCase().includes(searchTerm));
            
            return matchesSearch;
        });

    // Sort results by relevance
    filteredProducts.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchTerm) ? 1 : 0;
        const bNameMatch = b.name.toLowerCase().includes(searchTerm) ? 1 : 0;
        return bNameMatch - aNameMatch;
    });

    searchResults.innerHTML = filteredProducts.length > 0 
        ? filteredProducts.map(product => renderProduct(product)).join('')
        : `<div class="col-span-2 text-center py-8 text-gray-500">
            <i class="fas fa-search text-4xl mb-4"></i>
            <p>No products found</p>
           </div>`;
}

// Add this function to handle subcategory filtering
function filterBySubcategory(subcatName) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = subcatName;
    selectedSubcategory = subcatName;
    handleSearch();
    
    // Update visual state of subcategory buttons
    document.querySelectorAll('[onclick^="filterBySubcategory"]').forEach(button => {
        const buttonSubcategory = button.getAttribute('onclick').match(/'(.+)'/)[1];
        if (buttonSubcategory === subcatName) {
            button.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        } else {
            button.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        }
    });
}

function getFilteredProducts() {
    if (selectedCategory === 'all') {
        return Object.values(PRODUCTS).flat();
    }
    return PRODUCTS[selectedCategory] || [];
}

function filterByCategory(categoryId) {
    selectedCategory = categoryId;
    const mainContent = document.getElementById('main-content');
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    renderHome();
}

function renderCart() {
    const mainContent = document.getElementById('main-content');
    const cartItems = getCartWithDetails();
    const total = calculateTotal(cartItems);
    const previousPage = currentPage === 'profile' ? 'profile' : 'home'; // Track where we came from
    
    let html = `
        ${renderHeader()}
        <div class="pt-16 pb-24">
            <div class="p-4">
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center">
                        <button onclick="navigateTo('${previousPage}')" class="mr-4">
                            <i class="fas fa-arrow-left text-xl"></i>
                        </button>
                        <h2 class="text-2xl font-bold">Shopping Cart</h2>
                    </div>
                    <span class="text-gray-500">${cartItems.length} items</span>
                </div>

                ${cartItems.length === 0 ? `
                    <div class="text-center py-8">
                        <i class="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                        <p class="text-gray-500">Your cart is empty</p>
                        <button onclick="navigateTo('home')" 
                            class="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                            Start Shopping
                        </button>
                    </div>
                ` : `
                    <!-- Rest of your cart content remains the same -->
                    <div class="space-y-4 mb-6">
                        ${cartItems.map(item => `
                            <div class="flex items-center bg-white p-4 rounded-xl shadow-sm">
                                <img src="${item.product.image}" alt="${item.product.name}" 
                                    class="w-20 h-20 object-contain rounded-lg">
                                <div class="flex-1 ml-4">
                                    <h3 class="font-semibold">${item.product.name}</h3>
                                    <div class="text-purple-600 font-bold">₹${item.product.price}</div>
                                    <div class="flex items-center mt-2">
                                        <button onclick="updateCartQuantity(${item.product.id}, ${item.quantity - 1})"
                                            class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <span class="mx-4">${item.quantity}</span>
                                        <button onclick="updateCartQuantity(${item.product.id}, ${item.quantity + 1})"
                                            class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <button onclick="removeFromCart(${item.product.id})" 
                                    class="ml-4 text-red-500">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="bg-white p-4 rounded-xl shadow-sm mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-500">Subtotal</span>
                            <span>₹${total}</span>
                        </div>
                        <div class="flex justify-between mb-4">
                            <span class="text-gray-500">Shipping</span>
                            <span>Free</span>
                        </div>
                        <div class="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹${total}</span>
                        </div>
                    </div>

                    <button onclick="checkout()" 
                        class="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                        Proceed to Checkout
                    </button>
                `}
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
}

function renderProfile() {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }
    
    const user = USERS[currentUser.email];
    if (!user.profilePic) user.profilePic = null;
    
    const mainContent = document.getElementById('main-content');
    
    const orderCount = USERS[currentUser.email].orders?.length || 0;
    const wishlistCount = USERS[currentUser.email].wishlist?.length || 0;
    const cartCount = cart.length;
    
    let html = `
        ${renderHeader()}
        <div class="pt-16 pb-24 min-h-screen relative bg-gray-50">
            <!-- Profile Header - Reduced height -->
            <div class="sticky top-16 z-40 bg-white shadow-sm">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 pt-4 pb-8 relative overflow-hidden animate-gradient">
                    <div class="absolute inset-0 bg-grid-white/10 animate-pulse"></div>
                    <div class="relative z-10">
                        <div class="flex items-center">
                            <div class="relative group animate-fade-in">
                                <div onclick="showProfilePictureModal()" 
                                    class="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl text-white border-2 border-white/20 overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-110 hover:border-white/40">
                                    ${user.profilePic ? 
                                        `<img src="${user.profilePic}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">` :
                                        `<i class="fas fa-user transform transition-transform duration-300 group-hover:scale-110"></i>`
                                    }
                                </div>
                                <button onclick="showProfilePictureModal()" 
                                    class="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <i class="fas fa-camera text-xs"></i>
                                </button>
                            </div>
                            <div class="ml-4 animate-slide-in">
                                <h2 class="text-xl font-bold text-white flex items-center">
                                    ${user.name}
                                    ${user.verified ? 
                                        `<i class="fas fa-check-circle text-blue-300 ml-2" title="Verified Account"></i>` : 
                                        ''
                                    }
                                </h2>
                                <p class="text-white/80 text-sm">${currentUser.email}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Menu Sections -->
            <div class="px-4 mt-4">
                <div class="space-y-4">
                    <!-- Orders & Shopping Section -->
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="p-4 border-b">
                            <h3 class="font-semibold text-gray-700">Orders & Shopping</h3>
                        </div>
                        <div class="divide-y">
                            ${renderMenuItem('orders', 'My Orders', 'box', 'blue', orderCount)}
                            ${renderMenuItem('wishlist', 'Wishlist', 'heart', 'red', wishlistCount)}
                            ${renderMenuItem('cart', 'Cart', 'shopping-cart', 'green', cartCount)}
                        </div>
                    </div>

                    <!-- Account Settings -->
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="p-4 border-b">
                            <h3 class="font-semibold text-gray-700">Account Settings</h3>
                        </div>
                        <div class="divide-y">
                            ${renderMenuItem('profile-edit', 'Edit Profile', 'user-edit', 'purple')}
                            ${renderMenuItem('addresses', 'Manage Addresses', 'map-marker-alt', 'green')}
                            ${renderMenuItem('password', 'Change Password', 'lock', 'blue')}
                        </div>
                    </div>





                    <!-- Help & Support -->
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="p-4 border-b">
                            <h3 class="font-semibold text-gray-700">Help & Support</h3>
                        </div>
                        <div class="divide-y">
                            ${renderMenuItem('help', 'Help Center', 'question-circle', 'blue')}
                            ${renderMenuItem('privacy', 'Privacy Policy', 'shield-alt', 'green')}
                            ${renderMenuItem('terms', 'Terms & Conditions', 'file-alt', 'gray')}
                            ${renderMenuItem('about', 'About Us', 'info-circle', 'purple')}
                        </div>
                    </div>

                    <!-- Logout Button -->
                    <button onclick="confirmLogout()" 
                        class="w-full p-4 flex items-center justify-center bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                        <i class="fas fa-sign-out-alt mr-2"></i>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = html;
}

// Helper function to render menu items
function renderMenuItem(id, title, icon, color, count = null) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        red: 'bg-red-100 text-red-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        purple: 'bg-purple-100 text-purple-600',
        gray: 'bg-gray-100 text-gray-600'
    };

    return `
        <button onclick="handleMenuClick('${id}')" 
            class="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div class="flex items-center">
                <div class="w-10 h-10 ${colors[color]} rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-${icon}"></i>
                </div>
                <span class="font-medium text-gray-700">${title}</span>
            </div>
            <div class="flex items-center">
                ${count !== null ? `
                    <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm mr-2">
                        ${count}
                    </span>
                ` : ''}
                <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
        </button>
    `;
}

// Cart Helper Functions
function getCartWithDetails() {
    return cart.map(item => {
        const product = findProductById(item.productId);
        if (!product) return null;
        return {
            product,
            quantity: item.quantity
        };
    }).filter(item => item !== null); // Remove null items
}

function findProductById(productId) {
    return Object.values(PRODUCTS)
        .flat()
        .find(p => p.id === productId);
}

function calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => {
        if (item && item.product && item.product.price) {
            return total + (item.product.price * item.quantity);
        }
        return total;
    }, 0);
}

function addToCart(productId) {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }

    const product = findProductById(productId);
    if (!product.available) {
        showToast('Product is out of stock');
        return;
    }

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Added to cart');
    updateCartBadge();
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showToast('Removed from cart');
}

function checkout() {
    const cartItems = getCartWithDetails();
    const total = calculateTotal(cartItems);
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="p-4">
            <div class="flex items-center mb-6">
                <button onclick="navigateTo('cart')" class="mr-4">
                    <i class="fas fa-arrow-left text-xl"></i>
                </button>
                <h2 class="text-2xl font-bold">Checkout</h2>
            </div>

            <div class="space-y-6">
                <!-- Delivery Address -->
                <div class="bg-white p-4 rounded-xl shadow-sm">
                    <h3 class="font-semibold mb-4">Delivery Address</h3>
                    <form id="addressForm" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2">Full Name</label>
                            <input type="text" name="name" required value="${currentUser?.name || ''}"
                                class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" name="phone" required
                                class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2">Address</label>
                            <textarea name="address" required rows="3"
                                class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"></textarea>
                        </div>
                    </form>
                </div>

                <!-- Order Summary -->
                <div class="bg-white p-4 rounded-xl shadow-sm">
                    <h3 class="font-semibold mb-4">Order Summary</h3>
                    <div class="space-y-2 mb-4">
                        ${cartItems.map(item => `
                            <div class="flex justify-between">
                                <span>${item.product.name} × ${item.quantity}</span>
                                <span>₹${item.product.price * item.quantity}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="border-t pt-4">
                        <div class="flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹${total}</span>
                        </div>
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="bg-white p-4 rounded-xl shadow-sm">
                    <h3 class="font-semibold mb-4">Payment Method</h3>
                    <div class="space-y-2">
                        <label class="flex items-center p-3 border rounded-lg">
                            <input type="radio" name="payment" value="cod" checked class="mr-3">
                            <span>Cash on Delivery</span>
                        </label>
                    </div>
                </div>

                <button onclick="placeOrder()" 
                    class="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition">
                    Place Order
                </button>
            </div>
        </div>
    `;
}

function placeOrder() {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }

    const addressForm = document.getElementById('addressForm');
    if (!addressForm.checkValidity()) {
        showToast('Please fill in all required fields');
        return;
    }

    // Show loading overlay
    showLoadingOverlay();
    
    // Process order directly without OTP
    setTimeout(() => {
        processOrder();
    }, 1500);
}

function processOrder() {
    const addressForm = document.getElementById('addressForm');
    const formData = new FormData(addressForm);
    const addressData = Object.fromEntries(formData);

    const order = {
        id: 'ORD' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        items: cart,
        total: calculateTotal(getCartWithDetails()),
        address: addressData,
        status: 'confirmed'
    };

    // Add order to user's orders
    const user = USERS[currentUser.email];
    if (!user.orders) user.orders = [];
    user.orders.unshift(order);
    saveUsers();

    // Clear cart
    cart = [];
    localStorage.removeItem('cart');

    // Remove loading overlay and show success
    const overlay = document.querySelector('.fixed.inset-0');
    if (overlay) overlay.remove();
    
    showThankYouPage(order);
}

function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    overlay.innerHTML = `
        <div class="bg-white rounded-xl p-8 flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p class="text-gray-600">Processing your order...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function showThankYouPage(order) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="p-4 text-center">
            <div class="mb-6">
                <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check-circle text-4xl text-green-500"></i>
                </div>
                <h2 class="text-2xl font-bold mb-2">Thank You!</h2>
                <p class="text-gray-500">Your order has been placed successfully</p>
            </div>

            <div class="bg-white p-4 rounded-xl shadow-sm mb-6">
                <div class="text-left">
                    <div class="mb-2">
                        <span class="font-semibold">Order ID:</span>
                        <span>${order.id}</span>
                    </div>
                    <div class="mb-2">
                        <span class="font-semibold">Total Amount:</span>
                        <span>₹${order.total}</span>
                    </div>
                    <div>
                        <span class="font-semibold">Delivery Address:</span>
                        <p class="text-gray-500">${order.address.name}<br>${order.address.address}</p>
                    </div>
                </div>
            </div>

            <button onclick="navigateTo('home')" 
                class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                Continue Shopping
            </button>
        </div>
    `;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        cart = [];
        navigateTo('home');
        showToast('Logged out successfully');
    }
}

// Add carousel control functions
let currentSlide = 0;

function nextSlide() {
    const carousel = document.getElementById('carousel');
    currentSlide = (currentSlide + 1) % CAROUSEL_ITEMS.length;
    updateCarousel();
}

function prevSlide() {
    const carousel = document.getElementById('carousel');
    currentSlide = (currentSlide - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length;
    updateCarousel();
}

function updateCarousel() {
    const carousel = document.getElementById('carousel');
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Add authentication functions
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 w-11/12 max-w-md transform animate-slideUp relative">
            <!-- Add close button -->
            <button onclick="closeModal()" 
                class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full 
                text-gray-500 hover:bg-gray-100 transition-colors">
                <i class="fas fa-times text-lg"></i>
                </button>

            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p class="text-gray-600">Sign in to continue shopping</p>
            </div>
            
            <form onsubmit="handleLogin(event)" class="space-y-6">
                <div class="space-y-4">
                    <div class="relative group">
                    <input type="email" name="email" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none 
                            transition-all duration-300 bg-gray-50 group-hover:bg-white"
                            placeholder="Email address">
                        <i class="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                            group-hover:text-blue-500 transition-colors"></i>
                </div>

                    <div class="relative group">
                    <input type="password" name="password" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none 
                            transition-all duration-300 bg-gray-50 group-hover:bg-white"
                            placeholder="Password">
                        <i class="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                            group-hover:text-blue-500 transition-colors"></i>
                </div>
                </div>

                <button type="submit" 
                    class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 
                    transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                    hover:shadow-lg">
                    Sign In
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-gray-600 mb-4">Or continue with</p>
                <div class="flex justify-center gap-4">
                    <button class="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors 
                        transform hover:scale-110 active:scale-95">
                        <i class="fab fa-google text-red-500"></i>
                    </button>
                    <button class="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors 
                        transform hover:scale-110 active:scale-95">
                        <i class="fab fa-facebook text-blue-600"></i>
                    </button>
                    <button class="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors 
                        transform hover:scale-110 active:scale-95">
                        <i class="fab fa-apple text-gray-800"></i>
                    </button>
                </div>
            </div>

            <div class="mt-6 text-center">
                <button onclick="showSignupModal()" 
                    class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">
                    Don't have an account? Sign up
                </button>
            </div>
        </div>
    `;

    // Add animation styles
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .animate-fadeIn {
                animation: fadeIn 0.3s ease-out;
            }
            .animate-slideUp {
                animation: slideUp 0.4s ease-out;
            }
        </style>
    `);

    document.body.appendChild(modal);
}

function showSignupModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl p-6 w-11/12 max-w-md transform animate-slideUp relative">
            <!-- Add close button -->
            <button onclick="closeModal()" 
                class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full 
                text-gray-500 hover:bg-gray-100 transition-colors">
                <i class="fas fa-times text-lg"></i>
                </button>

            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p class="text-gray-600">Join us and start shopping</p>
            </div>
            
            <form onsubmit="handleSignup(event)" class="space-y-6">
                <div class="space-y-4">
                    <div class="relative group">
                    <input type="text" name="name" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none 
                            transition-all duration-300 bg-gray-50 group-hover:bg-white"
                            placeholder="Full name">
                        <i class="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                            group-hover:text-blue-500 transition-colors"></i>
                </div>

                    <div class="relative group">
                    <input type="email" name="email" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none 
                            transition-all duration-300 bg-gray-50 group-hover:bg-white"
                            placeholder="Email address">
                        <i class="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                            group-hover:text-blue-500 transition-colors"></i>
                </div>

                    <div class="relative group">
                    <input type="password" name="password" required minlength="6"
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none 
                            transition-all duration-300 bg-gray-50 group-hover:bg-white"
                            placeholder="Password (min. 6 characters)">
                        <i class="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                            group-hover:text-blue-500 transition-colors"></i>
                </div>

                    <div class="relative group">
                    <input type="password" name="confirmPassword" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none 
                            transition-all duration-300 bg-gray-50 group-hover:bg-white"
                            placeholder="Confirm password">
                        <i class="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                            group-hover:text-blue-500 transition-colors"></i>
                </div>
                </div>

                <button type="submit" 
                    class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 
                    transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                    hover:shadow-lg">
                    Create Account
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-gray-600 mb-4">Or sign up with</p>
                <div class="flex justify-center gap-4">
                    <button class="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors 
                        transform hover:scale-110 active:scale-95">
                        <i class="fab fa-google text-red-500"></i>
                    </button>
                    <button class="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors 
                        transform hover:scale-110 active:scale-95">
                        <i class="fab fa-facebook text-blue-600"></i>
                    </button>
                    <button class="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors 
                        transform hover:scale-110 active:scale-95">
                        <i class="fab fa-apple text-gray-800"></i>
                    </button>
                </div>
            </div>

            <div class="mt-6 text-center">
                <button onclick="showLoginModal()" 
                    class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">
                    Already have an account? Sign in
                </button>
            </div>
        </div>
    `;

    closeModal();
    document.body.appendChild(modal);
}

function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
        showToast('Passwords do not match');
        return;
    }
    
    // Check if email already exists
    if (USERS[data.email]) {
        showToast('Email already registered');
        return;
    }
    
    // Create new user
    USERS[data.email] = {
        name: data.name,
        password: hashPassword(data.password),
        orders: []
    };
    
    // Save users to localStorage
    saveUsers();
    
    // Auto login after signup
    currentUser = {
        email: data.email,
        name: data.name
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal();
    showToast('Account created successfully');
    renderPage();
}

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    const user = USERS[data.email];
    
    if (!user || user.password !== hashPassword(data.password)) {
        showToast('Invalid email or password');
        return;
    }
    
    currentUser = {
        email: data.email,
        name: user.name
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal();
    showToast('Logged in successfully');
    renderPage();
}

function closeModal() {
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => {
        modal.classList.add('animate-fadeOut');
        modal.querySelector('.bg-white').classList.add('animate-slideDown');
        setTimeout(() => modal.remove(), 300);
    });
}

// Simple password hashing (DO NOT use in production)
function hashPassword(password) {
    return btoa(password); // In real app, use proper password hashing
}

// Add these helper functions for profile management
function showEditProfileModal() {
    const user = USERS[currentUser.email];
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Edit Profile</h2>
                <button onclick="closeModal()" class="text-gray-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form onsubmit="handleEditProfile(event)" class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-2">Full Name</label>
                    <input type="text" name="name" required value="${user.name}"
                        class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                </div>
                <button type="submit" 
                    class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                    Save Changes
                </button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleEditProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Update user data
    USERS[currentUser.email].name = data.name;
    currentUser.name = data.name;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal();
    showToast('Profile updated successfully');
    renderProfile();
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add these functions at the top of app.js
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(USERS));
}

function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        Object.assign(USERS, JSON.parse(savedUsers));
    }
}

// Add this function
function isLoggedIn() {
    return currentUser !== null;
}

function ensureUserData() {
    if (!USERS[currentUser.email]) {
        USERS[currentUser.email] = {
            name: currentUser.name,
            orders: [],
            wishlist: [],
            addresses: [],
            reviews: [],
            profilePic: null
        };
        saveUsers();
    }
    // Initialize arrays if they don't exist
    const user = USERS[currentUser.email];
    if (!user.orders) user.orders = [];
    if (!user.wishlist) user.wishlist = [];
    if (!user.addresses) user.addresses = [];
    if (!user.reviews) user.reviews = [];
    if (typeof user.profilePic === 'undefined') user.profilePic = null;
    saveUsers();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadUsers();
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            ensureUserData();
        }
        // Apply theme before rendering
        applyTheme();
        renderPage();
        updateCartBadge();
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error loading application', 'error');
    }
});

// Add these new carousel control functions
let currentFeaturedSlide = 0;

function initializeCarousels() {
    // Clear any existing intervals
    if (window.carouselIntervals) {
        window.carouselIntervals.forEach(clearInterval);
    }
    window.carouselIntervals = [];

    // Start featured carousel auto-play
    window.carouselIntervals.push(setInterval(nextFeaturedSlide, 4000));
}

function nextFeaturedSlide() {
    const carousel = document.getElementById('featured-carousel');
    if (!carousel) return;
    currentFeaturedSlide = (currentFeaturedSlide + 1) % 3;
    updateFeaturedCarousel();
}

function prevFeaturedSlide() {
    const carousel = document.getElementById('featured-carousel');
    if (!carousel) return;
    currentFeaturedSlide = (currentFeaturedSlide - 1 + 3) % 3;
    updateFeaturedCarousel();
}

function goToFeaturedSlide(index) {
    currentFeaturedSlide = index;
    updateFeaturedCarousel();
}

function updateFeaturedCarousel() {
    const carousel = document.getElementById('featured-carousel');
    if (!carousel) return;
    carousel.style.transform = `translateX(-${currentFeaturedSlide * 100}%)`;
    updateFeaturedIndicators();
}

function updateFeaturedIndicators() {
    const indicators = document.querySelectorAll('.featured-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentFeaturedSlide) {
            indicator.classList.add('bg-white');
            indicator.classList.remove('bg-white/50');
        } else {
            indicator.classList.remove('bg-white');
            indicator.classList.add('bg-white/50');
        }
    });
}

function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Change Password</h2>
                <button onclick="closeModal()" class="text-gray-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form onsubmit="handleChangePassword(event)" class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-2">Current Password</label>
                    <input type="password" name="currentPassword" required
                        class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">New Password</label>
                    <input type="password" name="newPassword" required minlength="6"
                        class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Confirm New Password</label>
                    <input type="password" name="confirmPassword" required
                        class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500">
                </div>
                <button type="submit" 
                    class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
                    Update Password
                </button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleChangePassword(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    const user = USERS[currentUser.email];
    
    if (hashPassword(data.currentPassword) !== user.password) {
        showToast('Current password is incorrect');
        return;
    }
    
    if (data.newPassword !== data.confirmPassword) {
        showToast('New passwords do not match');
        return;
    }
    
    // Update password
    user.password = hashPassword(data.newPassword);
    saveUsers();
    
    closeModal();
    showToast('Password updated successfully');
}

// Add new functions for handling addresses

// Add new functions for settings
function showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-11/12 max-w-md">
            <div class="p-4 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">Settings</h2>
                    <button onclick="closeModal()" class="text-gray-500">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-4 space-y-4">
                <!-- Add other settings here if needed -->
                <div class="text-center text-gray-500">
                    App settings and preferences
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Add these functions to handle wishlist
function addToWishlist(productId) {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }
    
    const user = USERS[currentUser.email];
    if (!user.wishlist) user.wishlist = [];
    
    if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        saveUsers();
        showToast('Added to wishlist');
    } else {
        user.wishlist = user.wishlist.filter(id => id !== productId);
        saveUsers();
        showToast('Removed from wishlist');
    }
    
    renderPage();
}

// Update product rendering to include wishlist button
function renderProduct(product) {
    return `
        <div onclick="showProductDetails(${product.id})" 
            class="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" 
                    class="w-full h-40 object-cover rounded-lg mb-3">
                ${product.available ? 
                    `<span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        In Stock
                    </span>` : 
                    `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Out of Stock
                    </span>`
                }
            </div>
            <h3 class="font-semibold mb-1">${product.name}</h3>
            <div class="flex justify-between items-center">
                <div class="font-bold text-lg">₹${product.price}/${product.unit}</div>
                <div class="text-sm text-yellow-500">
                    <i class="fas fa-star"></i> ${product.rating}
                </div>
            </div>
        </div>
    `;
}

// Add this new function to show product details
function showProductDetails(productId) {
    const product = findProductById(productId);
    if (!product) return;

    const recommendedProducts = getRecommendedProducts(product);
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        ${renderHeader()}
        <div class="pt-16 pb-24 bg-gray-50 min-h-screen">
            <!-- Back button and title -->
            <div class="sticky top-16 z-30 bg-white shadow-sm">
                <div class="p-4 flex items-center">
                    <button onclick="navigateTo('home')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h1 class="text-xl font-bold">Product Details</h1>
                </div>
            </div>

            <!-- Product Image -->
            <div class="bg-white p-4">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" 
                        class="w-full h-64 object-contain rounded-lg">
                    <button onclick="addToWishlist(${product.id})" 
                        class="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <i class="fas fa-heart ${USERS[currentUser?.email]?.wishlist?.includes(product.id) ? 'text-red-500' : 'text-gray-400'}"></i>
                    </button>
                </div>
            </div>

            <!-- Product Info -->
            <div class="bg-white mt-2 p-4">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-2xl font-bold">${product.name}</h2>
                        <div class="flex items-center mt-1">
                            <div class="flex text-yellow-400">
                                ${Array(5).fill('').map((_, i) => `
                                    <i class="fas fa-star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}"></i>
                                `).join('')}
                            </div>
                            <span class="ml-2 text-gray-600">${product.rating} (${generateRandomReviewCount()} reviews)</span>
                        </div>
                    </div>
                    <div class="text-2xl font-bold text-blue-600">₹${product.price}</div>
                </div>

                <!-- Availability -->
                <div class="mb-4">
                    <span class="px-3 py-1 rounded-full text-sm ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                        ${product.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                <!-- Description -->
                <div class="mb-6">
                    <h3 class="font-semibold mb-2">Description</h3>
                    <p class="text-gray-600">${product.description}</p>
                </div>

                <!-- Specifications -->
                ${product.specs ? `
                    <div class="mb-6">
                        <h3 class="font-semibold mb-2">Specifications</h3>
                        <ul class="space-y-2">
                            ${product.specs.map(spec => `
                                <li class="flex items-center text-gray-600">
                                    <i class="fas fa-check text-green-500 mr-2"></i>
                                    ${spec}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}

                <!-- Reviews Section -->
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-semibold">Customer Reviews</h3>
                        <button onclick="showAllReviews(${product.id})" class="text-blue-600">
                            View all
                        </button>
                    </div>
                    <div class="space-y-4">
                        ${generateMockReviews(3).map(review => `
                            <div class="border-b pb-4">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center">
                                        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                            <i class="fas fa-user text-gray-500"></i>
                                        </div>
                                        <div class="ml-2">
                                            <div class="font-semibold">${review.name}</div>
                                            <div class="flex text-yellow-400">
                                                ${Array(5).fill('').map((_, i) => `
                                                    <i class="fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}"></i>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-sm text-gray-500">${review.date}</div>
                                </div>
                                <p class="text-gray-600">${review.comment}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Add to Cart Section -->
                <div class="flex items-center justify-between mt-6 mb-4">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center border rounded-lg">
                            <button onclick="updateQuantity('decrease')" 
                                class="px-4 py-2 text-gray-600 hover:bg-gray-100">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span id="quantity" class="px-4 py-2 border-x">1</span>
                            <button onclick="updateQuantity('increase')" 
                                class="px-4 py-2 text-gray-600 hover:bg-gray-100">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button onclick="addToCartFromDetails(${product.id})" 
                        class="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                        Add to Cart
                    </button>
                    <button onclick="buyNow(${product.id})" 
                        class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        Buy Now
                    </button>
                </div>

                <!-- Add Review Button -->
                <div class="mt-6">
                    <button onclick="showAddReviewModal(${product.id})" 
                        class="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center">
                        <i class="fas fa-star text-yellow-400 mr-2"></i>
                        Write a Review
                    </button>
                </div>
            </div>

            <!-- Recommendations Section -->
            <div class="bg-white mt-2 p-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">You May Also Like</h3>
                    <button onclick="showAllProducts('${product.category}')" class="text-blue-600 text-sm">
                        View All
                    </button>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    ${recommendedProducts.map(recProduct => `
                        <div onclick="showProductDetails(${recProduct.id})" 
                            class="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                            <div class="relative">
                                <img src="${recProduct.image}" alt="${recProduct.name}" 
                                    class="w-full h-32 object-cover rounded-lg mb-2">
                                ${recProduct.onlinePrice ? 
                                    `<span class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                        Online Only
                                    </span>` : ''
                                }
                            </div>
                            <h4 class="font-medium text-sm mb-1 truncate">${recProduct.name}</h4>
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-bold text-blue-600">₹${recProduct.onlinePrice || recProduct.price}</div>
                                    ${recProduct.onlinePrice ? 
                                        `<div class="text-xs text-gray-500 line-through">₹${recProduct.price}</div>` : ''
                                    }
                                </div>
                                <div class="flex items-center text-sm">
                                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                                    ${recProduct.rating}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Frequently Bought Together -->
            ${product.category !== 'combos' ? `
                <div class="bg-white mt-2 p-4">
                    <h3 class="text-lg font-semibold mb-4">Frequently Bought Together</h3>
                    <div class="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                        <div class="flex-shrink-0 w-24">
                            <img src="${product.image}" alt="${product.name}" 
                                class="w-full h-24 object-cover rounded-lg mb-2">
                            <div class="text-sm font-medium truncate">${product.name}</div>
                            <div class="text-sm text-blue-600">₹${product.price}</div>
                        </div>
                        <div class="flex-shrink-0 flex items-center">
                            <i class="fas fa-plus text-gray-400"></i>
                        </div>
                        ${getComplementaryProducts(product, 2).map(comp => `
                            <div class="flex-shrink-0 w-24">
                                <img src="${comp.image}" alt="${comp.name}" 
                                    class="w-full h-24 object-cover rounded-lg mb-2">
                                <div class="text-sm font-medium truncate">${comp.name}</div>
                                <div class="text-sm text-blue-600">₹${comp.price}</div>
                            </div>
                        `).join('')}
                        <button onclick="addBundleToCart([${[product.id, ...getComplementaryProducts(product, 2).map(p => p.id)]}])"
                            class="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                            Add Bundle
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Helper function to generate random review count
function generateRandomReviewCount() {
    return Math.floor(Math.random() * 900) + 100;
}

// Function to show all reviews
function showAllReviews(productId) {
    const product = findProductById(productId);
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-11/12 max-w-md max-h-[80vh] overflow-hidden">
            <div class="p-4 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">All Reviews</h2>
                    <button onclick="closeModal()" class="text-gray-500">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div class="space-y-4">
                    ${generateMockReviews(10).map(review => `
                        <div class="border-b pb-4">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <i class="fas fa-user text-gray-500"></i>
                                    </div>
                                    <div class="ml-2">
                                        <div class="font-semibold">${review.name}</div>
                                        <div class="flex text-yellow-400">
                                            ${Array(5).fill('').map((_, i) => `
                                                <i class="fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}"></i>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-500">${review.date}</div>
                            </div>
                            <p class="text-gray-600">${review.comment}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function renderOrders() {
    const mainContent = document.getElementById('main-content');
    
    let html = `
        ${renderHeader()}
        <div class="pt-16 pb-24">
            <div class="p-4">
                <div class="flex items-center mb-6">
                    <button onclick="navigateTo('profile')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h2 class="text-2xl font-bold">My Orders</h2>
                </div>

                ${USERS[currentUser.email].orders?.length === 0 ? `
                    <div class="text-center py-8">
                        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-box text-4xl text-gray-400"></i>
                        </div>
                        <p class="text-gray-500">No orders yet</p>
                        <button onclick="navigateTo('home')" 
                            class="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                            Start Shopping
                        </button>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${USERS[currentUser.email].orders.map(order => `
                            <div class="bg-white p-4 rounded-xl shadow-sm">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-semibold">#${order.id}</span>
                                    <span class="text-sm text-gray-500">${order.date}</span>
                                </div>
                                <div class="border-t pt-2">
                                    <div class="text-sm text-gray-500 mb-2">
                                        ${order.items.length} items • Total: ₹${order.total}
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="inline-block px-2 py-1 bg-green-100 text-green-600 rounded text-sm">
                                            ${order.status}
                                        </span>
                                        <button onclick="showOrderDetails('${order.id}')" 
                                            class="text-purple-600 text-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
}

function renderWishlist() {
    const mainContent = document.getElementById('main-content');
    
    let html = `
        ${renderHeader()}
        <div class="pt-16 pb-24">
            <div class="p-4">
                <div class="flex items-center mb-6">
                    <button onclick="navigateTo('profile')" class="mr-4">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h2 class="text-2xl font-bold">My Wishlist</h2>
                </div>

                ${USERS[currentUser.email]?.wishlist?.length === 0 ? `
                    <div class="text-center py-8">
                        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-heart text-4xl text-gray-400"></i>
                        </div>
                        <p class="text-gray-500">Your wishlist is empty</p>
                        <button onclick="navigateTo('home')" 
                            class="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                            Start Shopping
                        </button>
                    </div>
                ` : `
                    <div class="grid grid-cols-2 gap-4">
                        ${USERS[currentUser.email].wishlist.map(id => findProductById(id)).filter(Boolean).map(product => renderProduct(product)).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    
    mainContent.innerHTML = html;
}

function showAddAddressModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Add New Address</h2>
                <button onclick="closeModal()" class="text-gray-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form onsubmit="handleAddAddress(event)" class="space-y-4">
                <div>
                    <label class="block text-gray-700 mb-2">Full Name</label>
                    <input type="text" name="name" required
                        class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" name="phone" required
                        class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500">
                </div>
                <div>
                    <label class="block text-gray-700 mb-2">Address</label>
                    <textarea name="address" required rows="3"
                        class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500"></textarea>
                </div>
                <button type="submit" 
                    class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                    Save Address
                </button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleAddAddress(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    const user = USERS[currentUser.email];
    if (!user.addresses) user.addresses = [];
    
    user.addresses.push(data);
    saveUsers();
    
    closeModal();
    showToast('Address added successfully');
    renderProfile();
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        const user = USERS[currentUser.email];
        user.addresses.splice(index, 1);
        saveUsers();
        showToast('Address deleted');
        showAddressesModal(); // Refresh the modal
    }
}

function toggle2FA(checkbox) {
    if (checkbox.checked) {
        // In a real app, this would trigger 2FA setup
        showToast('2FA setup would be initiated here');
    } else {
        showToast('2FA would be disabled here');
    }
}

function showOrderDetails(orderId) {
    const user = USERS[currentUser.email];
    const order = user.orders.find(o => o.id === orderId);
    
    if (!order) {
        showToast('Order not found');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-11/12 max-w-md max-h-[80vh] overflow-hidden">
            <div class="p-4 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">Order Details</h2>
                    <button onclick="closeModal()" class="text-gray-500">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-4 overflow-y-auto">
                <div class="mb-4">
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Order ID:</span>
                        <span>#${order.id}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Date:</span>
                        <span>${order.date}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Status:</span>
                        <span class="px-2 py-1 bg-green-100 text-green-600 rounded">
                            ${order.status}
                        </span>
                    </div>
                </div>
                
                <div class="border-t pt-4 mb-4">
                    <h3 class="font-semibold mb-2">Items</h3>
                    ${order.items.map(item => {
                        const product = findProductById(item.productId);
                        return `
                            <div class="flex justify-between items-center mb-2">
                                <span>${product.name} × ${item.quantity}</span>
                                <span>₹${product.price * item.quantity}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="border-t pt-4">
                    <h3 class="font-semibold mb-2">Delivery Address</h3>
                    <p class="text-gray-600">
                        ${order.address.name}<br>
                        ${order.address.phone}<br>
                        ${order.address.address}
                    </p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Add this function to update cart badge
function updateCartBadge() {
    const cartButton = document.querySelector('button[data-page="cart"]');
    if (cartButton) {
        const badge = cartButton.querySelector('.cart-badge') || document.createElement('div');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (count > 0) {
            badge.className = 'cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-lg';
            badge.textContent = count;
            
            if (!cartButton.querySelector('.cart-badge')) {
                cartButton.style.position = 'relative';
                cartButton.appendChild(badge);
                // Add pop-in animation
                badge.animate([
                    { transform: 'scale(0)' },
                    { transform: 'scale(1.2)' },
                    { transform: 'scale(1)' }
                ], {
                    duration: 300,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });
            }
        } else if (badge.parentNode) {
            // Add pop-out animation before removing
            badge.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(0)' }
            ], {
                duration: 200,
                easing: 'ease-out'
            }).onfinish = () => badge.remove();
        }
    }
}

function showProfilePictureModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Update Profile Picture</h2>
                <button onclick="closeModal()" class="text-gray-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div class="flex justify-center">
                    <div class="relative">
                        <div id="preview" class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            ${USERS[currentUser.email].profilePic ? 
                                `<img src="${USERS[currentUser.email].profilePic}" class="w-full h-full object-cover">` :
                                `<i class="fas fa-user text-4xl text-gray-400"></i>`
                            }
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <input type="file" id="profilePicInput" accept="image/*" class="hidden" onchange="handleProfilePicChange(event)">
                    <button onclick="document.getElementById('profilePicInput').click()" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Choose Photo
                    </button>
                </div>
                <div class="text-center text-sm text-gray-500">
                    Supported formats: JPG, PNG, GIF<br>
                    Max size: 5MB
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleProfilePicChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showToast('File size should be less than 5MB', 'error');
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // Update preview
        const preview = document.getElementById('preview');
        preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;

        // Save to user data
        USERS[currentUser.email].profilePic = e.target.result;
        saveUsers();
        
        // Close modal after short delay
        setTimeout(() => {
            closeModal();
            showToast('Profile picture updated successfully');
            renderProfile();
            // Update header to show new profile pic
            const header = document.querySelector('header');
            if (header) {
                header.innerHTML = renderHeader();
            }
        }, 500);
    };
    reader.readAsDataURL(file);
}

// Add this function to handle theme toggle
function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    applyTheme();
    showToast(isDarkMode ? 'Dark mode enabled' : 'Light mode enabled');
}

// Add this function to apply theme
function applyTheme() {
    document.body.classList.toggle('dark', isDarkMode);
    
    // Update footer colors
    const footer = document.querySelector('nav');
    if (footer) {
        if (isDarkMode) {
            footer.classList.remove('bg-gradient-to-t', 'from-gray-100', 'to-white', 'border-gray-200');
            footer.classList.add('bg-gradient-to-t', 'from-gray-900', 'to-gray-800', 'border-gray-700');
        } else {
            footer.classList.remove('bg-gradient-to-t', 'from-gray-900', 'to-gray-800', 'border-gray-700');
            footer.classList.add('bg-gradient-to-t', 'from-gray-100', 'to-white', 'border-gray-200');
        }
    }
}

function showOTPModal(email) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 w-11/12 max-w-md relative">
            <!-- Added close button -->
            <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
            
            <h2 class="text-xl font-bold mb-4">Verify OTP</h2>
            <p class="text-gray-600 mb-4">Please enter the OTP sent to ${email}</p>
            <div class="flex gap-2 mb-4">
                <input type="text" maxlength="1" class="w-12 h-12 border rounded-lg text-center text-xl" oninput="moveToNext(this, 0)">
                <input type="text" maxlength="1" class="w-12 h-12 border rounded-lg text-center text-xl" oninput="moveToNext(this, 1)">
                <input type="text" maxlength="1" class="w-12 h-12 border rounded-lg text-center text-xl" oninput="moveToNext(this, 2)">
                <input type="text" maxlength="1" class="w-12 h-12 border rounded-lg text-center text-xl" oninput="moveToNext(this, 3)">
            </div>
            <button onclick="verifyOTP()" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Verify OTP
            </button>
            <div class="text-center mt-4">
                <button onclick="resendOTP()" class="text-blue-600 hover:underline">Resend OTP</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleMenuClick(id) {
    switch(id) {
        case 'orders':
            navigateTo('orders');
            break;
        case 'wishlist':
            navigateTo('wishlist');
            break;
        case 'cart':
            navigateTo('cart');
            break;
        case 'reviews':
            showAllUserReviews();
            break;
        case 'profile-edit':
            showEditProfileModal();
            break;
        case 'addresses':
            showAddressesModal();
            break;
        case 'password':
            showChangePasswordModal();
            break;
        case 'notifications':
            showSettingsModal();
            break;
        case 'help':
            showToast('Help Center coming soon');
            break;
        case 'privacy':
            showToast('Privacy Policy coming soon');
            break;
        case 'terms':
            showToast('Terms & Conditions coming soon');
            break;
        case 'about':
            showToast('About Us coming soon');
            break;
    }
}

function confirmLogout() {
    if (confirm('Are you sure you want to logout?')) {
        logout();
    }
}

// Helper function to generate mock reviews
function generateMockReviews(count) {
    const reviews = [
        {
            name: 'John D.',
            rating: 5,
            date: '2 days ago',
            comment: 'Great product! Exactly what I was looking for. The quality is amazing and delivery was fast.'
        },
        {
            name: 'Sarah M.',
            rating: 4,
            date: '1 week ago',
            comment: 'Very satisfied with my purchase. Would definitely recommend to others.'
        },
        {
            name: 'Mike R.',
            rating: 5,
            date: '3 days ago',
            comment: 'Excellent quality and great value for money. Will buy again!'
        },
        {
            name: 'Emily L.',
            rating: 4,
            date: '5 days ago',
            comment: 'Product matches the description perfectly. Fast shipping too.'
        },
        {
            name: 'David S.',
            rating: 5,
            date: '1 day ago',
            comment: 'Outstanding product and customer service. Very happy with my purchase.'
        }
    ];

    // Randomly select 'count' number of reviews
    const selectedReviews = [];
    const tempReviews = [...reviews];
    
    for (let i = 0; i < count && tempReviews.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * tempReviews.length);
        selectedReviews.push(tempReviews.splice(randomIndex, 1)[0]);
    }

    return selectedReviews;
}

// Helper function to find product by ID
function findProductById(id) {
    for (const category in PRODUCTS) {
        const product = PRODUCTS[category].find(p => p.id === id);
        if (product) return product;
    }
    return null;
}
// Add these new functions
function showAddReviewModal(productId) {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }

    const product = findProductById(productId);
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-11/12 max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Write a Review</h2>
                <button onclick="closeModal()" class="text-gray-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="mb-4">
                <h3 class="font-medium mb-2">${product.name}</h3>
                <div class="flex items-center gap-2 mb-4">
                    <div class="flex gap-1" id="ratingStars">
                        ${Array(5).fill('').map((_, i) => `
                            <button onclick="setRating(${i + 1})" class="text-gray-300 hover:text-yellow-400 transition-colors">
                                <i class="fas fa-star"></i>
                            </button>
                        `).join('')}
                    </div>
                    <span class="text-sm text-gray-500" id="ratingText">Select rating</span>
                </div>
            </div>

            <div class="mb-4">
                <textarea id="reviewComment" 
                    placeholder="Share your experience with this product..." 
                    class="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:border-blue-500"
                ></textarea>
            </div>

            <button onclick="submitReview(${productId})" 
                class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Submit Review
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('#ratingStars button');
    const ratingText = document.getElementById('ratingText');
    
    stars.forEach((star, index) => {
        star.innerHTML = `<i class="fas fa-star ${index < rating ? 'text-yellow-400' : 'text-gray-300'}"></i>`;
    });
    
    const ratingTexts = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    ratingText.textContent = ratingTexts[rating - 1];
}

function submitReview(productId) {
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (!currentRating) {
        showToast('Please select a rating');
        return;
    }
    
    if (!comment) {
        showToast('Please write a review comment');
        return;
    }

    // Add review to user's reviews
    if (!USERS[currentUser.email].reviews) {
        USERS[currentUser.email].reviews = [];
    }

    const review = {
        productId,
        rating: currentRating,
        comment,
        date: new Date().toISOString(),
        id: 'REV' + Date.now()
    };

    USERS[currentUser.email].reviews.unshift(review);
    saveUsers();

    closeModal();
    showToast('Review submitted successfully');
    showProductDetails(productId); // Refresh the product details page
}

// Add these helper functions
function updateQuantity(action) {
    const quantityElement = document.getElementById('quantity');
    let quantity = parseInt(quantityElement.textContent);
    
    if (action === 'increase') {
        quantity++;
    } else if (action === 'decrease' && quantity > 1) {
        quantity--;
    }
    
    quantityElement.textContent = quantity;
}

function addToCartFromDetails(productId) {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value || 1);
    const product = findProductById(productId);
    
    if (!product.available) {
        showToast('Product is out of stock');
        return;
    }

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Added to cart');
    updateCartBadge(); // Changed from updateCartCount to updateCartBadge
}

function buyNow(productId) {
    addToCart(productId);
    navigateTo('cart');
}

// Add this new function to show all reviews in a modal
function showAllUserReviews() {
    if (!USERS[currentUser.email].reviews || USERS[currentUser.email].reviews.length === 0) {
        showToast('No reviews yet');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-11/12 max-w-md max-h-[80vh] overflow-hidden">
            <div class="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 class="text-xl font-bold">My Reviews</h2>
                <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700 transition-colors">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="overflow-y-auto p-4 space-y-4">
                ${USERS[currentUser.email].reviews.map(review => {
                    const product = findProductById(review.productId);
                    return product ? `
                        <div class="border-b border-gray-100 pb-4 last:border-0">
                            <div class="flex items-center gap-4">
                                <img src="${product.image}" alt="${product.name}" 
                                    class="w-20 h-20 object-contain rounded-lg bg-gray-50">
                                <div class="flex-1">
                                    <h4 class="font-medium text-lg">${product.name}</h4>
                                    <div class="flex items-center gap-1 text-yellow-400 my-1">
                                        ${Array(5).fill('').map((_, i) => `
                                            <i class="fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}"></i>
                                        `).join('')}
                                    </div>
                                    <p class="text-gray-600">${review.comment}</p>
                                    <div class="text-gray-400 text-sm mt-2">
                                        ${new Date(review.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-end mt-2 gap-2">
                                <button onclick="editReview('${review.id}')" 
                                    class="text-blue-600 text-sm hover:underline">
                                    Edit
                                </button>
                                <button onclick="deleteReview('${review.id}')" 
                                    class="text-red-600 text-sm hover:underline">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ` : '';
                }).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Add these functions to handle review actions
function editReview(reviewId) {
    const review = USERS[currentUser.email].reviews.find(r => r.id === reviewId);
    if (!review) return;

    const product = findProductById(review.productId);
    if (!product) return;

    closeModal();
    showEditReviewModal(review, product);
}

function showEditReviewModal(review, product) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-11/12 max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Edit Review</h2>
                <button onclick="closeModal()" class="text-gray-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="mb-4">
                <h3 class="font-medium mb-2">${product.name}</h3>
                <div class="flex items-center gap-2 mb-4">
                    <div class="flex gap-1" id="ratingStars">
                        ${Array(5).fill('').map((_, i) => `
                            <button onclick="setRating(${i + 1})" class="text-gray-300 hover:text-yellow-400 transition-colors">
                                <i class="fas fa-star ${i < review.rating ? 'text-yellow-400' : ''}"></i>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <textarea id="reviewComment" 
                    class="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:border-blue-500"
                >${review.comment}</textarea>
            </div>

            <button onclick="updateReview('${review.id}')" 
                class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Update Review
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    currentRating = review.rating;
}

function updateReview(reviewId) {
    const comment = document.getElementById('reviewComment').value.trim();
    
    if (!currentRating) {
        showToast('Please select a rating');
        return;
    }
    
    if (!comment) {
        showToast('Please write a review comment');
        return;
    }

    const reviewIndex = USERS[currentUser.email].reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return;

    USERS[currentUser.email].reviews[reviewIndex] = {
        ...USERS[currentUser.email].reviews[reviewIndex],
        rating: currentRating,
        comment,
        edited: true,
        editDate: new Date().toISOString()
    };

    saveUsers();
    closeModal();
    showToast('Review updated successfully');
    showAllUserReviews();
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        USERS[currentUser.email].reviews = USERS[currentUser.email].reviews.filter(r => r.id !== reviewId);
        saveUsers();
        closeModal();
        showToast('Review deleted successfully');
        renderProfile();
    }
}

// Add this new function to show loading state
function showLoadingScreen() {
    const mainContent = document.getElementById('main-content');
    // Hide the footer if it exists
    const footer = document.querySelector('nav');
    if (footer) {
        footer.style.display = 'none';
    }

    mainContent.innerHTML = `
        <div class="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div class="text-center">
                <div class="relative inline-block">
                    <div class="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i class="fas fa-shopping-basket text-blue-600 text-2xl"></i>
                    </div>
                </div>
                <div class="text-xl font-semibold text-gray-700 mt-4">Loading AD-MART</div>
                <div class="text-sm text-gray-500 mt-2">Please wait while we fetch your groceries...</div>
            </div>
        </div>
    `;
}

// Update the initialization code
window.onload = function() {
    showLoadingScreen();
    
    // Simulate loading time (you can remove this in production)
    setTimeout(() => {
        isLoading = false;
        navigateTo('home');
        // Show the footer again
        const footer = document.querySelector('nav');
        if (footer) {
            footer.style.display = 'block';
        }
    }, 2000); // Show loading for 2 seconds
};

// Add this helper function to get recommended products
function getRecommendedProducts(currentProduct, limit = 4) {
    // Get products from same category first
    let recommended = Object.values(PRODUCTS)
        .flat()
        .filter(p => 
            p.id !== currentProduct.id && 
            (p.category === currentProduct.category || 
             p.specs?.some(spec => currentProduct.specs?.includes(spec)))
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);

    return recommended;
}

// Helper function to get complementary products
function getComplementaryProducts(product, limit = 2) {
    // Get products that complement the current product
    let complementary = Object.values(PRODUCTS)
        .flat()
        .filter(p => 
            p.id !== product.id && 
            p.category !== product.category &&
            p.available
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);

    return complementary;
}

// Function to add bundle to cart
function addBundleToCart(productIds) {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }

    productIds.forEach(id => {
        const existingItem = cart.find(item => item.productId === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                productId: id,
                quantity: 1
            });
        }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Bundle added to cart');
    updateCartBadge();
}

// Add this function to handle smooth category scrolling
function scrollToCategory(categoryId) {
    const categoryElement = document.querySelector(`[data-category="${categoryId}"]`);
    if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add this utility function for showing toasts
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast fixed bottom-24 left-1/2 transform -translate-x-1/2 
        ${type === 'error' ? 'bg-red-500' : 'bg-gray-800'} 
        text-white px-6 py-3 rounded-lg z-50 shadow-lg
        animate-fade-in-up`;
    
    // Add animation styles
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.3s ease-out forwards;
            }
            .animate-fade-out {
                animation: fadeOut 0.3s ease-out forwards;
            }
        </style>
    `);

    // Add content
    toast.innerHTML = `
        <div class="flex items-center">
            ${type === 'error' ? 
                '<i class="fas fa-exclamation-circle mr-2"></i>' : 
                '<i class="fas fa-check-circle mr-2"></i>'
            }
            <span>${message}</span>
        </div>
    `;

    // Add to document
    document.body.appendChild(toast);

    // Remove after delay
    setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// Optional: Add these helper functions for specific toast types
function showSuccessToast(message) {
    showToast(message, 'success');
}

function showErrorToast(message) {
    showToast(message, 'error');
}

function showInfoToast(message) {
    showToast(message, 'info');
}

function showAddressModal(existingAddress = null) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl w-11/12 max-w-md max-h-[90vh] overflow-hidden transform animate-slideUp">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-800">
                    ${existingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                    <button onclick="closeModal()" 
                        class="w-8 h-8 flex items-center justify-center rounded-full 
                        text-gray-500 hover:bg-gray-100 transition-colors">
                    <i class="fas fa-times"></i>
                </button>
                </div>
            </div>
            
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <form id="addressForm" class="space-y-4">
                    <!-- Contact Details Section -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-gray-700">Contact Details</h4>
                        
                <!-- Full Name -->
                        <div class="relative group">
                    <input type="text" 
                        id="name" 
                        value="${existingAddress?.name || ''}"
                                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                                focus:outline-none transition-all duration-300 bg-gray-50 group-hover:bg-white
                                peer placeholder-transparent"
                                placeholder="Full Name"
                        required
                    >
                            <label for="name" 
                                class="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 
                                transition-all duration-300 peer-placeholder-shown:top-3 
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                                Full Name
                            </label>
                </div>

                <!-- Phone Number -->
                        <div class="relative group">
                    <div class="flex">
                                <span class="inline-flex items-center px-4 rounded-l-xl border border-r-0 
                                    border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            +91
                        </span>
                        <input type="tel" 
                            id="phone" 
                            pattern="[0-9]{10}"
                            value="${existingAddress?.phone || ''}"
                                    class="w-full px-4 py-3 rounded-r-xl border border-gray-300 focus:border-blue-500 
                                    focus:outline-none transition-all duration-300 bg-gray-50 group-hover:bg-white
                                    peer placeholder-transparent"
                                    placeholder="Phone Number"
                            required
                            maxlength="10"
                                >
                                <label for="phone" 
                                    class="absolute left-16 -top-2.5 bg-white px-2 text-sm text-gray-600 
                                    transition-all duration-300 peer-placeholder-shown:top-3 
                                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                                    peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                                    Phone Number
                                </label>
                            </div>
                    </div>
                </div>

                    <!-- Address Details Section -->
                    <div class="space-y-4 mt-6">
                        <h4 class="font-medium text-gray-700">Address Details</h4>
                        
                        <!-- House/Flat/Block No -->
                        <div class="relative group">
                    <input type="text" 
                        id="houseNo" 
                        value="${existingAddress?.houseNo || ''}"
                                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                                focus:outline-none transition-all duration-300 bg-gray-50 group-hover:bg-white
                                peer placeholder-transparent"
                                placeholder="House/Flat/Block No."
                        required
                    >
                            <label for="houseNo" 
                                class="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 
                                transition-all duration-300 peer-placeholder-shown:top-3 
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                                House/Flat/Block No.
                            </label>
                </div>

                <!-- Street/Area -->
                        <div class="relative group">
                    <input type="text" 
                        id="street" 
                        value="${existingAddress?.street || ''}"
                                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                                focus:outline-none transition-all duration-300 bg-gray-50 group-hover:bg-white
                                peer placeholder-transparent"
                                placeholder="Street/Area/Locality"
                        required
                    >
                            <label for="street" 
                                class="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 
                                transition-all duration-300 peer-placeholder-shown:top-3 
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                                Street/Area/Locality
                            </label>
                </div>

                <!-- Village/Town -->
                        <div class="relative group">
                    <input type="text" 
                        id="village" 
                        value="${existingAddress?.village || ''}"
                                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                                focus:outline-none transition-all duration-300 bg-gray-50 group-hover:bg-white
                                peer placeholder-transparent"
                                placeholder="Village/Town"
                        required
                    >
                            <label for="village" 
                                class="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 
                                transition-all duration-300 peer-placeholder-shown:top-3 
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                                Village/Town
                    </label>
                </div>

                        <!-- State Dropdown -->
                        <div class="relative group">
                    <select id="state" 
                                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                                focus:outline-none transition-all duration-300 bg-gray-50 group-hover:bg-white
                                appearance-none"
                        required
                    >
                        <option value="">Select State</option>
                        ${getIndianStates().map(state => 
                            `<option value="${state}" ${existingAddress?.state === state ? 'selected' : ''}>
                                ${state}
                            </option>`
                        ).join('')}
                    </select>
                            <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                                pointer-events-none"></i>
                </div>

                <!-- Pincode -->
                        <div class="relative group">
                    <input type="text" 
                        id="pincode" 
                        pattern="[0-9]{6}"
                        value="${existingAddress?.pincode || ''}"
                                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                                focus:outline-none transition-all duration-300 bg-gray-50 group-hover:bg-white
                                peer placeholder-transparent"
                                placeholder="Pincode"
                        required
                        maxlength="6"
                            >
                            <label for="pincode" 
                                class="absolute left-4 -top-2.5 bg-white px-2 text-sm text-gray-600 
                                transition-all duration-300 peer-placeholder-shown:top-3 
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                                Pincode
                            </label>
                        </div>
                </div>

                <!-- Address Type -->
                    <div class="space-y-2">
                        <h4 class="font-medium text-gray-700">Address Type</h4>
                    <div class="flex gap-4">
                            <label class="flex items-center p-3 border rounded-xl cursor-pointer transition-all
                                ${existingAddress?.type === 'home' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                                <input type="radio" name="addressType" value="home" 
                                ${existingAddress?.type === 'home' ? 'checked' : ''}
                                    class="hidden" required>
                                <i class="fas fa-home mr-2 ${existingAddress?.type === 'home' ? 'text-blue-500' : 'text-gray-400'}"></i>
                                <span class="${existingAddress?.type === 'home' ? 'text-blue-500' : 'text-gray-600'}">Home</span>
                        </label>
                            <label class="flex items-center p-3 border rounded-xl cursor-pointer transition-all
                                ${existingAddress?.type === 'work' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                                <input type="radio" name="addressType" value="work"
                                ${existingAddress?.type === 'work' ? 'checked' : ''}
                                    class="hidden">
                                <i class="fas fa-briefcase mr-2 ${existingAddress?.type === 'work' ? 'text-blue-500' : 'text-gray-400'}"></i>
                                <span class="${existingAddress?.type === 'work' ? 'text-blue-500' : 'text-gray-600'}">Work</span>
                        </label>
                            <label class="flex items-center p-3 border rounded-xl cursor-pointer transition-all
                                ${existingAddress?.type === 'other' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                                <input type="radio" name="addressType" value="other"
                                ${existingAddress?.type === 'other' ? 'checked' : ''}
                                    class="hidden">
                                <i class="fas fa-map-marker-alt mr-2 ${existingAddress?.type === 'other' ? 'text-blue-500' : 'text-gray-400'}"></i>
                                <span class="${existingAddress?.type === 'other' ? 'text-blue-500' : 'text-gray-600'}">Other</span>
                        </label>
                    </div>
                </div>

                <button type="submit" 
                        class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 
                        transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                        hover:shadow-lg mt-6">
                    ${existingAddress ? 'Update Address' : 'Save Address'}
                </button>
            </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add form submission handler
    document.getElementById('addressForm').onsubmit = function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            houseNo: document.getElementById('houseNo').value,
            street: document.getElementById('street').value,
            village: document.getElementById('village').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
            type: document.querySelector('input[name="addressType"]:checked').value,
            id: existingAddress?.id || Date.now().toString()
        };

        // Initialize addresses array if it doesn't exist
        if (!USERS[currentUser.email].addresses) {
            USERS[currentUser.email].addresses = [];
        }

        // Update or add address
        if (existingAddress) {
            const index = USERS[currentUser.email].addresses.findIndex(addr => addr.id === existingAddress.id);
            if (index !== -1) {
                USERS[currentUser.email].addresses[index] = formData;
            }
        } else {
            USERS[currentUser.email].addresses.push(formData);
        }

        // Save to localStorage
        saveUsers();
        
        // Close modal and show success message
        closeModal();
        showToast(`Address ${existingAddress ? 'updated' : 'added'} successfully`);
        
        // Refresh addresses modal
        showAddressesModal();
    };

    // Add event listeners for address type selection
    const radioButtons = modal.querySelectorAll('input[name="addressType"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Reset all labels
            radioButtons.forEach(btn => {
                const label = btn.parentElement;
                label.classList.remove('border-blue-500', 'bg-blue-50');
                label.classList.add('border-gray-200');
                const icon = label.querySelector('i');
                icon.classList.remove('text-blue-500');
                icon.classList.add('text-gray-400');
                const text = label.querySelector('span');
                text.classList.remove('text-blue-500');
                text.classList.add('text-gray-600');
            });

            // Style selected label
            const selectedLabel = this.parentElement;
            selectedLabel.classList.remove('border-gray-200');
            selectedLabel.classList.add('border-blue-500', 'bg-blue-50');
            const selectedIcon = selectedLabel.querySelector('i');
            selectedIcon.classList.remove('text-gray-400');
            selectedIcon.classList.add('text-blue-500');
            const selectedText = selectedLabel.querySelector('span');
            selectedText.classList.remove('text-gray-600');
            selectedText.classList.add('text-blue-500');
        });
    });
}

// Helper function to get Indian states
function getIndianStates() {
    return [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];
}

function showAddressesModal() {
    const user = USERS[currentUser.email];
    const addresses = user.addresses || [];
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl w-11/12 max-w-md max-h-[80vh] overflow-hidden transform animate-slideUp">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-800">My Addresses</h2>
                    <button onclick="closeModal()" 
                        class="w-8 h-8 flex items-center justify-center rounded-full 
                        text-gray-500 hover:bg-gray-100 transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                ${addresses.length === 0 ? `
                    <div class="text-center py-8">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-map-marker-alt text-gray-400 text-2xl"></i>
                        </div>
                        <p class="text-gray-500 mb-6">No addresses saved yet</p>
                        <button onclick="showAddressModal()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 
                            transition-all duration-300 transform hover:scale-105">
                            Add New Address
                        </button>
                    </div>
                ` : `
                    <div class="space-y-4">
                        ${addresses.map((address, index) => `
                            <div class="border border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm capitalize">
                                                ${address.type}
                                            </span>
                                            <h3 class="font-semibold text-gray-800">${address.name}</h3>
                                        </div>
                                        <p class="text-gray-600 text-sm mb-1">
                                            <i class="fas fa-phone text-gray-400 mr-2"></i>${address.phone}
                                        </p>
                                        <p class="text-gray-600 text-sm">
                                            ${address.houseNo}, ${address.street}, ${address.village},
                                            ${address.state} - ${address.pincode}
                                        </p>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick='showAddressModal(${JSON.stringify(address).replace(/'/g, "&apos;")})' 
                                            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deleteAddress(${index})" 
                                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <button onclick="showAddressModal()" 
                        class="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold 
                        hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] 
                        transition-all duration-300 hover:shadow-lg">
                        Add New Address
                    </button>
                `}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Add this function to handle address deletion
function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        const user = USERS[currentUser.email];
        user.addresses.splice(index, 1);
        saveUsers();
        showToast('Address deleted successfully');
        showAddressesModal(); // Refresh the modal
    }
}

// Add this to sync with admin changes
window.addEventListener('productsUpdated', function(event) {
    // Update the products in the main UI
    PRODUCTS = event.detail.products;
    
    // Refresh the product display if on products page
    if (document.querySelector('.products-grid')) {
        renderProducts();
    }
});

// Listen for product updates from admin panel
window.addEventListener('productsUpdated', function(event) {
    if (event.detail && event.detail.products) {
        PRODUCTS = event.detail.products;
        // Refresh the current view if on products page
        if (currentPage === 'products' || currentPage === 'home') {
            renderPage();
        }
        // Update any open product modals
        const openModal = document.querySelector('.product-modal');
        if (openModal) {
            const productId = openModal.dataset.productId;
            const product = findProductById(productId);
            if (product) {
                updateProductModal(openModal, product);
            }
        }
    }
});

// Update the authentication functions to use API
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/users.php?action=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        if (result.success) {
            currentUser = result.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return true;
        } else {
            showToast(result.error, 'error');
            return false;
        }
    } catch (error) {
        showToast('Login failed', 'error');
        return false;
    }
}


