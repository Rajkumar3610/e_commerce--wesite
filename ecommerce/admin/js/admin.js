// Admin state management
let currentAdminPage = 'dashboard';
let adminUser = null;
let realTimeData = {
    orders: [],
    users: {},
    products: {},
    notifications: []
};

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', () => {
    const savedAdminUser = localStorage.getItem('adminUser');
    if (savedAdminUser) {
        adminUser = JSON.parse(savedAdminUser);
        initializeAdminDashboard();
    } else {
        renderAdminLogin();
    }
});

// Admin Authentication
function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // In a real app, this would be an API call
    if (email === 'admin@freshmart.com' && password === 'admin123') {
        adminUser = {
            email,
            role: 'admin',
            name: 'Admin'
        };
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        
        // Initialize dashboard
        initializeAdminDashboard();
        
        // Show success message
        showAdminToast('Login successful');
    } else {
        showAdminToast('Invalid credentials', 'error');
    }
}

function handleAdminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear admin data
        localStorage.removeItem('adminUser');
        adminUser = null;

        // Hide sidebar and header
        const sidebar = document.getElementById('adminSidebar');
        const header = document.getElementById('adminHeader');
        
        sidebar.classList.add('-translate-x-full');
        header.classList.add('hidden');

        // Remove any overlay if present
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.remove();
        }

        // Clear any notifications
        const notificationPanel = document.getElementById('notificationPanel');
        if (notificationPanel) {
            notificationPanel.classList.add('hidden');
        }

        // Clear main content
        const mainContent = document.getElementById('adminContent');
        mainContent.innerHTML = '';

        // Render login page after a short delay
        setTimeout(() => {
            // Reset the page title
            document.getElementById('pageTitle').textContent = 'Login';
            
            // Render login page
            renderAdminLogin();
            
            // Show logout success message
            showAdminToast('Logged out successfully');
        }, 300);

        // Clear any intervals (for real-time updates)
        if (window.realTimeUpdateInterval) {
            clearInterval(window.realTimeUpdateInterval);
        }

        // Redirect to login page
        window.location.href = 'admin.html';

        // Reset current page
        currentAdminPage = 'login';
    }
}

// Dashboard Initialization
function initializeAdminDashboard() {
    const sidebar = document.getElementById('adminSidebar');
    const header = document.getElementById('adminHeader');
    
    // Show sidebar and header immediately
    sidebar.classList.remove('-translate-x-full', 'hidden');
    header.classList.remove('hidden');
    
    // Start real-time updates
    updateRealTimeData();
    window.realTimeUpdateInterval = setInterval(updateRealTimeData, 5000);
    
    // Set active tab to dashboard
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('[data-tab="dashboard"]').classList.add('active');
    
    // Update page title
    document.getElementById('pageTitle').textContent = 'Dashboard';
    
    // Render dashboard content immediately
    renderDashboard();
}

// Real-time Updates
function startRealTimeUpdates() {
    updateRealTimeData();
    setInterval(updateRealTimeData, 5000); // Update every 5 seconds
}

function updateRealTimeData() {
    realTimeData = {
        orders: getAllOrders(),
        users: USERS,
        products: PRODUCTS,
        notifications: generateNotifications()
    };
    updateDashboardMetrics();
    updateNotificationCount();
}

// Tab Management
function switchAdminTab(tab) {
    // Remove active state from all tabs
    document.querySelectorAll('[data-tab]').forEach(button => {
        button.classList.remove('bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-orange-50', 'bg-indigo-50');
    });
    
    // Add active state to selected tab
    const selectedTab = document.querySelector(`[data-tab="${tab}"]`);
    if (selectedTab) {
        switch(tab) {
            case 'dashboard':
                selectedTab.classList.add('bg-blue-50');
                break;
            case 'products':
                selectedTab.classList.add('bg-purple-50');
                break;
            case 'orders':
                selectedTab.classList.add('bg-green-50');
                break;
            case 'users':
                selectedTab.classList.add('bg-orange-50');
                break;
            case 'analytics':
                selectedTab.classList.add('bg-indigo-50');
                break;
            case 'profile':
                selectedTab.classList.add('bg-pink-50');
                break;
        }
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
        toggleSidebar();
    }
    
    // Update content
    currentAdminPage = tab;
    document.getElementById('pageTitle').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
    
    // Render content based on tab
    switch(tab) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'products':
            renderProducts();
            break;
        case 'orders':
            renderOrders();
            break;
        case 'users':
            renderUsers();
            break;
        case 'analytics':
            renderAnalytics();
            break;
        case 'profile':
            renderAdminProfile();
            break;
    }
}

