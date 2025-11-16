// Profile and Orders functionality
class ProfileOrdersSystem {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.orders = this.loadOrders();
        this.isOrdersVisible = false;
        this.init();
    }

    init() {
        this.updateAuthUI();
        this.setupProfileModal();
        this.setupOrdersSidebar();
        this.setupPaymentModal();
        this.setupEventListeners();
    }

    getCurrentUser() {
        const stored = localStorage.getItem('lazzyLatteCurrentUser');
        return stored ? JSON.parse(stored) : null;
    }

    loadOrders() {
        const stored = localStorage.getItem('lazzyLatteOrders');
        return stored ? JSON.parse(stored) : [];
    }

    saveOrders() {
        localStorage.setItem('lazzyLatteOrders', JSON.stringify(this.orders));
    }

    updateAuthUI() {
        if (this.currentUser) {
            this.updateBadges();
        } else {
            // Hide orders and profile icons if not logged in
            const ordersIcon = document.querySelector('.icon-orders');
            const profileIcon = document.querySelector('.icon-profile');
            const toggleOrders = document.querySelector('.toggle-orders');
            
            if (ordersIcon) ordersIcon.style.display = 'none';
            if (profileIcon) profileIcon.style.display = 'none';
            if (toggleOrders) toggleOrders.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Orders icon click
        const ordersIcon = document.querySelector('.icon-orders');
        if (ordersIcon) {
            ordersIcon.addEventListener('click', () => {
                this.toggleOrdersSidebar();
            });
        }

        // Profile icon click
        const profileIcon = document.querySelector('.icon-profile');
        if (profileIcon) {
            profileIcon.addEventListener('click', () => {
                this.openProfileModal();
            });
        }

        // Mobile toggle orders button
        const toggleOrders = document.querySelector('.toggle-orders');
        if (toggleOrders) {
            toggleOrders.addEventListener('click', () => {
                this.toggleOrdersSidebar();
            });
        }
    }

    updateBadges() {
        // Update orders badge
        const ordersBadge = document.querySelector('.orders-badge');
        const ordersBadgeCount = document.querySelector('.orders-badge-count');
        
        if (ordersBadge && ordersBadgeCount) {
            const userOrders = this.orders.filter(order => order.userId === this.currentUser?.id);
            const pendingOrders = userOrders.filter(order => 
                ['pending', 'confirmed', 'preparing'].includes(order.status)
            ).length;
            
            ordersBadge.textContent = pendingOrders;
            ordersBadgeCount.textContent = pendingOrders;
            ordersBadge.style.display = pendingOrders > 0 ? 'flex' : 'none';
        }
    }

    setupProfileModal() {
        // Create modal HTML if it doesn't exist
        if (!document.getElementById('profile-modal')) {
            const modal = document.createElement('div');
            modal.id = 'profile-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content profile-modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="profile-header">
                        <h2>MY PROFILE</h2>
                    </div>
                    <form id="profile-form" class="profile-form">
                        <div class="form-section">
                            <h3>Personal Information</h3>
                            <div class="form-group">
                                <label for="profile-name">Full Name</label>
                                <input type="text" id="profile-name" required>
                            </div>
                            <div class="form-group">
                                <label for="profile-email">Email</label>
                                <input type="email" id="profile-email" required>
                            </div>
                            <div class="form-group">
                                <label for="profile-phone">Phone Number</label>
                                <input type="tel" id="profile-phone" required>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Delivery Address</h3>
                            <div class="form-group">
                                <label for="profile-address">Street Address</label>
                                <input type="text" id="profile-address" required>
                            </div>
                            <div class="form-group">
                                <label for="profile-city">City</label>
                                <input type="text" id="profile-city" required>
                            </div>
                            <div class="form-group">
                                <label for="profile-state">State</label>
                                <input type="text" id="profile-state" required>
                            </div>
                            <div class="form-group">
                                <label for="profile-zip">ZIP Code</label>
                                <input type="text" id="profile-zip" required>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Preferences</h3>
                            <div class="form-group">
                                <label for="profile-allergies">Allergies or Dietary Restrictions</label>
                                <textarea id="profile-allergies" rows="3" placeholder="List any allergies or dietary restrictions..."></textarea>
                            </div>
                        </div>

                        <div class="profile-actions">
                            <button type="button" class="cancel-btn">CANCEL</button>
                            <button type="submit" class="save-btn">SAVE CHANGES</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            // Setup modal events
            this.setupProfileModalEvents();
        }
    }

    setupProfileModalEvents() {
        const modal = document.getElementById('profile-modal');
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const form = document.getElementById('profile-form');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    openProfileModal() {
        if (!this.currentUser) {
            this.showNotification('Please log in to access profile');
            setTimeout(() => {
                window.location.href = 'login-signup.html';
            }, 2000);
            return;
        }

        const modal = document.getElementById('profile-modal');
        this.loadProfileData();
        modal.style.display = 'block';
    }

    loadProfileData() {
        if (!this.currentUser) return;

        document.getElementById('profile-name').value = this.currentUser.name || '';
        document.getElementById('profile-email').value = this.currentUser.email || '';
        document.getElementById('profile-phone').value = this.currentUser.phone || '';
        document.getElementById('profile-address').value = this.currentUser.profile?.address || '';
        document.getElementById('profile-city').value = this.currentUser.profile?.city || '';
        document.getElementById('profile-state').value = this.currentUser.profile?.state || '';
        document.getElementById('profile-zip').value = this.currentUser.profile?.zipCode || '';
        document.getElementById('profile-allergies').value = this.currentUser.profile?.preferences?.allergies || '';
    }

    saveProfile() {
        if (!this.currentUser) return;

        // Update current user data
        this.currentUser.name = document.getElementById('profile-name').value;
        this.currentUser.phone = document.getElementById('profile-phone').value;
        this.currentUser.profile = {
            address: document.getElementById('profile-address').value,
            city: document.getElementById('profile-city').value,
            state: document.getElementById('profile-state').value,
            zipCode: document.getElementById('profile-zip').value,
            preferences: {
                allergies: document.getElementById('profile-allergies').value
            }
        };

        // Update in localStorage
        localStorage.setItem('lazzyLatteCurrentUser', JSON.stringify(this.currentUser));

        // Update in users array
        const users = JSON.parse(localStorage.getItem('lazzyLatteUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex > -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('lazzyLatteUsers', JSON.stringify(users));
        }

        // Show success message
        this.showNotification('Profile updated successfully!');
        
        // Close modal
        document.getElementById('profile-modal').style.display = 'none';
    }

    setupOrdersSidebar() {
        const closeOrdersBtn = document.querySelector('.close-orders');
        const refreshOrdersBtn = document.querySelector('.refresh-orders-btn');

        if (closeOrdersBtn) {
            closeOrdersBtn.addEventListener('click', () => {
                this.toggleOrdersSidebar(false);
            });
        }

        if (refreshOrdersBtn) {
            refreshOrdersBtn.addEventListener('click', () => {
                this.loadOrdersData();
                this.showNotification('Orders refreshed!');
            });
        }
    }

    toggleOrdersSidebar(show) {
        if (!this.currentUser) {
            this.showNotification('Please log in to view orders');
            setTimeout(() => {
                window.location.href = 'login-signup.html';
            }, 2000);
            return;
        }

        const sidebar = document.querySelector('.orders-sidebar');
        const container = document.querySelector('.menu-cart-container');
        
        if (show === undefined) {
            show = !this.isOrdersVisible;
        }

        this.isOrdersVisible = show;

        if (show) {
            this.loadOrdersData();
            sidebar.style.display = 'flex';
            if (window.innerWidth <= 768) {
                sidebar.classList.add('active');
            }
        } else {
            sidebar.style.display = 'none';
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        }

        this.updateContainerClasses();
    }

    loadOrdersData() {
        const ordersContainer = document.querySelector('.orders-items');
        if (!ordersContainer || !this.currentUser) return;

        const userOrders = this.orders.filter(order => order.userId === this.currentUser.id);

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-orders-message">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No orders yet</p>
                    <p style="font-size: 14px; margin-top: 10px;">Start shopping to see your orders here!</p>
                </div>
            `;
            return;
        }

        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        ordersContainer.innerHTML = userOrders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-id">Order #${order.id.slice(-6)}</div>
                    <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div class="order-status status-${order.status}">${order.status}</div>
                <div class="order-details">
                    <div class="order-item-list">${order.items.map(item => 
                        `${item.quantity}x ${item.name}${item.customizations && Object.keys(item.customizations).length > 0 ? 
                            ' (' + Object.values(item.customizations).join(', ') + ')' : ''}`
                    ).join(', ')}</div>
                </div>
                <div class="order-total">$${order.total.toFixed(2)}</div>
                <div class="order-actions">
                    ${order.status === 'pending' || order.status === 'confirmed' ? `
                        <button class="order-action-btn primary" onclick="profileOrders.cancelOrder('${order.id}')">Cancel Order</button>
                    ` : ''}
                    <button class="order-action-btn" onclick="profileOrders.viewOrderDetails('${order.id}')">View Details</button>
                </div>
            </div>
        `).join('');
    }

    // In profile-orders.js, modify the createOrder function
createOrder(cartItems, total, paymentMethod) {
    if (!this.currentUser) {
        this.showNotification('Please log in to place an order');
        return null;
    }

    const order = {
        id: 'ORD' + Date.now(),
        userId: this.currentUser.id,
        date: new Date().toISOString(),
        items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            customizations: item.customizations
        })),
        total: total,
        status: 'pending',
        paymentMethod: paymentMethod,
        address: this.currentUser.profile?.address || 'No address provided'
    };

    this.orders.push(order);
    this.saveOrders();

    // Update badges
    this.updateBadges();

    // Simulate order processing - STOP AT READY STATUS
    setTimeout(() => {
        this.updateOrderStatus(order.id, 'confirmed');
    }, 2000);

    setTimeout(() => {
        this.updateOrderStatus(order.id, 'preparing');
    }, 5000);

    setTimeout(() => {
        this.updateOrderStatus(order.id, 'ready');
        // Note: Points will be awarded when staff marks as completed in staff.html
    }, 10000);

    return order;
}
    updateOrderStatus(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            this.saveOrders();
            this.updateBadges();
            this.loadOrdersData(); // Refresh display
        }
    }

    cancelOrder(orderId) {
    this.showConfirmationModal({
        type: 'cancel-order',
        title: 'CANCEL ORDER',
        message: 'Are you sure you want to cancel this order?',
        icon: 'fas fa-times-circle',
        confirmText: 'YES, CANCEL',
        cancelText: 'KEEP ORDER',
        orderId: orderId,
        onConfirm: () => {
            this.updateOrderStatus(orderId, 'cancelled');
            this.showNotification('Order cancelled successfully');
        }
    });
}

