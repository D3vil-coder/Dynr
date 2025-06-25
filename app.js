// Dynr App JavaScript
class DynrApp {
    constructor() {
        this.currentRestaurant = null;
        this.cart = [];
        this.selectedTable = null;
        this.activeFilters = {
            category: 'all',
            dietary: [],
          
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.populateRestaurants();
        this.setMinDate();
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchRestaurants(e.target.value);
        });

        // Navigation
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showPage('restaurantPage');
        });

        // Header action buttons
        document.getElementById('tableBtn').addEventListener('click', () => {
            this.showTableModal();
        });

        document.getElementById('cartBtn').addEventListener('click', () => {
            this.showCartModal();
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Bottom sheet close
        document.getElementById('closeDishSheet').addEventListener('click', () => {
            this.closeBottomSheet();
        });

        // Modal backdrop close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Bottom sheet backdrop close
        document.querySelector('.bottom-sheet-backdrop').addEventListener('click', () => {
            this.closeBottomSheet();
        });

        // Forms
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBooking();
        });

        document.getElementById('confirmTable').addEventListener('click', () => {
            this.confirmTableSelection();
        });

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleFilterClick(e.target);
            }
        });
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('bookingDate').min = today;
    }

    populateRestaurants() {
        const grid = document.getElementById('restaurantsGrid');
        grid.innerHTML = '';

        restaurantData.restaurants.forEach(restaurant => {
            const card = this.createRestaurantCard(restaurant);
            grid.appendChild(card);
        });
    }

    createRestaurantCard(restaurant) {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.dataset.restaurantId = restaurant.id;

        const stars = this.generateStars(restaurant.rating);
        const parkingClass = restaurant.parkingAvailable ? 'available' : 'unavailable';
        const parkingIcon = restaurant.parkingAvailable ? 'check-circle' : 'x-circle';
        const parkingText = restaurant.parkingAvailable ? 'Parking Available' : 'No Parking';

        card.innerHTML = `
            <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
            <div class="restaurant-info">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                <div class="restaurant-details">
                    <div class="wait-time">
                        <i class="ri-time-line"></i>
                        <span>${restaurant.waitingTime}</span>
                    </div>
                    <div class="parking-status ${parkingClass}">
                        
                        <div class="Park">${parkingText}</div>
                    </div>
                </div>
                <div class="restaurant-actions">
                    <button class="book-table-btn btn  " data-restaurant-id="${restaurant.id}">
                        <i data-feather="calendar"></i>
                        Reserve Table
                    </button>
                </div>
            </div>
        `;

        // Card click navigates to menu (except booking button)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.book-table-btn')) {
                this.openRestaurantMenu(restaurant);
            }
        });

        // Booking button click
        const bookBtn = card.querySelector('.book-table-btn');
        bookBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.currentRestaurant = restaurant;
            this.showBookingModal();
        });

        return card;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHtml = '';

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i data-feather="star" class="star"></i>';
        }

        if (hasHalfStar) {
            starsHtml += '<i data-feather="star" class="star"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i data-feather="star" class="star empty"></i>';
        }

        return starsHtml;
    }

    searchRestaurants(query) {
        const cards = document.querySelectorAll('.restaurant-card');
        cards.forEach(card => {
            const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
            const cuisine = card.querySelector('.restaurant-cuisine').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();

            if (name.includes(searchQuery) || cuisine.includes(searchQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    openRestaurantMenu(restaurant) {
        this.currentRestaurant = restaurant;
        this.populateRestaurantInfo(restaurant);
        this.populateMenuItems(restaurant.id);
        this.showPage('menuPage');
    }

    populateRestaurantInfo(restaurant) {
        
        const stars = this.generateStars(restaurant.rating);

        
        const curre =document.getElementById('curr-rest');
        curre.innerHTML =`<h2>${restaurant.name}</h2>`;

        setTimeout(() => feather.replace(), 0);
    }

    populateMenuItems(restaurantId) {
        const container = document.getElementById('menuItems');
        const menuItems = restaurantData.menuItems[restaurantId] || [];

        container.innerHTML = '';

        if (menuItems.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">No menu items available</p>';
            return;
        }

        menuItems.forEach(item => {
            const itemElement = this.createMenuItem(item);
            container.appendChild(itemElement);
        });

        setTimeout(() => feather.replace(), 0);
    }

    createMenuItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.dataset.itemId = item.id;

        const vegClass = item.isVeg ? 'veg' : 'non-veg';
        const stars = this.generateStars(item.rating);

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-content">
                <h4 class="menu-item-name">${item.name}</h4>
                <div class="menu-item-description">${item.description}</div>
                <div class="menu-item-details">
                    <div class="menu-item-meta">
                    <span>
                        <i class="ri-user-line"></i>
                        ${item.serves}</span><span>
                        <i class="ri-time-line"></i>
                        ${item.waitingTime}</span>
                    </div>
                    <div class="menu-item-price">₹${item.price}</div>
                </div>
            </div>
        `;

        itemDiv.addEventListener('click', () => {
            this.showDishBottomSheet(item);
        });

        return itemDiv;
    }

    showDishBottomSheet(item) {
        const bottomSheet = document.getElementById('dishBottomSheet');
        const body = document.getElementById('dishSheetBody');

        const vegClass = item.isVeg ? 'veg' : 'non-veg';
        const stars = this.generateStars(item.rating);

        // Create allergen tags
        const allergenTags = item.allergens.map(allergen => 
            `<span class="allergen-tag">${allergen}</span>`
        ).join('');

        // Create dietary info badges
        const dietaryBadges = item.dietaryInfo.map(info => 
            `<span class="dietary-badge">${info}</span>`
        ).join('');

        body.innerHTML = `
            <div class="dish-image-container">
                <img src="${item.image}" alt="${item.name}" class="dish-image">
            </div>
            <div class="dish-content">
                <div class="dish-header">
                    <h3 class="dish-name">${item.name}</h3>
                    <div class="dish-price">₹${item.price}</div>
                </div>
                
                <div class="dish-meta">
                    
                   
                    <span class="serves-info"><i class="ri-user-line"></i>${item.serves}</span>
                    <span class="time-info"><i class="ri-time-line"></i>${item.waitingTime}</span>
                </div>
                
                <div class="dish-description">${item.description}</div>
                
                <div class="nutrition-section">
                    <h4>Nutritional Information</h4>
                    <div class="nutrition-grid">
                        <div class="nutrition-item">
                            <span class="nutrition-label">Calories</span>
                            <span class="nutrition-value">${item.nutrition.calories}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Protein</span>
                            <span class="nutrition-value">${item.nutrition.protein}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Carbs</span>
                            <span class="nutrition-value">${item.nutrition.carbs}</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="nutrition-label">Fat</span>
                            <span class="nutrition-value">${item.nutrition.fat}</span>
                        </div>
                    </div>
                </div>
                
                ${item.allergens.length > 0 ? `
                <div class="allergens-section">
                    <h4>Allergen Information</h4>
                    <div class="allergen-tags">
                        ${allergenTags}
                    </div>
                </div>
                ` : ''}
                
                ${item.dietaryInfo.length > 0 ? `
                <div class="dietary-section">
                    <h4>Dietary Information</h4>
                    <div class="dietary-badges">
                        ${dietaryBadges}
                    </div>
                </div>
                ` : ''}
                
                <div class="special-instructions">
                    <h4>Special Instructions</h4>
                    <textarea class="form-control" placeholder="Any special requests for this dish..." rows="3"></textarea>
                </div>
                
                <div class="scheduling-section">
                    <h4>When would you like this?</h4>
                    <div class="schedule-options">
                        <button class="schedule-btn active" data-schedule="now">Order Now</button>
                        <button class="schedule-btn" data-schedule="30min">In 30 minutes</button>
                        <button class="schedule-btn" data-schedule="next-meal">With next meal</button>
                    </div>
                </div>
                
                <div class="quantity-section">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="app.changeQuantity(-1, ${item.id})">
                            <i data-feather="minus"></i>
                        </button>
                        <span class="quantity-display" id="quantity-${item.id}">1</span>
                        <button class="quantity-btn" onclick="app.changeQuantity(1, ${item.id})">
                            <i data-feather="plus"></i>
                        </button>
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" onclick="app.addToCart(${item.id})">
                        
                        Add to Cart-<span>₹</span><span id="total-price-${item.id}">${item.price}</span>
                    </button>
                </div>
            </div>
        `;

        // Add schedule button event listeners
        body.querySelectorAll('.schedule-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                body.querySelectorAll('.schedule-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        this.showBottomSheet(bottomSheet);
        setTimeout(() => feather.replace(), 0);
    }

    changeQuantity(delta, itemId) {
        const quantityElement = document.getElementById(`quantity-${itemId}`);
        const totalPriceElement = document.getElementById(`total-price-${itemId}`);
        let quantity = parseInt(quantityElement.textContent) + delta;
        quantity = Math.max(1, quantity);
        quantityElement.textContent = quantity;
        
        // Update total price
        const item = this.findMenuItem(itemId);
        if (item && totalPriceElement) {
            totalPriceElement.textContent = item.price * quantity;
        }
    }

    addToCart(itemId) {
        const item = this.findMenuItem(itemId);
        const quantityElement = document.getElementById(`quantity-${itemId}`);
        const quantity = parseInt(quantityElement.textContent);

        if (item) {
            const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.cart.push({
                    ...item,
                    quantity: quantity
                });
            }

            this.updateCartCount();
            this.showSuccessMessage('Item added to cart!');
            this.closeBottomSheet();
        }
    }

    findMenuItem(itemId) {
        for (const restaurantId in restaurantData.menuItems) {
            const item = restaurantData.menuItems[restaurantId].find(item => item.id === itemId);
            if (item) return item;
        }
        return null;
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const countElement = document.getElementById('cartCount');
        countElement.textContent = totalItems > 0 ? totalItems : '';
    }

    showCartModal() {
        const modal = document.getElementById('cartModal');
        const itemsContainer = document.getElementById('cartItems');
        const summaryContainer = document.getElementById('cartSummary');

        if (this.cart.length === 0) {
            itemsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: var(--space-xl);">Your cart is empty</p>';
            summaryContainer.innerHTML = '';
        } else {
            itemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        
                    </div>
                    <div class="cart-item-controls">
                        <div class="cart-quantity-controls">
                            <button class="btn btn-secondary" onclick="app.updateCartItem(${item.id}, -1)">
                                <i data-feather="minus"></i>
                            </button>
                            <span class="cart-quantity">${item.quantity}</span>
                            <button class="btn btn-secondary" onclick="app.updateCartItem(${item.id}, 1)">
                                <i data-feather="plus"></i>
                            </button>
                        </div>
                        <div class="cart-item-total">₹${item.price * item.quantity}</div>
                        <button class="btn btn-secondary remove-btn" onclick="app.removeFromCart(${item.id})">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = Math.round(subtotal * 0.18);
            const delivery = 40;
            const total = subtotal + tax + delivery;

            summaryContainer.innerHTML = `
                <div class="cart-summary-details">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>₹${subtotal}</span>
                    </div>
                    <div class="summary-row">
                        <span>Service Charge:</span>
                        <span>₹${delivery}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (18%):</span>
                        <span>₹${tax}</span>
                    </div>
                    <div class="summary-row total-row">
                        <span>Total:</span>
                        <span>₹${total}</span>
                    </div>
                    <button class="btn btn-primary btn-full-width" onclick="app.placeOrder()">
                        <i data-feather="credit-card"></i>
                        Place Order - ₹${total}
                    </button>
                </div>
            `;
        }

        this.showModal(modal);
        setTimeout(() => feather.replace(), 0);
    }

    updateCartItem(itemId, delta) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                this.updateCartCount();
                this.showCartModal();
            }
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCartCount();
        this.showCartModal();
    }

    placeOrder() {
        if (this.cart.length === 0) return;

        this.cart = [];
        this.updateCartCount();
        this.closeModal(document.getElementById('cartModal'));
        this.showSuccessMessage('Order placed successfully! Your food will be ready soon.');
    }

    showTableModal() {
        const modal = document.getElementById('tableModal');
        const grid = document.getElementById('tablesGrid');

        grid.innerHTML = '';

        restaurantData.tables.forEach(table => {
            const tableDiv = document.createElement('div');
            tableDiv.className = `table-option ${table.available ? '' : 'unavailable'}`;
            tableDiv.dataset.tableId = table.id;

            tableDiv.innerHTML = `
                <div class="table-name">${table.name}</div>
                <div class="table-seats">${table.seats} seats</div>
            `;

            if (table.available) {
                tableDiv.addEventListener('click', () => {
                    document.querySelectorAll('.table-option').forEach(t => t.classList.remove('selected'));
                    tableDiv.classList.add('selected');
                    this.selectedTable = table;
                    document.getElementById('confirmTable').disabled = false;
                });
            }

            grid.appendChild(tableDiv);
        });

        this.showModal(modal);
    }

    confirmTableSelection() {
        if (this.selectedTable) {
            this.closeModal(document.getElementById('tableModal'));
            this.showSuccessMessage(`${this.selectedTable.name} (${this.selectedTable.seats} seats) selected successfully!`);
        }
    }

    showBookingModal() {
        this.showModal(document.getElementById('bookingModal'));
    }

    handleBooking() {
        const bookingData = {
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            people: document.getElementById('bookingPeople').value,
            name: document.getElementById('bookingName').value,
            phone: document.getElementById('bookingPhone').value,
            special: document.getElementById('bookingSpecial').value,
            restaurant: this.currentRestaurant.name
        };

        console.log('Booking submitted:', bookingData);
        
        this.closeModal(document.getElementById('bookingModal'));
        this.showSuccessMessage(`Table reserved successfully at ${this.currentRestaurant.name}!`);
        
        document.getElementById('bookingForm').reset();
    }

    handleFilterClick(button) {
        const filterType = button.closest('.filters-section');
        const filterValue = button.dataset.filter;

        if (filterType.querySelector('h4').textContent === 'Categories') {
            // Category filter - single selection
            filterType.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            this.activeFilters.category = filterValue;
        } else {
            // Other filters - multiple selection
            button.classList.toggle('active');
            if (filterType.querySelector('h4').textContent === 'Dietary') {
                if (button.classList.contains('active')) {
                    if (!this.activeFilters.dietary.includes(filterValue)) {
                        this.activeFilters.dietary.push(filterValue);
                    }
                } else {
                    this.activeFilters.dietary = this.activeFilters.dietary.filter(f => f !== filterValue);
                }
            } 
        }

        this.applyFilters();
    }

    applyFilters() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemData = this.findMenuItem(parseInt(item.dataset.itemId));
            let shouldShow = true;

            // Category filter
            if (this.activeFilters.category !== 'all' && itemData.category !== this.activeFilters.category) {
                shouldShow = false;
            }

            // Dietary filters
            if (this.activeFilters.dietary.length > 0) {
                const hasDietaryMatch = this.activeFilters.dietary.some(diet => 
                    itemData.dietaryInfo.includes(diet)
                );
                if (!hasDietaryMatch) {
                    shouldShow = false;
                }
            }

            
            

            item.style.display = shouldShow ? 'block' : 'none';
            
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    }

    showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showBottomSheet(bottomSheet) {
        bottomSheet.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeBottomSheet() {
        const bottomSheet = document.getElementById('dishBottomSheet');
        bottomSheet.classList.remove('active');
        document.body.style.overflow = '';
    }

    showSuccessMessage(message) {
        const animation = document.getElementById('successAnimation');
        const messageElement = document.getElementById('successMessage');
        
        messageElement.textContent = message;
        animation.classList.add('active');
        
        setTimeout(() => {
            animation.classList.remove('active');
        }, 3000);
    }
}

// Restaurant data from provided JSON
const restaurantData = {
    "restaurants": [
        {
            "id": 1,
            "name": "Spice Symphony",
            "cuisine": "North Indian",
            "address": "Block A, Central Plaza, MG Road",
            "image": "https://assets.architecturaldigest.in/photos/64f85037ec0bc118bdd98aba/16:9/w_2560%2Cc_limit/Untitled%2520design%2520(14).png",
            "rating": 4.6,
            "waitingTime": "15-20 mins",
            "parkingAvailable": true,
            "priceRange": "₹₹"
        },
        {
            "id": 2,
            "name": "Ocean Breeze",
            "cuisine": "Coastal",
            "address": "Marina Drive, Sea View Complex",
            "image": "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=500&h=300&fit=crop",
            "rating": 4.8,
            "waitingTime": "25-30 mins",
            "parkingAvailable": true,
            "priceRange": "₹₹₹"
        },
        {
            "id": 3,
            "name": "Dragon's Den",
            "cuisine": "Chinese",
            "address": "Chinatown Square, Heritage Street",
            "image": "https://assets.architecturaldigest.in/photos/6385cf3311f0276636badfb6/16:9/w_1280,c_limit/DSC_8367-Edit-W.png",
            "rating": 4.4,
            "waitingTime": "18-22 mins",
            "parkingAvailable": false,
            "priceRange": "₹₹"
        },
        {
            "id": 4,
            "name": "Bella Vista",
            "cuisine": "Italian",
            "address": "Wine Street, Downtown District",
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop",
            "rating": 4.7,
            "waitingTime": "20-25 mins",
            "parkingAvailable": true,
            "priceRange": "₹₹₹"
        },
        {
            "id": 5,
            "name": "Sakura Gardens",
            "cuisine": "Japanese",
            "address": "Cherry Blossom Lane, East Side",
            "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop",
            "rating": 4.5,
            "waitingTime": "22-28 mins",
            "parkingAvailable": true,
            "priceRange": "₹₹₹"
        },
        {
            "id": 6,
            "name": "Café Monet",
            "cuisine": "French",
            "address": "Art District, Gallery Road",
            "image": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&h=300&fit=crop",
            "rating": 4.9,
            "waitingTime": "30-35 mins",
            "parkingAvailable": false,
            "priceRange": "₹₹₹₹"
        }
    ],
    "menuItems": {
        "1": [
            {
                "id": 101,
                "name": "Butter Chicken",
                "category": "Main Course",
                "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
                "price": 320,
                "serves": "2-3 people",
                "waitingTime": "25 mins",
                "isVeg": false,
                "rating": 4.6,
                "description": "Tender chicken cooked in rich tomato gravy with butter, cream and aromatic spices",
                "nutrition": {"calories": 380, "protein": "28g", "carbs": "15g", "fat": "24g"},
                "allergens": ["dairy", "nuts"],
                "dietaryInfo": ["gluten-free"]
            },
            {
                "id": 102,
                "name": "Paneer Makhani",
                "category": "Main Course", 
                "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
                "price": 280,
                "serves": "2 people",
                "waitingTime": "20 mins",
                "isVeg": true,
                "rating": 4.4,
                "description": "Cottage cheese cubes in creamy tomato-based sauce with traditional spices",
                "nutrition": {"calories": 320, "protein": "18g", "carbs": "22g", "fat": "20g"},
                "allergens": ["dairy"],
                "dietaryInfo": ["vegetarian"]
            },
            {
                "id": 103,
                "name": "Garlic Naan",
                "category": "Breads",
                "image": "https://www.foodandwine.com/thmb/p4rUCAMj19VAnaC1-eyVHO_EyAY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/FAW-recipes-garlic-naan-hero-01-c32b9ab2f7884f9686fa0d1258e1a645.jpg",
                "price": 80,
                "serves": "1-2 people",
                "waitingTime": "12 mins",
                "isVeg": true,
                "rating": 4.3,
                "description": "Freshly baked bread topped with garlic, herbs and butter",
                "nutrition": {"calories": 220, "protein": "6g", "carbs": "38g", "fat": "6g"},
                "allergens": ["gluten", "dairy"],
                "dietaryInfo": ["vegetarian"]
            },
            {
                "id": 104,
                "name": "Dal Makhani",
                "category": "Main Course",
                "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
                "price": 240,
                "serves": "2-3 people",
                "waitingTime": "18 mins",
                "isVeg": true,
                "rating": 4.5,
                "description": "Slow-cooked black lentils in creamy tomato sauce with butter and spices",
                "nutrition": {"calories": 290, "protein": "14g", "carbs": "32g", "fat": "12g"},
                "allergens": ["dairy"],
                "dietaryInfo": ["vegetarian", "protein-rich"]
            },
            {
                "id": 105,
                "name": "Chicken Biryani",
                "category": "Rice",
                "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoIycguxFgTpIN3L00tYQhJ2WkypXj5w_QkQ&s",
                "price": 350,
                "serves": "1-2 people",
                "waitingTime": "30 mins",
                "isVeg": false,
                "rating": 4.7,
                "description": "Fragrant basmati rice cooked with tender chicken and aromatic spices",
                "nutrition": {"calories": 480, "protein": "32g", "carbs": "58g", "fat": "16g"},
                "allergens": ["dairy"],
                "dietaryInfo": ["spicy"]
            },
            {
                "id": 106,
                "name": "Samosa Chaat",
                "category": "Appetizers",
                "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
                "price": 150,
                "serves": "1 person",
                "waitingTime": "15 mins",
                "isVeg": true,
                "rating": 4.2,
                "description": "Crispy samosas topped with tangy chutneys, yogurt and spices",
                "nutrition": {"calories": 280, "protein": "8g", "carbs": "35g", "fat": "12g"},
                "allergens": ["gluten", "dairy"],
                "dietaryInfo": ["vegetarian", "spicy"]
            },
            {
                "id": 107,
                "name": "Gulab Jamun",
                "category": "Desserts",
                "image": "https://bakewithzoha.com/wp-content/uploads/2023/04/gulab-jamun-featured.jpg",
                "price": 120,
                "serves": "2 pieces",
                "waitingTime": "5 mins",
                "isVeg": true,
                "rating": 4.4,
                "description": "Soft milk dumplings soaked in cardamom-flavored sugar syrup",
                "nutrition": {"calories": 300, "protein": "4g", "carbs": "45g", "fat": "12g"},
                "allergens": ["dairy", "gluten"],
                "dietaryInfo": ["vegetarian", "sweet"]
            },
            {
                "id": 108,
                "name": "Masala Chai",
                "category": "Beverages",
                "image": "https://goqii.com/blog/wp-content/uploads/shutterstock_1024718095-1024x682.jpg",
                "price": 60,
                "serves": "1 cup",
                "waitingTime": "8 mins",
                "isVeg": true,
                "rating": 4.3,
                "description": "Traditional spiced tea brewed with milk and aromatic spices",
                "nutrition": {"calories": 80, "protein": "3g", "carbs": "12g", "fat": "3g"},
                "allergens": ["dairy"],
                "dietaryInfo": ["vegetarian"]
            }
        ],
        "2": [
            {
                "id": 201,
                "name": "Grilled Fish Curry",
                "category": "Main Course",
                "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
                "price": 420,
                "serves": "1-2 people",
                "waitingTime": "25 mins",
                "isVeg": false,
                "rating": 4.8,
                "description": "Fresh fish grilled and cooked in coconut-based coastal curry",
                "nutrition": {"calories": 380, "protein": "35g", "carbs": "12g", "fat": "22g"},
                "allergens": ["fish"],
                "dietaryInfo": ["gluten-free", "spicy"]
            },
            {
                "id": 202,
                "name": "Prawn Koliwada",
                "category": "Appetizers",
                "image": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
                "price": 380,
                "serves": "2-3 people",
                "waitingTime": "20 mins",
                "isVeg": false,
                "rating": 4.6,
                "description": "Crispy fried prawns tossed with onions, peppers and coastal spices",
                "nutrition": {"calories": 320, "protein": "28g", "carbs": "18g", "fat": "16g"},
                "allergens": ["shellfish", "gluten"],
                "dietaryInfo": ["spicy"]
            },
            {
                "id": 203,
                "name": "Coconut Rice",
                "category": "Rice",
                "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
                "price": 180,
                "serves": "1-2 people",
                "waitingTime": "15 mins",
                "isVeg": true,
                "rating": 4.4,
                "description": "Fragrant rice cooked with fresh coconut and coastal spices",
                "nutrition": {"calories": 250, "protein": "5g", "carbs": "45g", "fat": "8g"},
                "allergens": [],
                "dietaryInfo": ["vegetarian", "vegan", "gluten-free"]
            },
            {
                "id": 204,
                "name": "Sol Kadhi",
                "category": "Beverages",
                "image": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
                "price": 80,
                "serves": "1 glass",
                "waitingTime": "5 mins",
                "isVeg": true,
                "rating": 4.3,
                "description": "Refreshing drink made with coconut milk and kokum",
                "nutrition": {"calories": 60, "protein": "1g", "carbs": "8g", "fat": "3g"},
                "allergens": [],
                "dietaryInfo": ["vegetarian", "vegan", "cooling"]
            }
        ],
        "3": [
            {
                "id": 301,
                "name": "Kung Pao Chicken",
                "category": "Main Course",
                "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
                "price": 320,
                "serves": "2 people",
                "waitingTime": "22 mins",
                "isVeg": false,
                "rating": 4.5,
                "description": "Stir-fried chicken with peanuts, vegetables and spicy sauce",
                "nutrition": {"calories": 360, "protein": "26g", "carbs": "20g", "fat": "18g"},
                "allergens": ["nuts", "soy"],
                "dietaryInfo": ["spicy"]
            },
            {
                "id": 302,
                "name": "Mapo Tofu",
                "category": "Main Course",
                "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
                "price": 260,
                "serves": "2 people",
                "waitingTime": "18 mins",
                "isVeg": true,
                "rating": 4.3,
                "description": "Silky tofu in spicy Sichuan sauce with ground meat",
                "nutrition": {"calories": 240, "protein": "16g", "carbs": "15g", "fat": "14g"},
                "allergens": ["soy"],
                "dietaryInfo": ["vegetarian", "spicy"]
            },
            {
                "id": 303,
                "name": "Spring Rolls",
                "category": "Appetizers",
                "image": "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop",
                "price": 180,
                "serves": "4 pieces",
                "waitingTime": "15 mins",
                "isVeg": true,
                "rating": 4.2,
                "description": "Crispy rolls filled with fresh vegetables and served with sweet sauce",
                "nutrition": {"calories": 200, "protein": "6g", "carbs": "28g", "fat": "8g"},
                "allergens": ["gluten"],
                "dietaryInfo": ["vegetarian"]
            }
        ]
    },
    "tables": [
        {"id": 1, "name": "Table 1", "seats": 2, "available": true},
        {"id": 2, "name": "Table 2", "seats": 4, "available": true},
        {"id": 3, "name": "Table 3", "seats": 6, "available": false},
        {"id": 4, "name": "Table 4", "seats": 2, "available": true},
        {"id": 5, "name": "Table 5", "seats": 4, "available": true},
        {"id": 6, "name": "Table 6", "seats": 8, "available": true},
        {"id": 7, "name": "Table 7", "seats": 6, "available": false},
        {"id": 8, "name": "Table 8", "seats": 2, "available": true}
    ]
};

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DynrApp();
});