// Render Functions
function renderDashboard() {
    const metrics = calculateMetrics();
    const recentOrders = getRecentOrders(5);
    const lowStockProducts = getLowStockProducts(5);
    
    const content = `
        <div class="space-y-6">
            <!-- Metrics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Total Sales -->
                <div onclick="showSalesDetails()" 
                    class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer 
                    hover:shadow-md transition-all transform hover:-translate-y-1">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-green-50 rounded-lg p-2">
                            <i class="fas fa-chart-line text-green-600 text-xl"></i>
                        </div>
                        <span class="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">
                            +${metrics.salesGrowth}%
                        </span>
                    </div>
                    <h3 class="text-gray-500 text-sm font-medium">Total Sales</h3>
                    <p class="text-2xl font-bold text-gray-800 mt-1">₹${metrics.totalRevenue.toLocaleString()}</p>
                    <p class="text-xs text-gray-500 mt-2">Compared to last month</p>
                </div>

                <!-- Total Orders -->
                <div onclick="showOrdersDetails()" 
                    class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer 
                    hover:shadow-md transition-all transform hover:-translate-y-1">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-blue-50 rounded-lg p-2">
                            <i class="fas fa-shopping-cart text-blue-600 text-xl"></i>
                        </div>
                        <span class="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg">
                            ${metrics.totalOrders} orders
                        </span>
                    </div>
                    <h3 class="text-gray-500 text-sm font-medium">Active Orders</h3>
                    <p class="text-2xl font-bold text-gray-800 mt-1">${metrics.pendingOrders}</p>
                    <p class="text-xs text-gray-500 mt-2">Orders waiting to be processed</p>
                </div>

                <!-- Total Users -->
                <div onclick="showUsersDetails()" 
                    class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer 
                    hover:shadow-md transition-all transform hover:-translate-y-1">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-purple-50 rounded-lg p-2">
                            <i class="fas fa-users text-purple-600 text-xl"></i>
                        </div>
                        <span class="text-sm text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-lg">
                            +${metrics.newUsers} new
                        </span>
                    </div>
                    <h3 class="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p class="text-2xl font-bold text-gray-800 mt-1">${metrics.totalUsers}</p>
                    <p class="text-xs text-gray-500 mt-2">Active customers</p>
                </div>

                <!-- Low Stock -->
                <div onclick="showInventoryDetails()" 
                    class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer 
                    hover:shadow-md transition-all transform hover:-translate-y-1">
                    <div class="flex items-center justify-between mb-4">
                        <div class="bg-red-50 rounded-lg p-2">
                            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                        </div>
                        <span class="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg">
                            ${metrics.lowStockCount} items
                        </span>
                    </div>
                    <h3 class="text-gray-500 text-sm font-medium">Low Stock Alert</h3>
                    <p class="text-2xl font-bold text-gray-800 mt-1">${metrics.outOfStockCount}</p>
                    <p class="text-xs text-gray-500 mt-2">Products out of stock</p>
                </div>
            </div>

            <!-- Recent Orders & Low Stock Products -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Orders -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div class="p-6 border-b border-gray-100">
                        <h3 class="font-semibold text-gray-800">Recent Orders</h3>
                    </div>
                    <div class="p-6">
                        ${recentOrders.length ? `
                            <div class="space-y-4">
                                ${recentOrders.map(order => `
                                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div class="flex items-center gap-4">
                                            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <i class="fas fa-shopping-bag text-blue-600"></i>
                                            </div>
                                            <div>
                                                <p class="font-medium text-gray-800">Order #${order.id}</p>
                                                <p class="text-sm text-gray-500">${order.userName}</p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-medium text-gray-800">₹${order.total.toLocaleString()}</p>
                                            <span class="text-xs px-2 py-1 rounded-lg ${getStatusColor(order.status)}">
                                                ${order.status}
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="text-center text-gray-500 py-4">
                                No recent orders
                            </div>
                        `}
                    </div>
                </div>

                <!-- Low Stock Products -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div class="p-6 border-b border-gray-100">
                        <h3 class="font-semibold text-gray-800">Low Stock Products</h3>
                    </div>
                    <div class="p-6">
                        ${lowStockProducts.length ? `
                            <div class="space-y-4">
                                ${lowStockProducts.map(product => `
                                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div class="flex items-center gap-4">
                                            <img src="${product.image}" class="w-10 h-10 rounded-lg object-cover">
                                            <div>
                                                <p class="font-medium text-gray-800">${product.name}</p>
                                                <p class="text-sm text-gray-500">${product.category}</p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <p class="font-medium text-gray-800">${product.stock} units</p>
                                            <p class="text-sm text-red-500">Low stock</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="text-center text-gray-500 py-4">
                                No low stock products
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('adminContent').innerHTML = content;
}

function renderProducts() {
    const content = `
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Products Management</h3>
                <div class="flex gap-4">
                    <input type="text" 
                        placeholder="Search products..." 
                        onkeyup="searchProducts(this.value)"
                        class="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none">
                    <button onclick="showAddProductModal()" 
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add New Product
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full products-table">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="p-4 text-left">Product</th>
                            <th class="p-4 text-left">Category</th>
                            <th class="p-4 text-left">Price</th>
                            <th class="p-4 text-left">Stock</th>
                            <th class="p-4 text-left">Status</th>
                            <th class="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.values(PRODUCTS).flat().map(product => `
                            <tr class="border-t">
                                <td class="p-4">
                                    <div class="flex items-center">
                                        <img src="${product.image}" class="w-12 h-12 rounded-lg object-cover mr-3">
                                        <div>
                                            <p class="font-medium">${product.name}</p>
                                            <p class="text-sm text-gray-500">#${product.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4">${product.category}</td>
                                <td class="p-4">₹${product.price}</td>
                                <td class="p-4">
                                    <input type="number" 
                                        value="${product.stock || 0}" 
                                        min="0"
                                        onchange="updateProductStock('${product.id}', this.value)"
                                        class="w-20 px-2 py-1 border rounded-lg">
                                </td>
                                <td class="p-4">
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" 
                                            class="sr-only peer" 
                                            ${product.available ? 'checked' : ''}
                                            onchange="updateProductAvailability('${product.id}', this.checked)">
                                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                            peer-focus:ring-blue-300 rounded-full peer 
                                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                                            after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                        </div>
                                    </label>
                                </td>
                                <td class="p-4">
                                    <div class="flex gap-2">
                                        <button onclick="showEditProductModal('${product.id}')" 
                                            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="confirmDeleteProduct('${product.id}')" 
                                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('adminContent').innerHTML = content;
}

// Product Management
function showAddProductModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">Add New Product</h2>
                <button onclick="this.closest('.fixed').remove()" 
                    class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="addProductForm" class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input type="text" name="name" required
                            class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select name="category" required
                            class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                            ${CATEGORIES.map(cat => 
                                `<option value="${cat.id}">${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                        </label>
                        <input type="number" name="price" required min="0" step="0.01"
                            class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Stock *
                        </label>
                        <input type="number" name="stock" required min="0"
                            class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea name="description" rows="3"
                        class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none"></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Image URL *
                    </label>
                    <input type="url" name="image" required
                        class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                </div>
                
                <div class="flex items-center gap-4">
                    <label class="flex items-center">
                        <input type="checkbox" name="available" checked
                            class="rounded text-blue-600 focus:ring-blue-500">
                        <span class="ml-2">Available for Sale</span>
                    </label>
                    
                    <label class="flex items-center">
                        <input type="checkbox" name="featured"
                            class="rounded text-blue-600 focus:ring-blue-500">
                        <span class="ml-2">Featured Product</span>
                    </label>
                </div>
                
                <div class="flex justify-end gap-4">
                    <button type="button" onclick="this.closest('.fixed').remove()"
                        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add form submission handler
    document.getElementById('addProductForm').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            description: formData.get('description'),
            image: formData.get('image'),
            available: formData.get('available') === 'on',
            featured: formData.get('featured') === 'on',
            id: 'PROD' + Date.now(),
            createdAt: new Date().toISOString()
        };
        
        // Add to PRODUCTS
        if (!PRODUCTS[productData.category]) {
            PRODUCTS[productData.category] = [];
        }
        PRODUCTS[productData.category].push(productData);
        
        // Save and update UI
        saveProductsToStorage();
        modal.remove();
        showAdminToast('Product added successfully');
        renderProducts();
    };
}

// Add this function to show the edit product modal
function showEditProductModal(productId) {
    // Find product
    let product;
    let productCategory;
    
    for (const category in PRODUCTS) {
        const found = PRODUCTS[category].find(p => p.id === productId);
        if (found) {
            product = found;
            productCategory = category;
            break;
        }
    }
    
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">Edit Product</h2>
                <button onclick="this.closest('.fixed').remove()" 
                    class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="editProductForm" class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input type="text" name="name" required value="${product.name}"
                            class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select name="category" required
                            class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                            ${CATEGORIES.map(cat => 
                                `<option value="${cat.id}" ${cat.id === productCategory ? 'selected' : ''}>
                                    ${cat.name}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹) *
                        </label>
                        <input type="number" name="price" required min="0" step="0.01" value="${product.price}"
                            class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Stock *
                        </label>
                        <input type="number" name="stock" required min="0" value="${product.stock || 0}"
                            class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea name="description" rows="3"
                        class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none"
                    >${product.description || ''}</textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Image URL *
                    </label>
                    <input type="url" name="image" required value="${product.image}"
                        class="w-full px-4 py-2 rounded-lg border focus:border-blue-500 focus:outline-none">
                </div>
                
                <div class="flex items-center gap-4">
                    <label class="flex items-center">
                        <input type="checkbox" name="available" ${product.available ? 'checked' : ''}
                            class="rounded text-blue-600 focus:ring-blue-500">
                        <span class="ml-2">Available for Sale</span>
                    </label>
                    
                    <label class="flex items-center">
                        <input type="checkbox" name="featured" ${product.featured ? 'checked' : ''}
                            class="rounded text-blue-600 focus:ring-blue-500">
                        <span class="ml-2">Featured Product</span>
                    </label>
                </div>
                
                <div class="flex justify-end gap-4">
                    <button type="button" onclick="this.closest('.fixed').remove()"
                        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add form submission handler
    document.getElementById('editProductForm').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const updatedData = {
            ...product,
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            description: formData.get('description'),
            image: formData.get('image'),
            available: formData.get('available') === 'on',
            featured: formData.get('featured') === 'on',
            updatedAt: new Date().toISOString()
        };
        
        // Remove from old category if category changed
        if (productCategory !== updatedData.category) {
            PRODUCTS[productCategory] = PRODUCTS[productCategory].filter(p => p.id !== product.id);
        }
        
        // Add to new/existing category
        if (!PRODUCTS[updatedData.category]) {
            PRODUCTS[updatedData.category] = [];
        }
        
        // Update or add product
        const existingIndex = PRODUCTS[updatedData.category].findIndex(p => p.id === product.id);
        if (existingIndex !== -1) {
            PRODUCTS[updatedData.category][existingIndex] = updatedData;
        } else {
            PRODUCTS[updatedData.category].push(updatedData);
        }
        
        // Save changes and update UI
        syncProductsWithUI();
        showAdminToast('Product updated successfully');
        modal.remove();
        renderProducts();
    };
}

function confirmDeleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        let deleted = false;
        
        for (const category in PRODUCTS) {
            const index = PRODUCTS[category].findIndex(p => p.id === productId);
            if (index !== -1) {
                PRODUCTS[category].splice(index, 1);
                deleted = true;
                break;
            }
        }
        
        if (deleted) {
            // Save changes
            localStorage.setItem('products', JSON.stringify(PRODUCTS));
            
            // Update UI
            showAdminToast('Product deleted successfully');
            renderProducts();
            
            // Sync with main app
            window.dispatchEvent(new CustomEvent('productsUpdated', {
                detail: { products: PRODUCTS }
            }));
        }
    }
}