// Enhanced logout confirmation
// Clean, bold logout confirmation
showLogoutConfirmation() {
    this.showConfirmationModal({
        type: 'logout',
        title: 'CONFIRM LOGOUT',
        message: 'Are you sure you want to log out of your account?',
        icon: 'fas fa-sign-out-alt',
        confirmText: 'LOGOUT',
        cancelText: 'CANCEL',
        onConfirm: () => {
            // Clear current user from localStorage
            localStorage.removeItem('lazzyLatteCurrentUser');
            
            // Show success message
            this.showNotification('Logged out successfully!');
            
            // Update UI
            this.updateAuthUI();
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login-signup.html';
            }, 1500);
        }
    });
}

// Universal confirmation modal method - CLEAN VERSION
showConfirmationModal(options) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('confirmation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmation-modal';
        modal.className = 'confirmation-modal';
        document.body.appendChild(modal);
    }

    const order = options.orderId ? this.orders.find(o => o.id === options.orderId) : null;
    
    modal.innerHTML = `
        <div class="confirmation-modal-content ${options.type}-modal">
            <div class="confirmation-modal-header">
                <i class="${options.icon} confirmation-icon"></i>
                <h3>${options.title}</h3>
            </div>
            <div class="confirmation-modal-body">
                <p class="confirmation-message">${options.message}</p>
                
                ${order ? `
                <div class="confirmation-details">
                    <p><strong>ORDER #${order.id.slice(-6)}</strong></p>
                    <p>${order.items.length} ITEM${order.items.length !== 1 ? 'S' : ''} • $${order.total.toFixed(2)}</p>
                    <p>${new Date(order.date).toLocaleDateString()}</p>
                </div>
                ` : ''}
                
                <div class="confirmation-actions">
                    <button class="cancel-confirm-btn">
                        <i class="fas fa-times"></i>
                        ${options.cancelText}
                    </button>
                    <button class="confirm-btn">
                        <i class="fas fa-check"></i>
                        ${options.confirmText}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'block';

    // Setup event listeners
    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-confirm-btn');

    const closeModal = () => {
        modal.style.display = 'none';
    };

    confirmBtn.addEventListener('click', () => {
        closeModal();
        if (options.onConfirm) {
            options.onConfirm();
        }
    });

    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}
// Universal confirmation modal method
showConfirmationModal(options) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('confirmation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmation-modal';
        modal.className = 'confirmation-modal';
        document.body.appendChild(modal);
    }

    const order = options.orderId ? this.orders.find(o => o.id === options.orderId) : null;
    
    modal.innerHTML = `
        <div class="confirmation-modal-content ${options.type}-modal">
            <div class="confirmation-modal-header">
                <div class="confirmation-icon">
                    <i class="${options.icon}"></i>
                </div>
                <h3>${options.title}</h3>
            </div>
            <div class="confirmation-modal-body">
                <p class="confirmation-message">${options.message}</p>
                
                ${order ? `
                <div class="confirmation-details">
                    <p><strong>Order #${order.id.slice(-6)}</strong></p>
                    <p>${order.items.length} item${order.items.length !== 1 ? 's' : ''} • $${order.total.toFixed(2)}</p>
                    <p>Placed on ${new Date(order.date).toLocaleDateString()}</p>
                </div>
                ` : ''}
                
                <div class="confirmation-actions">
                    <button class="cancel-confirm-btn">
                        <i class="fas fa-times"></i>
                        ${options.cancelText}
                    </button>
                    <button class="confirm-btn">
                        <i class="fas fa-check"></i>
                        ${options.confirmText}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'block';

    // Setup event listeners
    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-confirm-btn');

    const closeModal = () => {
        modal.style.display = 'none';
    };

    confirmBtn.addEventListener('click', () => {
        modal.classList.add('success');
        setTimeout(() => {
            closeModal();
            if (options.onConfirm) {
                options.onConfirm();
            }
        }, 500);
    });

    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Update the setupEventListeners method to use the new logout confirmation