// Add this function to sync products with user UI
function syncProductsWithUI() {
    // Save to localStorage for user UI
    localStorage.setItem('products', JSON.stringify(PRODUCTS));
    
    // Dispatch event that the main app can listen to
    window.dispatchEvent(new CustomEvent('productsUpdated', {
        detail: { 
            products: PRODUCTS,
            timestamp: new Date().toISOString()
        }
    }));
}

// Update the saveProductsToStorage function to use syncProductsWithUI
function saveProductsToStorage() {
    syncProductsWithUI();
}

// Order Management
function renderOrders() {
    const allOrders = getAllOrders();
    const content = `
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Orders Management</h3>
                <div class="flex gap-4">
                    <select onchange="filterOrders(this.value)" 
                        class="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none">
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input type="text" 
                        placeholder="Search orders..." 
                        onkeyup="searchOrders(this.value)"
                        class="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-50 rounded-xl p-4">
                    <h4 class="text-blue-600 text-sm font-medium">Total Orders</h4>
                    <p class="text-2xl font-bold text-gray-800 mt-1">${allOrders.length}</p>
                </div>
                <div class="bg-yellow-50 rounded-xl p-4">
                    <h4 class="text-yellow-600 text-sm font-medium">Pending</h4>
                    <p class="text-2xl font-bold text-gray-800 mt-1">
                        ${allOrders.filter(o => o.status === 'pending').length}
                    </p>
                </div>
                <div class="bg-green-50 rounded-xl p-4">
                    <h4 class="text-green-600 text-sm font-medium">Delivered</h4>
                    <p class="text-2xl font-bold text-gray-800 mt-1">
                        ${allOrders.filter(o => o.status === 'delivered').length}
                    </p>
                </div>
                <div class="bg-red-50 rounded-xl p-4">
                    <h4 class="text-red-600 text-sm font-medium">Cancelled</h4>
                    <p class="text-2xl font-bold text-gray-800 mt-1">
                        ${allOrders.filter(o => o.status === 'cancelled').length}
                    </p>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="p-4 text-left">Order ID</th>
                            <th class="p-4 text-left">Customer</th>
                            <th class="p-4 text-left">Date</th>
                            <th class="p-4 text-left">Items</th>
                            <th class="p-4 text-left">Total</th>
                            <th class="p-4 text-left">Status</th>
                            <th class="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${allOrders.map(order => `
                            <tr class="border-t">
                                <td class="p-4">#${order.id}</td>
                                <td class="p-4">
                                    <div>
                                        <p class="font-medium">${order.userName}</p>
                                        <p class="text-sm text-gray-500">${order.userEmail}</p>
                                    </div>
                                </td>
                                <td class="p-4">${formatDate(order.date)}</td>
                                <td class="p-4">${order.items.length} items</td>
                                <td class="p-4">₹${order.total.toLocaleString()}</td>
                                <td class="p-4">
                                    <span class="px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}">
                                        ${order.status}
                                    </span>
                                </td>
                                <td class="p-4">
                                    <button onclick="showOrderDetails('${order.id}')" 
                                        class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('adminContent').innerHTML = content;
}