setupEventListeners() {
    // Orders icon click
    const ordersIcon = document.querySelector('.icon-orders');
    if (ordersIcon) {
        ordersIcon.addEventListener('click', () => {
            this.toggleOrdersSidebar();
        });
    }

    // Profile icon click
    const profileIcon = document.querySelector('.icon-profile');
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            this.openProfileModal();
        });
    }

    // Mobile toggle orders button
    const toggleOrders = document.querySelector('.toggle-orders');
    if (toggleOrders) {
        toggleOrders.addEventListener('click', () => {
            this.toggleOrdersSidebar();
        });
    }

    // Enhanced logout functionality
    const logoutIcon = document.querySelector('.icon-logout');
    const sidebarLogoutBtn = document.getElementById('sidebar-logout-btn');
    
    if (logoutIcon) {
        logoutIcon.addEventListener('click', () => {
            this.showLogoutConfirmation();
        });
    }
    
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', () => {
            this.showLogoutConfirmation();
        });
    }
}

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            const details = order.items.map(item => 
                `${item.quantity}x ${item.name} - $${item.price.toFixed(2)}${item.customizations && Object.keys(item.customizations).length > 0 ? 
                    '\n  Customizations: ' + Object.entries(item.customizations).map(([key, value]) => `${key}: ${value}`).join(', ') : ''}`
            ).join('\n');
            
            alert(`Order Details:\n\n${details}\n\nTotal: $${order.total.toFixed(2)}\nStatus: ${order.status}\nPayment: ${order.paymentMethod}\nAddress: ${order.address}`);
        }
    }

    setupPaymentModal() {
        // Override the existing checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCheckout();
            });
        }
    }

    handleCheckout() {
        if (!this.currentUser) {
            this.showNotification('Please log in to checkout');
            setTimeout(() => {
                window.location.href = 'login-signup.html';
            }, 2000);
            return;
        }

        if (cart.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }

        // Check if user has address set
        if (!this.currentUser.profile?.address) {
            if (confirm('Please set your delivery address first. Open profile settings?')) {
                this.openProfileModal();
            }
            return;
        }

        this.openPaymentModal();
    }

    openPaymentModal() {
        // Create payment modal
        const modal = document.createElement('div');
        modal.id = 'payment-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content payment-modal-content">
                <span class="close-modal">&times;</span>
                <div class="customization-form">
                    <div class="customization-header">
                        <h3>CHECKOUT</h3>
                        <div class="customization-price">$${this.calculateCartTotal().toFixed(2)}</div>
                    </div>
                    
                    <div class="payment-summary">
                        <h4>Order Summary</h4>
                        ${cart.map(item => `
                            <div class="payment-summary-item">
                                <span>${item.quantity}x ${item.name}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div class="payment-summary-item payment-total">
                            <span>Total</span>
                            <span>$${this.calculateCartTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="payment-methods">
                        <div class="payment-method" data-method="card">
                            <input type="radio" name="payment-method" id="payment-card">
                            <i class="fas fa-credit-card payment-icon"></i>
                            <div>
                                <div>Credit/Debit Card</div>
                                <small>Pay with your card</small>
                            </div>
                        </div>
                        
                        <div class="payment-method" data-method="cash">
                            <input type="radio" name="payment-method" id="payment-cash">
                            <i class="fas fa-money-bill payment-icon"></i>
                            <div>
                                <div>Cash on Delivery</div>
                                <small>Pay when you receive</small>
                            </div>
                        </div>
                    </div>

                    <div class="payment-details" id="card-details">
                        <div class="form-group">
                            <label>Card Number</label>
                            <input type="text" placeholder="1234 5678 9012 3456" maxlength="19">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Expiry Date</label>
                                <input type="text" placeholder="MM/YY" maxlength="5">
                            </div>
                            <div class="form-group">
                                <label>CVV</label>
                                <input type="text" placeholder="123" maxlength="3">
                            </div>
                        </div>
                    </div>

                    <button class="add-to-cart-btn" id="complete-payment">COMPLETE PAYMENT</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Setup payment modal events
        this.setupPaymentModalEvents(modal);
    }

    setupPaymentModalEvents(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        const paymentMethods = modal.querySelectorAll('.payment-method');
        const completeBtn = modal.querySelector('#complete-payment');

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
                method.querySelector('input').checked = true;

                // Show/hide card details
                const cardDetails = document.getElementById('card-details');
                if (method.getAttribute('data-method') === 'card') {
                    cardDetails.classList.add('active');
                } else {
                    cardDetails.classList.remove('active');
                }
            });
        });

        completeBtn.addEventListener('click', () => {
            this.processPayment(modal);
        });
    }

    processPayment(modal) {
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedMethod) {
            this.showNotification('Please select a payment method');
            return;
        }

        const paymentMethod = selectedMethod.id.replace('payment-', '');

        // Validate card details if paying by card
        if (paymentMethod === 'card') {
            const cardNumber = document.querySelector('#card-details input[type="text"]').value;
            if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
                this.showNotification('Please enter a valid card number');
                return;
            }
        }

        // Create order
        const order = this.createOrder(cart, this.calculateCartTotal(), paymentMethod);

        if (order) {
            this.showNotification(`Order placed successfully! Order #${order.id.slice(-6)}`);
            
            // Clear cart
            cart = [];
            updateCartDisplay();
            updateCartBadge();
            updateMobileToggleButton();
            
            // Close modal
            modal.remove();
            
            // Show orders sidebar
            this.toggleOrdersSidebar(true);
        }
    }

    calculateCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateContainerClasses() {
        const container = document.querySelector('.menu-cart-container');
        const cartVisible = document.querySelector('.cart-sidebar').style.display === 'flex' || 
                           document.querySelector('.cart-sidebar').classList.contains('active');
        const favoritesVisible = document.querySelector('.favorites-sidebar').style.display === 'flex' || 
                                document.querySelector('.favorites-sidebar').classList.contains('active');
        const ordersVisible = this.isOrdersVisible;

        // Remove all layout classes
        container.classList.remove(
            'both-hidden', 'cart-hidden', 'favorites-hidden', 'orders-hidden',
            'cart-favorites-visible', 'cart-orders-visible', 'favorites-orders-visible',
            'all-visible'
        );

        // Apply appropriate class based on visible sidebars
        if (!cartVisible && !favoritesVisible && !ordersVisible) {
            container.classList.add('both-hidden');
        } else if (cartVisible && !favoritesVisible && !ordersVisible) {
            container.classList.add('favorites-hidden', 'orders-hidden');
        } else if (!cartVisible && favoritesVisible && !ordersVisible) {
            container.classList.add('cart-hidden', 'orders-hidden');
        } else if (!cartVisible && !favoritesVisible && ordersVisible) {
            container.classList.add('cart-hidden', 'favorites-hidden');
        } else if (cartVisible && favoritesVisible && !ordersVisible) {
            container.classList.add('cart-favorites-visible');
        } else if (cartVisible && !favoritesVisible && ordersVisible) {
            container.classList.add('cart-orders-visible');
        } else if (!cartVisible && favoritesVisible && ordersVisible) {
            container.classList.add('favorites-orders-visible');
        } else if (cartVisible && favoritesVisible && ordersVisible) {
            container.classList.add('all-visible');
        }
    }

    showNotification(message) {
        // Use existing notification function or create new one
        if (typeof showNotification === 'function') {
            showNotification(message);
        } else {
            alert(message);
        }
    }
}

// Initialize profile and orders system
const profileOrders = new ProfileOrdersSystem();