// User Management
function renderUsers() {
    const users = Object.values(USERS);
    const content = `
        <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800">User Management</h3>
                <input type="text" 
                    placeholder="Search users..." 
                    onkeyup="searchUsers(this.value)"
                    class="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-blue-50 rounded-xl p-4">
                    <h4 class="text-blue-600 text-sm font-medium">Total Users</h4>
                    <p class="text-2xl font-bold text-gray-800 mt-1">${users.length}</p>
                </div>
                <div class="bg-green-50 rounded-xl p-4">
                    <h4 class="text-green-600 text-sm font-medium">Active Users</h4>
                    <p class="text-2xl font-bold text-gray-800 mt-1">
                        ${users.filter(u => u.orders?.length > 0).length}
                    </p>
                </div>
                <div class="bg-purple-50 rounded-xl p-4">
                    <h4 class="text-purple-600 text-sm font-medium">New Users (This Month)</h4>
                    <p class="text-2xl font-bold text-gray-800 mt-1">
                        ${users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length}
                    </p>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="p-4 text-left">User</th>
                            <th class="p-4 text-left">Email</th>
                            <th class="p-4 text-left">Joined</th>
                            <th class="p-4 text-left">Orders</th>
                            <th class="p-4 text-left">Status</th>
                            <th class="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr class="border-t">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <i class="fas fa-user text-gray-500"></i>
                                        </div>
                                        <span class="font-medium">${user.name}</span>
                                    </div>
                                </td>
                                <td class="p-4">${user.email}</td>
                                <td class="p-4">${formatDate(user.createdAt)}</td>
                                <td class="p-4">${user.orders?.length || 0}</td>
                                <td class="p-4">
                                    <span class="px-2 py-1 rounded-full text-sm bg-green-50 text-green-600">
                                        Active
                                    </span>
                                </td>
                                <td class="p-4">
                                    <button onclick="showUserDetails('${user.email}')" 
                                        class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('adminContent').innerHTML = content;
}

// Analytics
function renderAnalytics() {
    const metrics = calculateMetrics();
    const salesData = getSalesByMonth(getAllOrders());
    
    const content = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-6">Sales Analytics</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-blue-50 rounded-xl p-4">
                        <h4 class="text-blue-600 text-sm font-medium">Total Revenue</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">₹${metrics.totalRevenue.toLocaleString()}</p>
                        <p class="text-sm text-blue-600 mt-2">+${metrics.salesGrowth}% from last month</p>
                    </div>
                    <div class="bg-green-50 rounded-xl p-4">
                        <h4 class="text-green-600 text-sm font-medium">Orders</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">${metrics.totalOrders}</p>
                        <p class="text-sm text-green-600 mt-2">${metrics.pendingOrders} pending</p>
                    </div>
                    <div class="bg-purple-50 rounded-xl p-4">
                        <h4 class="text-purple-600 text-sm font-medium">Users</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">${metrics.totalUsers}</p>
                        <p class="text-sm text-purple-600 mt-2">+${metrics.newUsers} new</p>
                    </div>
                    <div class="bg-orange-50 rounded-xl p-4">
                        <h4 class="text-orange-600 text-sm font-medium">Products</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">
                            ${Object.values(PRODUCTS).flat().length}
                        </p>
                        <p class="text-sm text-orange-600 mt-2">${metrics.lowStockCount} low stock</p>
                    </div>
                </div>

                <!-- Sales Chart -->
                <div class="h-80 bg-gray-50 rounded-xl p-4">
                    <h4 class="text-gray-600 text-sm font-medium mb-4">Monthly Sales Trend</h4>
                    <!-- Add your chart implementation here -->
                </div>
            </div>

            <!-- Top Products -->
            <div class="bg-white rounded-xl shadow-sm p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-6">Top Selling Products</h3>
                <div class="space-y-4">
                    ${getTopSellingProducts(getAllOrders()).map(product => `
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div class="flex items-center gap-4">
                                <img src="${product.image}" class="w-12 h-12 rounded-lg object-cover">
                                <div>
                                    <p class="font-medium">${product.name}</p>
                                    <p class="text-sm text-gray-500">${product.totalSold} units sold</p>
                                </div>
                            </div>
                            <p class="font-medium">₹${product.revenue.toLocaleString()}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('adminContent').innerHTML = content;
}

// Helper functions for search and filter
function searchOrders(query) {
    // Implement order search logic
}

function filterOrders(status) {
    // Implement order filter logic
}

function searchUsers(query) {
    // Implement user search logic
}

function showOrderDetails(orderId) {
    // Implement order details modal
}

function showUserDetails(userEmail) {
    const user = USERS[userEmail];
    if (!user) {
        showAdminToast('User not found', 'error');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                <h2 class="text-xl font-bold text-gray-800">User Details</h2>
                <button onclick="this.closest('.fixed').remove()" 
                    class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- User Profile -->
                <div class="flex items-center gap-4">
                    <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                        ${user.profilePic ? 
                            `<img src="${user.profilePic}" class="w-full h-full rounded-full object-cover">` :
                            `<i class="fas fa-user text-3xl text-gray-400"></i>`
                        }
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold">${user.name}</h3>
                        <p class="text-gray-500">${user.email}</p>
                        <p class="text-sm text-gray-400">Member since ${formatDate(user.createdAt)}</p>
                    </div>
                </div>

                <!-- User Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 p-4 rounded-xl">
                        <h4 class="text-blue-600 text-sm font-medium">Total Orders</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">${user.orders?.length || 0}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-xl">
                        <h4 class="text-green-600 text-sm font-medium">Total Spent</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">
                            ₹${calculateTotalSpent(user.orders).toLocaleString()}
                        </p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-xl">
                        <h4 class="text-purple-600 text-sm font-medium">Wishlist Items</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">${user.wishlist?.length || 0}</p>
                    </div>
                </div>

                <!-- Recent Orders -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Recent Orders</h3>
                    ${user.orders && user.orders.length > 0 ? `
                        <div class="space-y-4">
                            ${user.orders.slice(0, 5).map(order => `
                                <div class="bg-gray-50 p-4 rounded-xl">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="font-medium">Order #${order.id}</span>
                                        <span class="text-sm text-gray-500">${formatDate(order.date)}</span>
                                    </div>
                                    <div class="text-sm text-gray-600 mb-2">
                                        ${order.items.length} items • Total: ₹${order.total.toLocaleString()}
                                    </div>
                                    <span class="inline-block px-2 py-1 text-sm rounded-full ${getStatusColor(order.status)}">
                                        ${order.status}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p class="text-gray-500 text-center py-4">No orders yet</p>
                    `}
                </div>

                <!-- User Reviews -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Recent Reviews</h3>
                    ${user.reviews && user.reviews.length > 0 ? `
                        <div class="space-y-4">
                            ${user.reviews.slice(0, 3).map(review => {
                                const product = findProductById(review.productId);
                                return product ? `
                                    <div class="bg-gray-50 p-4 rounded-xl">
                                        <div class="flex items-center gap-3 mb-2">
                                            <img src="${product.image}" class="w-12 h-12 rounded-lg object-cover">
                                            <div>
                                                <p class="font-medium">${product.name}</p>
                                                <div class="flex text-yellow-400 text-sm">
                                                    ${Array(5).fill('').map((_, i) => 
                                                        `<i class="fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}"></i>`
                                                    ).join('')}
                                                </div>
                                            </div>
                                        </div>
                                        <p class="text-gray-600 text-sm">${review.comment}</p>
                                    </div>
                                ` : '';
                            }).join('')}
                        </div>
                    ` : `
                        <p class="text-gray-500 text-center py-4">No reviews yet</p>
                    `}
                </div>

                <!-- Account Actions -->
                <div class="flex justify-end gap-4">
                    <button onclick="resetUserPassword('${userEmail}')"
                        class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        Reset Password
                    </button>
                    ${user.blocked ? `
                        <button onclick="unblockUser('${userEmail}')"
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Unblock User
                        </button>
                    ` : `
                        <button onclick="blockUser('${userEmail}')"
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Block User
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Helper functions
function calculateTotalSpent(orders = []) {
    return orders.reduce((total, order) => total + order.total, 0);
}

function findProductById(productId) {
    for (const category in PRODUCTS) {
        const product = PRODUCTS[category].find(p => p.id === productId);
        if (product) return product;
    }
    return null;
}

function resetUserPassword(userEmail) {
    if (confirm('Are you sure you want to reset this user\'s password?')) {
        // In a real app, this would generate a reset link or temporary password
        showAdminToast('Password reset email sent to user');
    }
}

function blockUser(userEmail) {
    if (confirm('Are you sure you want to block this user?')) {
        USERS[userEmail].blocked = true;
        localStorage.setItem('users', JSON.stringify(USERS));
        showAdminToast('User blocked successfully');
        renderUsers(); // Refresh the users list
    }
}

function unblockUser(userEmail) {
    USERS[userEmail].blocked = false;
    localStorage.setItem('users', JSON.stringify(USERS));
    showAdminToast('User unblocked successfully');
    renderUsers(); // Refresh the users list
}

// Helper Functions
function calculateMetrics() {
    const allOrders = getAllOrders();
    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth - 1;
    
    // Calculate sales growth
    const currentMonthSales = allOrders
        .filter(order => new Date(order.date).getMonth() === currentMonth)
        .reduce((sum, order) => sum + order.total, 0);
    
    const lastMonthSales = allOrders
        .filter(order => new Date(order.date).getMonth() === lastMonth)
        .reduce((sum, order) => sum + order.total, 0);
    
    const salesGrowth = lastMonthSales ? 
        Math.round(((currentMonthSales - lastMonthSales) / lastMonthSales) * 100) : 100;

    // Get new users count (registered this month)
    const newUsers = Object.values(USERS).filter(user => 
        new Date(user.createdAt).getMonth() === currentMonth
    ).length;

    // Calculate stock metrics
    const products = Object.values(PRODUCTS).flat();
    const lowStockCount = products.filter(p => p.stock < 10 && p.stock > 0).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    return {
        totalRevenue: currentMonthSales,
        salesGrowth,
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter(order => order.status === 'pending').length,
        totalUsers: Object.keys(USERS).length,
        newUsers,
        lowStockCount,
        outOfStockCount
    };
}

function getAllOrders() {
    return Object.values(USERS).flatMap(user => 
        (user.orders || []).map(order => ({
            ...order,
            userEmail: user.email,
            userName: user.name
        }))
    );
}

function getRecentOrders(limit = 5) {
    return getAllOrders()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

function getLowStockProducts(limit = 5) {
    return Object.values(PRODUCTS)
        .flat()
        .filter(product => product.stock < 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, limit);
}

function getStatusColor(status) {
    const colors = {
        pending: 'bg-yellow-50 text-yellow-600',
        processing: 'bg-blue-50 text-blue-600',
        shipped: 'bg-purple-50 text-purple-600',
        delivered: 'bg-green-50 text-green-600',
        cancelled: 'bg-red-50 text-red-600'
    };
    return colors[status] || 'bg-gray-50 text-gray-600';
}

// UI Components
function renderMetricCards(metrics) {
    return `
        <div class="bg-white p-4 rounded-xl shadow-sm">
            <h3 class="text-gray-500 text-sm">Total Orders</h3>
            <p class="text-2xl font-bold">${metrics.totalOrders}</p>
        </div>
        <!-- Add other metric cards -->
    `;
}

function renderProductsTable() {
    let tableHTML = `
        <table class="w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="p-4 text-left">Product</th>
                    <th class="p-4 text-left">Category</th>
                    <th class="p-4 text-left">Price</th>
                    <th class="p-4 text-left">Stock</th>
                    <th class="p-4 text-left">Status</th>
                    <th class="p-4 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${Object.values(PRODUCTS).flat().map(product => `
                    <tr class="border-t">
                        <td class="p-4">
                            <div class="flex items-center">
                                <img src="${product.image}" class="w-12 h-12 rounded-lg object-cover mr-3">
                                <div>
                                    <p class="font-medium">${product.name}</p>
                                    <p class="text-sm text-gray-500">#${product.id}</p>
                                </div>
                            </div>
                        </td>
                        <td class="p-4">${product.category}</td>
                        <td class="p-4">₹${product.price}</td>
                        <td class="p-4">${product.stock || 0}</td>
                        <td class="p-4">
                            <span class="px-2 py-1 rounded-full text-sm 
                                ${product.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                                ${product.available ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </td>
                        <td class="p-4">
                            <div class="flex gap-2">
                                <button onclick="showEditProductModal('${product.id}')" 
                                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="confirmDeleteProduct('${product.id}')" 
                                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    return tableHTML;
}

function renderOrdersTable() {
    // Implementation
}

function renderUsersTable() {
    // Implementation
}

// Notifications
function updateNotificationCount() {
    const count = realTimeData.notifications.length;
    document.getElementById('notificationCount').textContent = count;
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        renderNotifications();
    }
}

function renderNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.innerHTML = `
        <div class="p-4 border-b">
            <h3 class="font-semibold">Notifications</h3>
        </div>
        <div class="p-4 space-y-4">
            ${realTimeData.notifications.map(notification => `
                <div class="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <i class="fas fa-${notification.type === 'order' ? 'shopping-cart' : 'exclamation-circle'} 
                        text-${notification.type === 'order' ? 'blue' : 'red'}-500"></i>
                    <div>
                        <p class="text-sm">${notification.message}</p>
                        <p class="text-xs text-gray-500">${formatTimestamp(notification.timestamp)}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Utility Functions
function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function showAdminToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white transform transition-all duration-300 
        ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} shadow-lg`;
    toast.style.transform = 'translateY(100px)';
    toast.innerHTML = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Product Management
function addNewProduct(productData) {
    const newProduct = {
        id: 'PROD' + Date.now(),
        ...productData,
        createdAt: new Date().toISOString()
    };
    
    PRODUCTS[productData.category].push(newProduct);
    saveProductsToStorage();
    showAdminToast('Product added successfully');
    renderProductsTable();
}

function updateProduct(productId, updates) {
    for (const category in PRODUCTS) {
        const productIndex = PRODUCTS[category].findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            PRODUCTS[category][productIndex] = {
                ...PRODUCTS[category][productIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            break;
        }
    }
    saveProductsToStorage();
    showAdminToast('Product updated successfully');
    renderProductsTable();
}

// Order Management
function updateOrderStatus(orderId, newStatus) {
    let orderUpdated = false;
    
    for (const userEmail in USERS) {
        const user = USERS[userEmail];
        const orderIndex = user.orders?.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            user.orders[orderIndex].status = newStatus;
            user.orders[orderIndex].updatedAt = new Date().toISOString();
            orderUpdated = true;
            break;
        }
    }
    
    if (orderUpdated) {
        saveUsers();
        showAdminToast('Order status updated');
        renderOrdersTable();
    }
}

// User Management
function deleteUser(email) {
    if (confirm(`Are you sure you want to delete user ${email}?`)) {
        delete USERS[email];
        saveUsers();
        showAdminToast('User deleted successfully');
        renderUsersTable();
    }
}

// Add this function to render the admin login page
function renderAdminLogin() {
    // Hide sidebar and header first
    const sidebar = document.getElementById('adminSidebar');
    const header = document.getElementById('adminHeader');
    
    if (sidebar) sidebar.classList.add('-translate-x-full', 'hidden');
    if (header) header.classList.add('hidden');

    const mainContent = document.getElementById('adminContent');
    mainContent.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
                    <p class="text-gray-600">Sign in to manage your store</p>
                </div>

                <form class="mt-8 space-y-6" onsubmit="handleAdminLogin(event)">
                    <div class="space-y-4">
                        <div>
                            <label for="adminEmail" class="sr-only">Email address</label>
                            <div class="relative">
                                <input id="adminEmail" 
                                    name="email" 
                                    type="email" 
                                    required 
                                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                                    focus:outline-none transition-all duration-300 bg-gray-50 
                                    hover:bg-white"
                                    placeholder="Email address">
                                <i class="fas fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>

                        <div>
                            <label for="adminPassword" class="sr-only">Password</label>
                            <div class="relative">
                                <input id="adminPassword" 
                                    name="password" 
                                    type="password" 
                                    required 
                                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                                    focus:outline-none transition-all duration-300 bg-gray-50 
                                    hover:bg-white"
                                    placeholder="Password">
                                <i class="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>
                    </div>

                    <button type="submit" 
                        class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 
                        transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                        hover:shadow-lg">
                        Sign in
                    </button>
                </form>

                <div class="mt-4 text-center">
                    <p class="text-sm text-gray-600">
                        Default credentials:<br>
                        Email: admin@freshmart.com<br>
                        Password: admin123
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Add these functions for sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar.classList.contains('-translate-x-full')) {
        // Show sidebar
        sidebar.classList.remove('-translate-x-full');
        
        // Add overlay
        if (!overlay) {
            const div = document.createElement('div');
            div.id = 'sidebarOverlay';
            div.className = 'fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden';
            div.onclick = toggleSidebar;
            document.body.appendChild(div);
        }
    } else {
        // Hide sidebar
        sidebar.classList.add('-translate-x-full');
        
        // Remove overlay
        if (overlay) {
            overlay.remove();
        }
    }
}

// Add resize listener to handle responsive behavior
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('-translate-x-full');
        if (overlay) overlay.remove();
    } else {
        sidebar.classList.add('-translate-x-full');
    }
});

// Add these new functions
function renderAdminProfile() {
    const content = `
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <!-- Profile Header -->
                <div class="p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <div class="flex items-center gap-6">
                        <div class="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <i class="fas fa-user-circle text-4xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">${adminUser.name}</h2>
                            <p class="text-blue-100">${adminUser.email}</p>
                        </div>
                    </div>
                </div>

                <!-- Profile Sections -->
                <div class="p-8">
                    <!-- Personal Information -->
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                        <form onsubmit="updateAdminProfile(event)" class="space-y-4 max-w-md">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input type="text" name="name" value="${adminUser.name}"
                                    class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 
                                    focus:ring-2 focus:ring-blue-200 transition-all">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input type="email" name="email" value="${adminUser.email}" readonly
                                    class="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50">
                            </div>
                            
                            <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                                transition-colors">
                                Update Profile
                            </button>
                        </form>
                    </div>

                    <!-- Change Password -->
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                        <form onsubmit="updateAdminPassword(event)" class="space-y-4 max-w-md">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <input type="password" name="currentPassword" required
                                    class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 
                                    focus:ring-2 focus:ring-blue-200 transition-all">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input type="password" name="newPassword" required
                                    class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 
                                    focus:ring-2 focus:ring-blue-200 transition-all">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input type="password" name="confirmPassword" required
                                    class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 
                                    focus:ring-2 focus:ring-blue-200 transition-all">
                            </div>
                            
                            <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                                transition-colors">
                                Change Password
                            </button>
                        </form>
                    </div>

                    <!-- Preferences -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
                        <div class="space-y-4 max-w-md">
                            <div class="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                <div>
                                    <p class="font-medium text-gray-700">Email Notifications</p>
                                    <p class="text-sm text-gray-500">Receive email updates about orders</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" checked 
                                        onchange="toggleAdminPreference('emailNotifications', this.checked)">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                        peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                                        after:left-[2px] after:bg-white after:border-gray-300 after:border 
                                        after:rounded-full after:h-5 after:w-5 after:transition-all 
                                        peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('adminContent').innerHTML = content;
}

function updateAdminProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newName = formData.get('name');
    
    adminUser.name = newName;
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    
    // Update UI
    document.getElementById('adminName').textContent = newName;
    showAdminToast('Profile updated successfully');
}

function updateAdminPassword(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate current password
    if (currentPassword !== 'admin123') {
        showAdminToast('Current password is incorrect', 'error');
        return;
    }
    
    // Validate new password
    if (newPassword !== confirmPassword) {
        showAdminToast('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAdminToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Update password
    adminUser.password = newPassword;
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    
    event.target.reset();
    showAdminToast('Password updated successfully');
}

function toggleAdminPreference(preference, value) {
    if (!adminUser.preferences) {
        adminUser.preferences = {};
    }
    
    adminUser.preferences[preference] = value;
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
    
    showAdminToast(`${preference} ${value ? 'enabled' : 'disabled'}`);
}

// Detailed view functions
function showSalesDetails() {
    const allOrders = getAllOrders();
    const salesByMonth = getSalesByMonth(allOrders);
    const topProducts = getTopSellingProducts(allOrders);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                <h2 class="text-xl font-bold text-gray-800">Sales Details</h2>
                <button onclick="this.closest('.fixed').remove()" 
                    class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- Monthly Sales Chart -->
                <div class="bg-gray-50 p-4 rounded-xl">
                    <h3 class="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
                    <div class="h-64 chart-container">
                        <!-- Add your chart here -->
                    </div>
                </div>

                <!-- Top Selling Products -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Top Selling Products</h3>
                    <div class="space-y-3">
                        ${topProducts.map(product => `
                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div class="flex items-center gap-4">
                                    <img src="${product.image}" class="w-12 h-12 rounded-lg object-cover">
                                    <div>
                                        <p class="font-medium">${product.name}</p>
                                        <p class="text-sm text-gray-500">${product.totalSold} units sold</p>
                                    </div>
                                </div>
                                <p class="font-medium">₹${product.revenue.toLocaleString()}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Recent Transactions -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Recent Transactions</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="p-4 text-left">Order ID</th>
                                    <th class="p-4 text-left">Customer</th>
                                    <th class="p-4 text-left">Date</th>
                                    <th class="p-4 text-left">Amount</th>
                                    <th class="p-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${allOrders.slice(0, 10).map(order => `
                                    <tr class="border-t">
                                        <td class="p-4">#${order.id}</td>
                                        <td class="p-4">${order.userName}</td>
                                        <td class="p-4">${formatDate(order.date)}</td>
                                        <td class="p-4">₹${order.total.toLocaleString()}</td>
                                        <td class="p-4">
                                            <span class="px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}">
                                                ${order.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showUsersDetails() {
    const users = Object.values(USERS);
    const userMetrics = calculateUserMetrics(users);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                <h2 class="text-xl font-bold text-gray-800">User Details</h2>
                <button onclick="this.closest('.fixed').remove()" 
                    class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- User Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">Total Users</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">${userMetrics.total}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">Active This Month</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">${userMetrics.active}</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">New Users</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">${userMetrics.new}</p>
                    </div>
                </div>

                <!-- User List -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="p-4 text-left">User</th>
                                <th class="p-4 text-left">Email</th>
                                <th class="p-4 text-left">Joined</th>
                                <th class="p-4 text-left">Orders</th>
                                <th class="p-4 text-left">Status</th>
                                <th class="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr class="border-t">
                                    <td class="p-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <i class="fas fa-user text-gray-500"></i>
                                            </div>
                                            <span class="font-medium">${user.name}</span>
                                        </div>
                                    </td>
                                    <td class="p-4">${user.email}</td>
                                    <td class="p-4">${formatDate(user.createdAt)}</td>
                                    <td class="p-4">${user.orders?.length || 0}</td>
                                    <td class="p-4">
                                        <span class="px-2 py-1 rounded-full text-sm bg-green-50 text-green-600">
                                            Active
                                        </span>
                                    </td>
                                    <td class="p-4">
                                        <button onclick="showUserDetails('${user.email}')" 
                                            class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Helper functions
function getSalesByMonth(orders) {
    const salesByMonth = {};
    orders.forEach(order => {
        const date = new Date(order.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        salesByMonth[monthYear] = (salesByMonth[monthYear] || 0) + order.total;
    });
    return salesByMonth;
}

function getTopSellingProducts(orders) {
    const productSales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.id]) {
                productSales[item.id] = {
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    totalSold: 0,
                    revenue: 0
                };
            }
            productSales[item.id].totalSold += item.quantity;
            productSales[item.id].revenue += item.price * item.quantity;
        });
    });
    return Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
}

function calculateUserMetrics(users) {
    const currentMonth = new Date().getMonth();
    return {
        total: users.length,
        active: users.filter(user => 
            user.orders?.some(order => new Date(order.date).getMonth() === currentMonth)
        ).length,
        new: users.filter(user => 
            new Date(user.createdAt).getMonth() === currentMonth
        ).length
    };
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add these functions for Orders and Inventory details

function showOrdersDetails() {
    const allOrders = getAllOrders();
    const activeOrders = allOrders.filter(order => order.status === 'pending' || order.status === 'processing');
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                <h2 class="text-xl font-bold text-gray-800">Active Orders</h2>
                <button onclick="this.closest('.fixed').remove()" 
                    class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- Order Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">Pending Orders</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">
                            ${allOrders.filter(order => order.status === 'pending').length}
                        </p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">Processing</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">
                            ${allOrders.filter(order => order.status === 'processing').length}
                        </p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">Total Value</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">
                            ₹${activeOrders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                <!-- Active Orders List -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="p-4 text-left">Order ID</th>
                                <th class="p-4 text-left">Customer</th>
                                <th class="p-4 text-left">Items</th>
                                <th class="p-4 text-left">Total</th>
                                <th class="p-4 text-left">Status</th>
                                <th class="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${activeOrders.map(order => `
                                <tr class="border-t">
                                    <td class="p-4">#${order.id}</td>
                                    <td class="p-4">
                                        <div>
                                            <p class="font-medium">${order.userName}</p>
                                            <p class="text-sm text-gray-500">${order.userEmail}</p>
                                        </div>
                                    </td>
                                    <td class="p-4">${order.items.length} items</td>
                                    <td class="p-4">₹${order.total.toLocaleString()}</td>
                                    <td class="p-4">
                                        <span class="px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}">
                                            ${order.status}
                                        </span>
                                    </td>
                                    <td class="p-4">
                                        <button onclick="updateOrderStatus('${order.id}', 'processing')" 
                                            class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                            Process
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showInventoryDetails() {
    const products = Object.values(PRODUCTS).flat();
    const lowStockProducts = products.filter(p => p.stock < 10);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                <h2 class="text-xl font-bold text-gray-800">Inventory Alert</h2>
                <button onclick="this.closest('.fixed').remove()" 
                    class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <!-- Inventory Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">Low Stock Items</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">
                            ${lowStockProducts.length}
                        </p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">Out of Stock</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">
                            ${products.filter(p => p.stock === 0).length}
                        </p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl text-center">
                        <h4 class="text-gray-500 text-sm">Need Restock</h4>
                        <p class="text-2xl font-bold text-gray-800 mt-1">
                            ${lowStockProducts.length}
                        </p>
                    </div>
                </div>

                <!-- Low Stock Products List -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="p-4 text-left">Product</th>
                                <th class="p-4 text-left">Category</th>
                                <th class="p-4 text-left">Current Stock</th>
                                <th class="p-4 text-left">Status</th>
                                <th class="p-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lowStockProducts.map(product => `
                                <tr class="border-t">
                                    <td class="p-4">
                                        <div class="flex items-center gap-3">
                                            <img src="${product.image}" class="w-10 h-10 rounded-lg object-cover">
                                            <div>
                                                <p class="font-medium">${product.name}</p>
                                                <p class="text-sm text-gray-500">SKU: ${product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-4">${product.category}</td>
                                    <td class="p-4">${product.stock} units</td>
                                    <td class="p-4">
                                        <span class="px-2 py-1 rounded-full text-sm ${
                                            product.stock === 0 ? 'bg-red-50 text-red-600' : 
                                            'bg-yellow-50 text-yellow-600'
                                        }">
                                            ${product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                                        </span>
                                    </td>
                                    <td class="p-4">
                                        <button onclick="updateProductStock('${product.id}', ${product.stock + 10})" 
                                            class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Add these helper functions
function updateOrderStatus(orderId, newStatus) {
    // Update order status logic here
    showAdminToast(`Order #${orderId} status updated to ${newStatus}`);
}

// Add this function to handle quick stock updates
function updateProductStock(productId, newStock) {
    newStock = parseInt(newStock);
    if (isNaN(newStock) || newStock < 0) {
        showAdminToast('Please enter a valid stock number', 'error');
        return;
    }

    for (const category in PRODUCTS) {
        const product = PRODUCTS[category].find(p => p.id === productId);
        if (product) {
            product.stock = newStock;
            product.available = newStock > 0;
            
            // Save and sync changes
            syncProductsWithUI();
            showAdminToast(`Stock updated to ${newStock} units`);
            return;
        }
    }
}

function updateProductAvailability(productId, isAvailable) {
    for (const category in PRODUCTS) {
        const product = PRODUCTS[category].find(p => p.id === productId);
        if (product) {
            product.available = isAvailable;
            
            // Save changes
            localStorage.setItem('products', JSON.stringify(PRODUCTS));
            
            // Update UI
            showAdminToast(`Product ${isAvailable ? 'enabled' : 'disabled'} successfully`);
            
            // Sync with main app
            window.dispatchEvent(new CustomEvent('productsUpdated', {
                detail: { products: PRODUCTS }
            }));
            
            return;
        }
    }
}

// Add this function to handle bulk updates
function bulkUpdateProducts(updates) {
    let updatedCount = 0;
    
    updates.forEach(update => {
        for (const category in PRODUCTS) {
            const product = PRODUCTS[category].find(p => p.id === update.productId);
            if (product) {
                // Apply updates
                Object.assign(product, update.changes);
                updatedCount++;
                break;
            }
        }
    });
    
    if (updatedCount > 0) {
        // Save and sync changes
        syncProductsWithUI();
        showAdminToast(`Updated ${updatedCount} products successfully`);
        renderProducts();
    }
}

// Add this function to handle product image uploads
function handleProductImage(event, productId) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showAdminToast('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showAdminToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    // Read and process image
    const reader = new FileReader();
    reader.onload = function(e) {
        updateProductImage(productId, e.target.result);
    };
    reader.readAsDataURL(file);
}

function updateProductImage(productId, imageData) {
    for (const category in PRODUCTS) {
        const product = PRODUCTS[category].find(p => p.id === productId);
        if (product) {
            product.image = imageData;
            
            // Save and sync changes
            syncProductsWithUI();
            showAdminToast('Product image updated successfully');
            renderProducts();
            return;
        }
    }
}

// Add this function to sync changes with user interface
function updateUserInterface() {
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('productsUpdated', {
        detail: { 
            products: PRODUCTS,
            timestamp: new Date().toISOString()
        }
    }));
    
    // Update localStorage
    localStorage.setItem('products', JSON.stringify(PRODUCTS));
    
    // Update any open product modals or views
    if (document.querySelector('.product-modal')) {
        refreshProductModals();
    }
}

// Add this function to refresh product modals
function refreshProductModals() {
    const openModals = document.querySelectorAll('.product-modal');
    openModals.forEach(modal => {
        const productId = modal.dataset.productId;
        if (productId) {
            let product;
            for (const category in PRODUCTS) {
                product = PRODUCTS[category].find(p => p.id === productId);
                if (product) break;
            }
            
            if (product) {
                // Update modal content with latest data
                updateModalContent(modal, product);
            }
        }
    });
}

// Add this function to update modal content
function updateModalContent(modal, product) {
    // Update stock display
    const stockDisplay = modal.querySelector('.stock-display');
    if (stockDisplay) {
        stockDisplay.textContent = `${product.stock} units available`;
        stockDisplay.className = `stock-display ${
            product.stock > 10 ? 'text-green-600' : 
            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
        }`;
    }
    
    // Update availability toggle
    const availabilityToggle = modal.querySelector('.availability-toggle');
    if (availabilityToggle) {
        availabilityToggle.checked = product.available;
    }
    
    // Update price display
    const priceDisplay = modal.querySelector('.price-display');
    if (priceDisplay) {
        priceDisplay.textContent = `₹${product.price.toLocaleString()}`;
    }
}

// Add this function to handle product search
function searchProducts(query) {
    query = query.toLowerCase().trim();
    const results = [];
    
    for (const category in PRODUCTS) {
        const matches = PRODUCTS[category].filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.id.toLowerCase().includes(query)
        );
        results.push(...matches);
    }
    
    // Update the products table with search results
    const tableBody = document.querySelector('.products-table tbody');
    if (tableBody) {
        tableBody.innerHTML = results.map(product => `
            <tr class="border-t">
                <td class="p-4">
                    <div class="flex items-center">
                        <img src="${product.image}" class="w-12 h-12 rounded-lg object-cover mr-3">
                        <div>
                            <p class="font-medium">${product.name}</p>
                            <p class="text-sm text-gray-500">#${product.id}</p>
                        </div>
                    </div>
                </td>
                <td class="p-4">${product.category}</td>
                <td class="p-4">₹${product.price}</td>
                <td class="p-4">${product.stock || 0}</td>
                <td class="p-4">
                    <span class="px-2 py-1 rounded-full text-sm 
                        ${product.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
                        ${product.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                </td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button onclick="showEditProductModal('${product.id}')" 
                            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="confirmDeleteProduct('${product.id}')" 
                            class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Add these functions at the top of your file, after the state variables

function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        USERS = JSON.parse(savedUsers);
    }
}

function updateDashboardMetrics() {
    const metrics = calculateMetrics();
    
    // Update metrics cards
    document.querySelectorAll('.metric-card').forEach(card => {
        const metricType = card.dataset.metric;
        const valueElement = card.querySelector('.metric-value');
        const changeElement = card.querySelector('.metric-change');
        
        switch(metricType) {
            case 'sales':
                valueElement.textContent = `₹${metrics.totalRevenue.toLocaleString()}`;
                changeElement.textContent = `${metrics.salesGrowth}%`;
                break;
            case 'orders':
                valueElement.textContent = metrics.totalOrders;
                changeElement.textContent = `${metrics.pendingOrders} pending`;
                break;
            case 'users':
                valueElement.textContent = metrics.totalUsers;
                changeElement.textContent = `+${metrics.newUsers} new`;
                break;
            case 'inventory':
                valueElement.textContent = metrics.lowStockCount;
                changeElement.textContent = `${metrics.outOfStockCount} out of stock`;
                break;
        }
    });
    
    // Update recent orders table
    const recentOrdersTable = document.querySelector('.recent-orders tbody');
    if (recentOrdersTable) {
        const recentOrders = getRecentOrders(5);
        recentOrdersTable.innerHTML = recentOrders.map(order => `
            <tr class="border-t">
                <td class="p-4">#${order.id}</td>
                <td class="p-4">${order.userName}</td>
                <td class="p-4">₹${order.total.toLocaleString()}</td>
                <td class="p-4">
                    <span class="px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}">
                        ${order.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }
    
    // Update low stock products
    const lowStockTable = document.querySelector('.low-stock tbody');
    if (lowStockTable) {
        const lowStockProducts = getLowStockProducts(5);
        lowStockTable.innerHTML = lowStockProducts.map(product => `
            <tr class="border-t">
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        <img src="${product.image}" class="w-10 h-10 rounded-lg object-cover">
                        <div>
                            <p class="font-medium">${product.name}</p>
                            <p class="text-sm text-gray-500">${product.category}</p>
                        </div>
                    </div>
                </td>
                <td class="p-4">${product.stock} units</td>
                <td class="p-4">
                    <button onclick="updateProductStock('${product.id}', ${product.stock + 10})" 
                        class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                        Restock
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function generateNotifications() {
    const notifications = [];
    
    // Check low stock products
    const lowStockProducts = getLowStockProducts();
    if (lowStockProducts.length > 0) {
        notifications.push({
            type: 'warning',
            message: `${lowStockProducts.length} products are low in stock`,
            time: new Date().toISOString()
        });
    }
    
    // Check pending orders
    const pendingOrders = getAllOrders().filter(order => order.status === 'pending');
    if (pendingOrders.length > 0) {
        notifications.push({
            type: 'info',
            message: `${pendingOrders.length} orders pending processing`,
            time: new Date().toISOString()
        });
    }
    
    // Check new users
    const newUsers = Object.values(USERS).filter(user => {
        const userDate = new Date(user.createdAt);
        const today = new Date();
        return userDate.toDateString() === today.toDateString();
    });
    
    if (newUsers.length > 0) {
        notifications.push({
            type: 'success',
            message: `${newUsers.length} new users registered today`,
            time: new Date().toISOString()
        });
    }
    
    return notifications;
}

function updateNotificationCount() {
    const count = realTimeData.notifications.length;
    const countElement = document.getElementById('notificationCount');
    if (countElement) {
        countElement.textContent = count;
        countElement.classList.toggle('hidden', count === 0);
    }
} 