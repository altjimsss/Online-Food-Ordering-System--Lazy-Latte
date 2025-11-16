// Global cart array to store items
let cart = [];
let favorites = [];
let isCartVisible = false;
let isFavoritesVisible = false;
let currentMenuData = [];
let currentCustomizationItem = null;
let isOrdersVisible = false;
let isProfileVisible = false;
let currentLeaderboardPeriod = 'weekly';

// ============================================================================
// LOCALSTORAGE PERSISTENCE FUNCTIONS
// ============================================================================

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('lazzyLatteCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('lazzyLatteCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save favorites to localStorage
function saveFavoritesToStorage() {
    localStorage.setItem('lazzyLatteFavorites', JSON.stringify(favorites));
}

// Load favorites from localStorage
function loadFavoritesFromStorage() {
    const savedFavorites = localStorage.getItem('lazzyLatteFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

// ============================================================================
// DYNAMIC PROFILE IMAGE BASED ON USER LEVEL
// ============================================================================

// Function to get profile image based on user level
function getProfileImageByLevel(userLevel) {
    switch(userLevel) {
        case "Sleepy Starter":
            return "img/clock.png";
        case "Gentle Drip":
            return "img/hot-drink.png";
        case "Slow Pourer":
            return "img/slow-pourer.png";
        case "Cozy Bean":
            return "img/cozy-bean.png";
        case "Chill Brewer":
            return "img/chill-brewer.png";
        case "Dreamy Drinker":
            return "img/dreamy-drinker.png";
        case "Mellow Mug":
            return "img/mellow-mug.png";
        case "Serene Sipper":
            return "img/serene-sipper.png";
        case "Legendary Lounger":
            return "img/legendary-lounger.png";
        case "The Ultimate Chiller":
            return "img/ultimate-chiller.png";
        default:
            return ""; 
    }
}

// Function to update profile image in the profile sidebar
function updateProfileImage() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Get user level based on points
    const userPoints = currentUser.points?.total || 0;
    const userLevel = getUserLevel(userPoints);
    
    // Get appropriate profile image
    const profileImage = getProfileImageByLevel(userLevel);
    
    // Update profile image in the sidebar
    const profileImageElement = document.getElementById('profile-sidebar-image');
    if (profileImageElement) {
        if (profileImage) {
            // If we have a specific image for this level
            profileImageElement.innerHTML = `<img src="${profileImage}" alt="${userLevel}" class="level-profile-image">`;
        } else {
            // Default blank profile with initials
            const initials = currentUser.name ? 
                currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
            profileImageElement.innerHTML = `<div class="profile-initials">${initials}</div>`;
        }
        
        // Update level badge
        const levelBadge = document.getElementById('profile-level-badge');
        if (levelBadge) {
            levelBadge.textContent = userLevel;
        }
    }
}

// Function to update profile image in the modal (if needed)
function updateProfileModalImage() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userPoints = currentUser.points?.total || 0;
    const userLevel = getUserLevel(userPoints);
    const profileImage = getProfileImageByLevel(userLevel);
    
    const modalProfileImage = document.getElementById('modal-profile-image');
    if (modalProfileImage) {
        if (profileImage) {
            modalProfileImage.innerHTML = `<img src="${profileImage}" alt="${userLevel}" class="level-profile-image">`;
        } else {
            const initials = currentUser.name ? 
                currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
            modalProfileImage.innerHTML = `<div class="profile-initials">${initials}</div>`;
        }
    }
}

// ============================================================================
// CONFETTI FUNCTIONALITY
// ============================================================================

function triggerConfetti() {
    confetti({
        particleCount: 300,
        spread: 200,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#000000', '#ffffff'],
        gravity: 0.8,
        scalar: 1.2
    });
}

// ============================================================================
// USER NAME DISPLAY FUNCTIONALITY
// ============================================================================

// Display user name in home section
function displayUserName() {
    const currentUser = getCurrentUser();
    const userNameDisplay = document.getElementById('user-name-display');
    
    if (currentUser && userNameDisplay) {
        userNameDisplay.textContent = `, ${currentUser.name}`;
        userNameDisplay.style.fontSize = 'inherit';
        userNameDisplay.style.fontWeight = 'inherit';
        userNameDisplay.style.color = '#fff';
        userNameDisplay.style.marginLeft = '10px';
        userNameDisplay.style.textTransform = 'capitalize';
    } else if (userNameDisplay) {
        userNameDisplay.textContent = '';
    }
}

// Mobile menu functionality
const hamburgerMenu = document.querySelector('.hamburger-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const closeMobileMenu = document.querySelector('.close-mobile-menu');
const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');

// Toggle mobile menu
hamburgerMenu.addEventListener('click', function() {
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMobileMenu.addEventListener('click', function() {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close mobile menu when clicking on a nav button
mobileNavBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Update active state
        mobileNavBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Navigate to section
        const id = this.innerText.toLowerCase().replace(" ", "");
        const target = document.getElementById(id);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: "smooth"
            });
        }
    });
});

// Close mobile menu when clicking outside
mobileMenuOverlay.addEventListener('click', function(e) {
    if (e.target === mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Scroll progress bar
window.addEventListener("scroll", () => {
    const bar = document.querySelector(".scroll-progress");
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max) * 100 + "%";
});

// Section highlight
const sections = document.querySelectorAll("section");
const navBtns = document.querySelectorAll(".nav-btn");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
        const top = window.scrollY;
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        if (top >= offset && top < offset + height) current = sec.id;
    });
    navBtns.forEach(btn => {
        btn.classList.remove("active");
        if (btn.innerText.replace(" ", "").toLowerCase() === current) {
            btn.classList.add("active");
        }
    });
    
    // Update mobile nav buttons
    mobileNavBtns.forEach(btn => {
        btn.classList.remove("active");
        if (btn.innerText.replace(" ", "").toLowerCase() === current) {
            btn.classList.add("active");
        }
    });
});

// Smooth nav scroll
navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.innerText.toLowerCase().replace(" ", "");
        const target = document.getElementById(id);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: "smooth"
            });
        }
    });
});

// Logo collapse functionality
const navLogo = document.getElementById('nav-logo');
const navCenter = document.querySelector('.nav-center');

if (navLogo && navCenter) {
    navLogo.addEventListener('click', function(e) {
        e.stopPropagation();
        navCenter.classList.toggle('collapsed');
    });
}

// Fade carousel
const imgs = document.querySelectorAll(".carousel-img");
const progress = document.querySelector(".carousel-progress-fill");
let i = 0;
const speed = 5000;

function nextImg() {
    imgs[i].classList.remove("active");
    i = (i + 1) % imgs.length;
    imgs[i].classList.add("active");

    progress.style.transition = "none";
    progress.style.width = "0%";
    setTimeout(() => {
        progress.style.transition = `width ${speed}ms linear`;
        progress.style.width = "100%";
    }, 10);
}

// Start bar once loaded
setTimeout(() => {
    progress.style.transition = `width ${speed}ms linear`;
    progress.style.width = "100%";
}, 50);

setInterval(nextImg, speed);

// Menu loading functionality - ENSURE LATEST DATA IS LOADED
async function loadMenu(category = "COFFEE") {
    const menuContainer = document.getElementById("menu-container");
    menuContainer.innerHTML = "<p style='padding:20px;font-weight:bold;'>Loading...</p>";
    
    try {
        let menuData;
        
        // Check if there's an admin-modified menu in localStorage
        const storedMenu = localStorage.getItem('lazzyLatteMenu');
        if (storedMenu) {
            // Use the admin-modified menu
            menuData = JSON.parse(storedMenu);
            console.log('Loaded menu from localStorage (admin modifications)');
        } else {
            // Fall back to the original menu.json - ADD CACHE BUSTER
            const res = await fetch("menu.json?v=" + Date.now());
            if (!res.ok) {
                throw new Error('Failed to load menu');
            }
            menuData = await res.json();
            console.log('Loaded menu from menu.json (original with ratings)');
        }

        const filtered = menuData.menu.filter(item => item.category === category);
        currentMenuData = filtered;

        if (filtered.length === 0) {
            menuContainer.innerHTML = "<p style='padding:20px;font-weight:bold;'>No items found</p>";
            return;
        }

        renderMenuItems(filtered);

    } catch (error) {
        menuContainer.innerHTML = "<p style='padding:20px;color:red;'>Error loading menu</p>";
        console.error("Menu load error:", error);
    }
}

// Render menu items - FIXED RATING DISPLAY
function renderMenuItems(items, searchTerm = "") {
    const menuContainer = document.getElementById("menu-container");
    
    if (items.length === 0) {
        menuContainer.innerHTML = "<p class='no-results'>No items found matching your search.</p>";
        return;
    }

    menuContainer.innerHTML = items.map(item => {
        const name = highlightSearchTerm(item.name, searchTerm);
        const description = highlightSearchTerm(item.description, searchTerm);
        const displayPrice = `₱${item.basePrice.toFixed(2)}`;
        
        // Generate star rating HTML - FIXED: Use item.rating directly
        const rating = item.rating || 0;
        const reviewCount = item.reviewCount || 0;
        const starsHTML = generateStarRating(rating);
        
        return `
            <div class="menu-item" data-item='${JSON.stringify(item).replace(/'/g, "&#39;")}'>
                <img src="${item.image}" class="menu-img" alt="${item.name}">
                <div class="menu-info">
                    <h3>${name}</h3>
                    <p>${description}</p>
                    <div class="menu-rating">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="rating-value">${rating.toFixed(1)}</span>
                        <span class="review-count">(${reviewCount})</span>
                    </div>
                </div>
                <span class="menu-price">${displayPrice}</span>
                <i class="fas fa-heart favorite-icon"
   style="color: ${isItemInFavorites(item) ? '#ff0000' : '#ffffff'};
          cursor: pointer;
          text-shadow:
             -2px -2px 0 #000,
              2px -2px 0 #000,
             -2px  2px 0 #000,
              2px  2px 0 #000,
              0px  2px 0 #000,
              2px  0px 0 #000,
             -2px  0px 0 #000,
              0px -2px 0 #000;"
   title="${isItemInFavorites(item) ? 'Remove from favorites' : 'Add to favorites'}"></i>

            </div>
        `;
    }).join("");

    // Add click event to menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const itemData = JSON.parse(this.getAttribute('data-item').replace(/&#39;/g, "'"));
            openCustomizationModal(itemData);
        });
    });

    // Add event listener for favorite icons
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const menuItem = this.closest('.menu-item');
            const itemData = JSON.parse(menuItem.getAttribute('data-item').replace(/&#39;/g, "'"));
            toggleFavorite(itemData, this);
        });
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Highlight search terms
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.shop-search');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            const activePill = document.querySelector('.pill.active');
            if (activePill) {
                loadMenu(activePill.textContent);
            }
            return;
        }

        const filteredItems = currentMenuData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );

        renderMenuItems(filteredItems, searchTerm);
    });
}

// Check if item is in favorites
function isItemInFavorites(item) {
    return favorites.some(fav => fav.name === item.name);
}

// Toggle favorite item - UPDATED WITH LOCALSTORAGE
function toggleFavorite(item, iconElement) {
    const existingIndex = favorites.findIndex(fav => fav.name === item.name);
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        if (iconElement) {
            iconElement.style.color = '#ffffffff';
            iconElement.title = 'Add to favorites';
            showNotification(`${item.name} removed from favorites!`);
        }
    } else {
        favorites.push({
            id: Date.now(),
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            image: item.image,
            customizations: item.customizations || {}
        });
        if (iconElement) {
            iconElement.style.color = '#ff0000ff';
            iconElement.title = 'Remove from favorites';
            showNotification(`${item.name} added to favorites!`);
        }
    }
    
    // Save to localStorage
    saveFavoritesToStorage();
    
    updateFavoritesDisplay();
    updateFavoritesBadge();
    updateMobileToggleFavoritesButton();
}

// Calculate total price with customizations
function calculateTotalPrice(item, selectedOptions) {
    let total = item.basePrice;
    
    Object.keys(selectedOptions).forEach(category => {
        const optionIndex = selectedOptions[category].index;
        total += selectedOptions[category].price;
    });
    
    return total;
}

// Format price display
function formatPrice(price) {
    if (price === 0) return 'Included';
    if (price > 0) return `+₱${price.toFixed(2)}`;
    return `-₱${Math.abs(price).toFixed(2)}`;
}

// Open customization modal with dynamic pricing
function openCustomizationModal(item) {
    currentCustomizationItem = item;
    const modal = document.getElementById('customization-modal');
    
    // Calculate base display price
    const baseDisplayPrice = `₱${item.basePrice.toFixed(2)}`;
    
    // Create compact modal structure
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="customization-form">
                <div class="customization-header">
                    <h3 id="modal-item-name">${item.name}</h3>
                    <div class="customization-price" id="modal-item-price">${baseDisplayPrice}</div>
                </div>
                <div class="customization-options-container">
                    <div class="customization-options-grid" id="customization-options">
                        <!-- Options will be populated here -->
                    </div>
                </div>
                <button class="add-to-cart-btn" id="modal-add-to-cart">Add to Cart - ${baseDisplayPrice}</button>
            </div>
        </div>
    `;
    
    const customizationOptions = document.getElementById('customization-options');
    const selectedOptions = {};
    
    // Build compact customization options
    Object.keys(item.customizations).forEach(category => {
        const customization = item.customizations[category];
        const options = customization.options;
        const prices = customization.prices;
        
        const optionElement = document.createElement('div');
        optionElement.className = 'customization-option';
        optionElement.innerHTML = `
            <h4>${category}</h4>
            <div class="option-buttons" data-category="${category}">
                ${options.map((option, index) => {
                    const price = prices[index];
                    const priceDisplay = formatPrice(price);
                    const priceClass = price > 0 ? 'positive' : price < 0 ? 'negative' : '';
                    return `
                        <button class="option-btn ${index === 0 ? 'selected' : ''}" 
                                data-category="${category}" 
                                data-option="${option}"
                                data-price="${price}"
                                data-index="${index}">
                            ${option}
                            <span class="option-price ${priceClass}">${priceDisplay}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
        customizationOptions.appendChild(optionElement);
        
        // Set default selected option
        selectedOptions[category] = {
            option: options[0],
            price: prices[0],
            index: 0
        };
    });
    
    // Set up event listeners for option buttons
    modal.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const option = this.getAttribute('data-option');
            const price = parseFloat(this.getAttribute('data-price'));
            const index = parseInt(this.getAttribute('data-index'));
            
            // Deselect all buttons in this category
            this.parentElement.querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });
            
            // Select clicked button
            this.classList.add('selected');
            
            // Update selected options
            selectedOptions[category] = { option, price, index };
            
            // Update total price display
            updateModalPriceDisplay(item, selectedOptions);
        });
    });
    
    // Set up add to cart button
    const addToCartBtn = modal.querySelector('#modal-add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        addToCartWithCustomizations(item, selectedOptions);
        modal.style.display = 'none';
        
        if (!isCartVisible) {
            toggleCart();
        }
        
        showNotification(`${item.name} added to cart!`);
    });
    
    // Set up close modal events
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    modal.style.display = 'block';
    
    // Auto-scroll to top of options container
    const optionsContainer = modal.querySelector('.customization-options-container');
    if (optionsContainer) {
        optionsContainer.scrollTop = 0;
    }
}

// Update modal price display
function updateModalPriceDisplay(item, selectedOptions) {
    const totalPrice = calculateTotalPrice(item, selectedOptions);
    const modalPrice = document.getElementById('modal-item-price');
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    
    modalPrice.textContent = `₱${totalPrice.toFixed(2)}`;
    addToCartBtn.textContent = `Add to Cart - ₱${totalPrice.toFixed(2)}`;
}

// Add to cart with customizations - UPDATED WITH LOCALSTORAGE
function addToCartWithCustomizations(item, selectedOptions) {
    const totalPrice = calculateTotalPrice(item, selectedOptions);
    
    // Format customizations for display
    const customizations = {};
    Object.keys(selectedOptions).forEach(category => {
        customizations[category] = selectedOptions[category].option;
    });
    
    // Check if item with same customizations already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.name === item.name && 
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
    );
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name: item.name,
            description: item.description,
            price: totalPrice,
            basePrice: item.basePrice,
            image: item.image,
            customizations: customizations,
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCartToStorage();
    
    updateCartDisplay();
    updateCartBadge();
    updateMobileToggleButton();
}

// Cart toggle functionality
const cartIcon = document.querySelector('.icon-cart');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const toggleCartBtn = document.querySelector('.toggle-cart');
const cartBadgeCount = document.querySelector('.cart-badge-count');
const menuCartContainer = document.querySelector('.menu-cart-container');

// Favorites toggle functionality
const favoritesIcon = document.querySelector('.icon-heart');
const favoritesSidebar = document.querySelector('.favorites-sidebar');
const closeFavoritesBtn = document.querySelector('.close-favorites');
const toggleFavoritesBtn = document.querySelector('.toggle-favorites');
const favoritesBadgeCount = document.querySelector('.favorites-badge-count');

// Orders toggle functionality
const ordersIcon = document.querySelector('.icon-orders');
const ordersSidebar = document.querySelector('.orders-sidebar');
const closeOrdersBtn = document.querySelector('.close-orders');
const toggleOrdersBtn = document.querySelector('.toggle-orders');
const ordersBadgeCount = document.querySelector('.orders-badge-count');

// Profile toggle functionality
const profileIcon = document.querySelector('.icon-profile');
const profileSidebar = document.querySelector('.profile-sidebar');
const closeProfileBtn = document.querySelector('.close-profile');
const toggleProfileBtn = document.querySelector('.toggle-profile');

// Logout functionality
const logoutIcon = document.querySelector('.icon-logout');

// Toggle cart visibility
function toggleCart() {
    if (window.innerWidth <= 768) {
        isCartVisible = !isCartVisible;
        cartSidebar.classList.toggle('active', isCartVisible);
        
        if (isCartVisible && (isFavoritesVisible || isOrdersVisible || isProfileVisible)) {
            if (isFavoritesVisible) {
                isFavoritesVisible = false;
                favoritesSidebar.classList.remove('active');
                updateFavoritesIcon();
                updateMobileToggleFavoritesButton();
            }
            if (isOrdersVisible) {
                isOrdersVisible = false;
                ordersSidebar.classList.remove('active');
                updateOrdersIcon();
                updateMobileToggleOrdersButton();
            }
            if (isProfileVisible) {
                isProfileVisible = false;
                profileSidebar.classList.remove('active');
                updateProfileIcon();
                updateMobileToggleProfileButton();
            }
        }
    } else {
        isCartVisible = !isCartVisible;
        if (isCartVisible) {
            cartSidebar.style.display = 'flex';
        } else {
            cartSidebar.style.display = 'none';
        }
        
        if (isCartVisible && (isFavoritesVisible || isOrdersVisible || isProfileVisible)) {
            if (isFavoritesVisible) {
                isFavoritesVisible = false;
                favoritesSidebar.style.display = 'none';
                updateFavoritesIcon();
                updateMobileToggleFavoritesButton();
            }
            if (isOrdersVisible) {
                isOrdersVisible = false;
                ordersSidebar.style.display = 'none';
                updateOrdersIcon();
                updateMobileToggleOrdersButton();
            }
            if (isProfileVisible) {
                isProfileVisible = false;
                profileSidebar.style.display = 'none';
                updateProfileIcon();
                updateMobileToggleProfileButton();
            }
        }
    }
    
    updateContainerClasses();
    updateCartIcon();
    updateMobileToggleButton();
}

// Toggle favorites visibility
function toggleFavorites() {
    if (window.innerWidth <= 768) {
        isFavoritesVisible = !isFavoritesVisible;
        favoritesSidebar.classList.toggle('active', isFavoritesVisible);
        
        if (isFavoritesVisible && (isCartVisible || isOrdersVisible || isProfileVisible)) {
            if (isCartVisible) {
                isCartVisible = false;
                cartSidebar.classList.remove('active');
                updateCartIcon();
                updateMobileToggleButton();
            }
            if (isOrdersVisible) {
                isOrdersVisible = false;
                ordersSidebar.classList.remove('active');
                updateOrdersIcon();
                updateMobileToggleOrdersButton();
            }
            if (isProfileVisible) {
                isProfileVisible = false;
                profileSidebar.classList.remove('active');
                updateProfileIcon();
                updateMobileToggleProfileButton();
            }
        }
    } else {
        isFavoritesVisible = !isFavoritesVisible;
        if (isFavoritesVisible) {
            favoritesSidebar.style.display = 'flex';
        } else {
            favoritesSidebar.style.display = 'none';
        }
        
        if (isFavoritesVisible && (isCartVisible || isOrdersVisible || isProfileVisible)) {
            if (isCartVisible) {
                isCartVisible = false;
                cartSidebar.style.display = 'none';
                updateCartIcon();
                updateMobileToggleButton();
            }
            if (isOrdersVisible) {
                isOrdersVisible = false;
                ordersSidebar.style.display = 'none';
                updateOrdersIcon();
                updateMobileToggleOrdersButton();
            }
            if (isProfileVisible) {
                isProfileVisible = false;
                profileSidebar.style.display = 'none';
                updateProfileIcon();
                updateMobileToggleProfileButton();
            }
        }
    }
    
    updateContainerClasses();
    updateFavoritesIcon();
    updateMobileToggleFavoritesButton();
}

// Toggle orders visibility
function toggleOrders() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Please log in to view orders');
        setTimeout(() => {
            window.location.href = 'login-signup.html';
        }, 2000);
        return;
    }

    if (window.innerWidth <= 768) {
        isOrdersVisible = !isOrdersVisible;
        ordersSidebar.classList.toggle('active', isOrdersVisible);
        
        if (isOrdersVisible && (isCartVisible || isFavoritesVisible || isProfileVisible)) {
            if (isCartVisible) {
                isCartVisible = false;
                cartSidebar.classList.remove('active');
                updateCartIcon();
                updateMobileToggleButton();
            }
            if (isFavoritesVisible) {
                isFavoritesVisible = false;
                favoritesSidebar.classList.remove('active');
                updateFavoritesIcon();
                updateMobileToggleFavoritesButton();
            }
            if (isProfileVisible) {
                isProfileVisible = false;
                profileSidebar.classList.remove('active');
                updateProfileIcon();
                updateMobileToggleProfileButton();
            }
        }
    } else {
        isOrdersVisible = !isOrdersVisible;
        if (isOrdersVisible) {
            ordersSidebar.style.display = 'flex';
            loadOrdersData();
        } else {
            ordersSidebar.style.display = 'none';
        }
        
        if (isOrdersVisible && (isCartVisible || isFavoritesVisible || isProfileVisible)) {
            if (isCartVisible) {
                isCartVisible = false;
                cartSidebar.style.display = 'none';
                updateCartIcon();
                updateMobileToggleButton();
            }
            if (isFavoritesVisible) {
                isFavoritesVisible = false;
                favoritesSidebar.style.display = 'none';
                updateFavoritesIcon();
                updateMobileToggleFavoritesButton();
            }
            if (isProfileVisible) {
                isProfileVisible = false;
                profileSidebar.style.display = 'none';
                updateProfileIcon();
                updateMobileToggleProfileButton();
            }
        }
    }
    
    updateContainerClasses();
    updateOrdersIcon();
    updateMobileToggleOrdersButton();
}

// Toggle profile visibility - SIMPLE VERSION
function toggleProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Please log in to access profile');
        setTimeout(() => {
            window.location.href = 'login-signup.html';
        }, 2000);
        return;
    }

    isProfileVisible = !isProfileVisible;
    
    if (window.innerWidth <= 768) {
        // Mobile behavior
        profileSidebar.classList.toggle('active', isProfileVisible);
        
        // Close other sidebars when opening profile
        if (isProfileVisible) {
            if (isCartVisible) {
                isCartVisible = false;
                cartSidebar.classList.remove('active');
                updateCartIcon();
            }
            if (isFavoritesVisible) {
                isFavoritesVisible = false;
                favoritesSidebar.classList.remove('active');
                updateFavoritesIcon();
            }
            if (isOrdersVisible) {
                isOrdersVisible = false;
                ordersSidebar.classList.remove('active');
                updateOrdersIcon();
            }
            loadProfileSidebarData();
        }
    } else {
        // Desktop behavior
        profileSidebar.style.display = isProfileVisible ? 'flex' : 'none';
        if (isProfileVisible) {
            loadProfileSidebarData();
        }
    }
    
    updateContainerClasses();
    updateProfileIcon();
}

// Close profile button
closeProfileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    isProfileVisible = false;
    
    if (window.innerWidth <= 768) {
        profileSidebar.classList.remove('active');
    } else {
        profileSidebar.style.display = 'none';
    }
    
    updateContainerClasses();
    updateProfileIcon();
});

// Update window resize handler for profile sidebar
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        // Desktop behavior
        cartSidebar.style.display = isCartVisible ? 'flex' : 'none';
        favoritesSidebar.style.display = isFavoritesVisible ? 'flex' : 'none';
        ordersSidebar.style.display = isOrdersVisible ? 'flex' : 'none';
        profileSidebar.style.display = isProfileVisible ? 'flex' : 'none';
        
        cartSidebar.classList.remove('active');
        favoritesSidebar.classList.remove('active');
        ordersSidebar.classList.remove('active');
        profileSidebar.classList.remove('active');
    } else {
        // Mobile behavior
        cartSidebar.style.display = isCartVisible ? 'flex' : 'none';
        favoritesSidebar.style.display = isFavoritesVisible ? 'flex' : 'none';
        ordersSidebar.style.display = isOrdersVisible ? 'flex' : 'none';
        profileSidebar.style.display = isProfileVisible ? 'flex' : 'none';
        
        cartSidebar.classList.toggle('active', isCartVisible);
        favoritesSidebar.classList.toggle('active', isFavoritesVisible);
        ordersSidebar.classList.toggle('active', isOrdersVisible);
        profileSidebar.classList.toggle('active', isProfileVisible);
    }
    
    updateContainerClasses();
    updateCartIcon();
    updateFavoritesIcon();
    updateOrdersIcon();
    updateProfileIcon();
});

// Update container classes
function updateContainerClasses() {
    // Remove all existing classes first
    menuCartContainer.classList.remove(
        'both-hidden', 'cart-hidden', 'favorites-hidden', 'orders-hidden', 'profile-hidden',
        'cart-favorites-visible', 'cart-orders-visible', 'favorites-orders-visible',
        'cart-profile-visible', 'favorites-profile-visible', 'orders-profile-visible',
        'cart-favorites-orders-visible', 'cart-favorites-profile-visible', 
        'cart-orders-profile-visible', 'favorites-orders-profile-visible',
        'all-visible'
    );

    // Mobile behavior - simpler approach
    if (window.innerWidth <= 768) {
        if (!isCartVisible && !isFavoritesVisible && !isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('both-hidden');
        }
        // On mobile, we don't need complex grid classes since sidebars take full width
    } else {
        // Desktop behavior with profile sidebar
        if (!isCartVisible && !isFavoritesVisible && !isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('both-hidden');
        } 
        // Single sidebar visible
        else if (isCartVisible && !isFavoritesVisible && !isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('favorites-hidden', 'orders-hidden', 'profile-hidden');
        } else if (!isCartVisible && isFavoritesVisible && !isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('cart-hidden', 'orders-hidden', 'profile-hidden');
        } else if (!isCartVisible && !isFavoritesVisible && isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('cart-hidden', 'favorites-hidden', 'profile-hidden');
        } else if (!isCartVisible && !isFavoritesVisible && !isOrdersVisible && isProfileVisible) {
            menuCartContainer.classList.add('cart-hidden', 'favorites-hidden', 'orders-hidden');
        }
        // Two sidebars visible
        else if (isCartVisible && isFavoritesVisible && !isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('cart-favorites-visible');
        } else if (isCartVisible && !isFavoritesVisible && isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('cart-orders-visible');
        } else if (isCartVisible && !isFavoritesVisible && !isOrdersVisible && isProfileVisible) {
            menuCartContainer.classList.add('cart-profile-visible');
        } else if (!isCartVisible && isFavoritesVisible && isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('favorites-orders-visible');
        } else if (!isCartVisible && isFavoritesVisible && !isOrdersVisible && isProfileVisible) {
            menuCartContainer.classList.add('favorites-profile-visible');
        } else if (!isCartVisible && !isFavoritesVisible && isOrdersVisible && isProfileVisible) {
            menuCartContainer.classList.add('orders-profile-visible');
        }
        // Three sidebars visible
        else if (isCartVisible && isFavoritesVisible && isOrdersVisible && !isProfileVisible) {
            menuCartContainer.classList.add('cart-favorites-orders-visible');
        } else if (isCartVisible && isFavoritesVisible && !isOrdersVisible && isProfileVisible) {
            menuCartContainer.classList.add('cart-favorites-profile-visible');
        } else if (isCartVisible && !isFavoritesVisible && isOrdersVisible && isProfileVisible) {
            menuCartContainer.classList.add('cart-orders-profile-visible');
        } else if (!isCartVisible && isFavoritesVisible && isOrdersVisible && isProfileVisible) {
            menuCartContainer.classList.add('favorites-orders-profile-visible');
        }
        // All four sidebars visible
        else if (isCartVisible && isFavoritesVisible && isOrdersVisible && isProfileVisible) {
            menuCartContainer.classList.add('all-visible');
        }
    }
}

// Update cart icon appearance
function updateCartIcon() {
    if (isCartVisible) {
        cartIcon.style.color = '#ff0000';
        cartIcon.style.transform = 'scale(1.1)';
    } else {
        cartIcon.style.color = '#ffffff';
        cartIcon.style.transform = 'scale(1)';
    }
    
    setTimeout(() => {
        cartIcon.style.transform = '';
    }, 300);
}

// Update favorites icon appearance
function updateFavoritesIcon() {
    if (isFavoritesVisible) {
        favoritesIcon.style.color = '#ff0000';
        favoritesIcon.style.transform = 'scale(1.1)';
    } else {
        favoritesIcon.style.color = '#ffffff';
        favoritesIcon.style.transform = 'scale(1)';
    }
    
    setTimeout(() => {
        favoritesIcon.style.transform = '';
    }, 300);
}

// Update orders icon appearance
function updateOrdersIcon() {
    if (isOrdersVisible) {
        ordersIcon.style.color = '#ff0000';
        ordersIcon.style.transform = 'scale(1.1)';
    } else {
        ordersIcon.style.color = '#ffffff';
        ordersIcon.style.transform = 'scale(1)';
    }
    
    setTimeout(() => {
        ordersIcon.style.transform = '';
    }, 300);
}

// Update profile icon appearance
function updateProfileIcon() {
    if (isProfileVisible) {
        profileIcon.style.color = '#ff0000';
        profileIcon.style.transform = 'scale(1.1)';
    } else {
        profileIcon.style.color = '#ffffff';
        profileIcon.style.transform = 'scale(1)';
    }
    
    setTimeout(() => {
        profileIcon.style.transform = '';
    }, 300);
}

// Update mobile toggle button
function updateMobileToggleButton() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadgeCount.textContent = totalItems;
    
    if (isCartVisible) {
        toggleCartBtn.innerHTML = `<i class="fas fa-times"></i> Hide Cart (${totalItems})`;
    } else {
        toggleCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> View Cart (${totalItems})`;
    }
}

// Update mobile toggle favorites button
function updateMobileToggleFavoritesButton() {
    const totalFavorites = favorites.length;
    favoritesBadgeCount.textContent = totalFavorites;
    
    if (isFavoritesVisible) {
        toggleFavoritesBtn.innerHTML = `<i class="fas fa-times"></i> Hide Favorites (${totalFavorites})`;
    } else {
        toggleFavoritesBtn.innerHTML = `<i class="fas fa-heart"></i> View Favorites (${totalFavorites})`;
    }
}

// Update mobile toggle orders button
function updateMobileToggleOrdersButton() {
    const totalOrders = getCurrentUser() ? getOrders().filter(order => order.userId === getCurrentUser().id).length : 0;
    ordersBadgeCount.textContent = totalOrders;
    
    if (isOrdersVisible) {
        toggleOrdersBtn.innerHTML = `<i class="fas fa-times"></i> Hide Orders (${totalOrders})`;
    } else {
        toggleOrdersBtn.innerHTML = `<i class="fas fa-clipboard-list"></i> View Orders (${totalOrders})`;
    }
}

// Update mobile toggle profile button
function updateMobileToggleProfileButton() {
    if (isProfileVisible) {
        toggleProfileBtn.innerHTML = `<i class="fas fa-times"></i> Hide Profile`;
    } else {
        toggleProfileBtn.innerHTML = `<i class="fas fa-user"></i> View Profile`;
    }
}

// Cart icon click event
cartIcon.addEventListener('click', toggleCart);

// Favorites icon click event
favoritesIcon.addEventListener('click', toggleFavorites);

// Orders icon click event
ordersIcon.addEventListener('click', toggleOrders);

// Profile icon click event
profileIcon.addEventListener('click', toggleProfile);

// Logout icon click event
logoutIcon.addEventListener('click', handleLogout);

// Mobile toggle button click events
toggleCartBtn.addEventListener('click', function() {
    toggleCart();
});

toggleFavoritesBtn.addEventListener('click', function() {
    toggleFavorites();
});

toggleOrdersBtn.addEventListener('click', function() {
    toggleOrders();
});

// Profile toggle button click event
toggleProfileBtn.addEventListener('click', function() {
    toggleProfile();
});

// Close cart button (mobile)
closeCartBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
        isCartVisible = false;
        cartSidebar.classList.remove('active');
        updateContainerClasses();
        updateCartIcon();
        updateMobileToggleButton();
    }
});

// Close favorites button (mobile)
closeFavoritesBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
        isFavoritesVisible = false;
        favoritesSidebar.classList.remove('active');
        updateContainerClasses();
        updateFavoritesIcon();
        updateMobileToggleFavoritesButton();
    }
});

// Close orders button (mobile)
closeOrdersBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
        isOrdersVisible = false;
        ordersSidebar.classList.remove('active');
        updateContainerClasses();
        updateOrdersIcon();
        updateMobileToggleOrdersButton();
    }
});

// Close profile button (mobile) - UPDATED
closeProfileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
        isProfileVisible = false;
        profileSidebar.classList.remove('active');
        updateContainerClasses();
        updateProfileIcon();
        updateMobileToggleProfileButton();
    }
});

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotalElement.textContent = 'Total: ₱0.00';
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                ${Object.keys(item.customizations).length > 0 ? 
                    `<p style="font-size:11px; color:#888;">${Object.entries(item.customizations).map(([key, value]) => 
                        `${key}: ${value}`
                    ).join(', ')}</p>` : ''
                }
                <div class="cart-item-price">₱${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                    <button class="remove-item" title="Remove item">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update total
    cartTotalElement.textContent = `Total: ₱${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.closest('.cart-item').getAttribute('data-item-id'));
            updateCartQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.closest('.cart-item').getAttribute('data-item-id'));
            updateCartQuantity(itemId, 1);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.closest('.cart-item').getAttribute('data-item-id'));
            removeFromCart(itemId);
        });
    });
}

// Update favorites display
function updateFavoritesDisplay() {
    const favoritesItemsContainer = document.querySelector('.favorites-items');
    
    if (favorites.length === 0) {
        favoritesItemsContainer.innerHTML = `
            <div class="empty-favorites-message">
                <i class="fas fa-heart"></i>
                <p>Your favorites is empty</p>
            </div>
        `;
        return;
    }
    
    // Update favorites items
    favoritesItemsContainer.innerHTML = favorites.map(item => `
        <div class="favorite-item" data-item-id="${item.id}">
            <div class="favorite-item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="favorite-item-price">₱${item.basePrice.toFixed(2)}</div>
                <div style="display: flex; gap: 10px; margin-top: 8px;">
                    <button class="add-to-cart-from-favorites" data-item='${JSON.stringify(item).replace(/'/g, "&#39;")}' style="padding: 5px 10px; background: #ff0000; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">Customize & Add</button>
                    <button class="remove-favorite" title="Remove from favorites">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.closest('.favorite-item').getAttribute('data-item-id'));
            removeFromFavorites(itemId);
        });
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart-from-favorites').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemData = JSON.parse(this.getAttribute('data-item').replace(/&#39;/g, "'"));
            openCustomizationModal(itemData);
        });
    });
}

// Load orders data
function loadOrdersData() {
    const ordersContainer = document.querySelector('.orders-items');
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        ordersContainer.innerHTML = `
            <div class="empty-orders-message">
                <i class="fas fa-clipboard-list"></i>
                <p>Please log in to view orders</p>
            </div>
        `;
        return;
    }

    const userOrders = getOrders().filter(order => order.userId === currentUser.id);

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
            <div class="order-total">₱${order.total.toFixed(2)}</div>
            <div class="order-actions">
                ${order.status === 'pending' || order.status === 'confirmed' ? `
                    <button class="order-action-btn primary" onclick="cancelOrder('${order.id}')">Cancel Order</button>
                ` : ''}
                <button class="order-action-btn" onclick="viewOrderDetails('${order.id}')">View Details</button>
            </div>
        </div>
    `).join('');
}

// Remove item from cart - UPDATED WITH LOCALSTORAGE
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    
    // Save to localStorage
    saveCartToStorage();
    
    updateCartDisplay();
    updateCartBadge();
    updateMobileToggleButton();
}

// Remove item from favorites - UPDATED WITH LOCALSTORAGE
function removeFromFavorites(itemId) {
    favorites = favorites.filter(item => item.id !== itemId);
    
    // Save to localStorage
    saveFavoritesToStorage();
    
    updateFavoritesDisplay();
    updateFavoritesBadge();
    updateMobileToggleFavoritesButton();
    updateMenuHeartIcons();
}

// Update quantity of cart item - UPDATED WITH LOCALSTORAGE
function updateCartQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save to localStorage
        saveCartToStorage();
        
        updateCartDisplay();
        updateCartBadge();
        updateMobileToggleButton();
    }
}

// Update menu heart icons
function updateMenuHeartIcons() {
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        const itemData = JSON.parse(menuItem.getAttribute('data-item').replace(/&#39;/g, "'"));
        const heartIcon = menuItem.querySelector('.favorite-icon');
        
        if (heartIcon) {
            const isFav = isItemInFavorites(itemData);
            heartIcon.style.color = isFav ? '#ff0000' : '#ccc';
            heartIcon.title = isFav ? 'Remove from favorites' : 'Add to favorites';
        }
    });
}

// Update cart badge
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (totalItems === 0) {
        cartBadge.style.display = 'none';
    } else {
        cartBadge.style.display = 'flex';
    }
}

// Update favorites badge
function updateFavoritesBadge() {
    const favoritesBadge = document.querySelector('.favorites-badge');
    const totalFavorites = favorites.length;
    favoritesBadge.textContent = totalFavorites;
    
    if (totalFavorites === 0) {
        favoritesBadge.style.display = 'none';
    } else {
        favoritesBadge.style.display = 'flex';
    }
}

// Update orders badge
function updateOrdersBadge() {
    const ordersBadge = document.querySelector('.orders-badge');
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        const userOrders = getOrders().filter(order => order.userId === currentUser.id);
        const pendingOrders = userOrders.filter(order => 
            ['pending', 'confirmed', 'preparing'].includes(order.status)
        ).length;
        
        ordersBadge.textContent = pendingOrders;
        ordersBadge.style.display = pendingOrders > 0 ? 'flex' : 'none';
    } else {
        ordersBadge.style.display = 'none';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ffffffff;
        border: 2px solid #000000;
        color: black;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10001;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Checkout functionality
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Please log in to checkout');
        setTimeout(() => {
            window.location.href = 'login-signup.html';
        }, 2000);
        return;
    }

    // Check if user has address set
    if (!currentUser.profile?.address) {
        if (confirm('Please set your delivery address first. Open profile settings?')) {
            openProfileModal();
        }
        return;
    }

    openPaymentModal();
});

// Add all favorites to cart
document.querySelector('.add-all-to-cart-btn').addEventListener('click', function() {
    if (favorites.length === 0) {
        showNotification('Your favorites is empty!');
        return;
    }
    
    const itemsWithCustomizations = favorites.filter(item => 
        item.customizations && Object.keys(item.customizations).length > 0
    );
    
    if (itemsWithCustomizations.length > 0) {
        showNotification(`Some items in favorites require customization. Please use "Customize & Add" for: ${itemsWithCustomizations.map(item => item.name).join(', ')}`);
        return;
    }
    
    const itemsWithoutCustomizations = favorites.filter(item => 
        !item.customizations || Object.keys(item.customizations).length === 0
    );
    
    itemsWithoutCustomizations.forEach(item => {
        // Create default customizations for items without them
        const defaultCustomizations = {};
        if (item.customizations) {
            Object.keys(item.customizations).forEach(category => {
                const options = item.customizations[category].options;
                defaultCustomizations[category] = {
                    option: options[0],
                    price: item.customizations[category].prices[0],
                    index: 0
                };
            });
        }
        
        addToCartWithCustomizations(item, defaultCustomizations);
    });
    
    showNotification(`Added ${itemsWithoutCustomizations.length} items to cart from favorites!`);
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('customization-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle window resize - UPDATED WITH PROFILE SUPPORT
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        cartSidebar.style.display = isCartVisible ? 'flex' : 'none';
        favoritesSidebar.style.display = isFavoritesVisible ? 'flex' : 'none';
        ordersSidebar.style.display = isOrdersVisible ? 'flex' : 'none';
        profileSidebar.style.display = isProfileVisible ? 'flex' : 'none';
        cartSidebar.classList.remove('active');
        favoritesSidebar.classList.remove('active');
        ordersSidebar.classList.remove('active');
        profileSidebar.classList.remove('active');
        updateContainerClasses();
        updateCartIcon();
        updateFavoritesIcon();
        updateOrdersIcon();
        updateProfileIcon();
        updateMobileToggleButton();
        updateMobileToggleFavoritesButton();
        updateMobileToggleOrdersButton();
        updateMobileToggleProfileButton();
    } else {
        cartSidebar.style.display = isCartVisible ? 'flex' : 'none';
        favoritesSidebar.style.display = isFavoritesVisible ? 'flex' : 'none';
        ordersSidebar.style.display = isOrdersVisible ? 'flex' : 'none';
        profileSidebar.style.display = isProfileVisible ? 'flex' : 'none';
        cartSidebar.classList.toggle('active', isCartVisible);
        favoritesSidebar.classList.toggle('active', isFavoritesVisible);
        ordersSidebar.classList.toggle('active', isOrdersVisible);
        profileSidebar.classList.toggle('active', isProfileVisible);
        updateContainerClasses();
        updateCartIcon();
        updateFavoritesIcon();
        updateOrdersIcon();
        updateProfileIcon();
        updateMobileToggleButton();
        updateMobileToggleFavoritesButton();
        updateMobileToggleOrdersButton();
        updateMobileToggleProfileButton();
    }
});

// Default load
loadMenu();

// Click filter pills
document.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".pill.active")?.classList.remove("active");
        btn.classList.add("active");
        loadMenu(btn.textContent);
    });
});

// Clear menu cache to ensure latest data loads
function clearMenuCache() {
    localStorage.removeItem('lazzyLatteMenu');
    console.log('Menu cache cleared');
    location.reload();
}

// ============================================================================
// LEADERBOARD FUNCTIONALITY - UPDATED COMPACT DESIGN
// ============================================================================

let isLeaderboardCollapsed = false;

function initLeaderboard() {
    const tabs = document.querySelectorAll('.leaderboard-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateLeaderboard(this.getAttribute('data-period'));
        });
    });

    // Add collapse/expand functionality
    const leaderboardHeader = document.querySelector('.leaderboard-header');
    
    // Create collapse button
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'leaderboard-collapse-btn';
    collapseBtn.innerHTML = '<i class="fas fa-chevron-down"></i>'; // Start with down arrow (collapsed)
    collapseBtn.title = 'Expand Leaderboard';
    collapseBtn.addEventListener('click', toggleLeaderboardCollapse);
    
    // Create points tracker
    const pointsTracker = document.createElement('div');
    pointsTracker.className = 'user-points-tracker';
    pointsTracker.id = 'user-points-tracker';
    pointsTracker.style.display = 'none';
    pointsTracker.innerHTML = `
        <span class="points-label">YOUR POINTS:</span>
        <span class="points-value" id="current-user-points">0</span>
    `;
    
    // Add both to header
    leaderboardHeader.appendChild(pointsTracker);
    leaderboardHeader.appendChild(collapseBtn);
    
    // Set leaderboard to collapsed by default
    isLeaderboardCollapsed = true;
    const leaderboardSection = document.querySelector('.leaderboard-section');
    const leaderboardContent = document.querySelector('.leaderboard-content');
    
    if (leaderboardSection && leaderboardContent) {
        leaderboardContent.style.display = 'none';
        leaderboardSection.classList.add('collapsed');
    }
    
    updateLeaderboard('weekly');
}

function toggleLeaderboardCollapse() {
    const leaderboardSection = document.querySelector('.leaderboard-section');
    const leaderboardContent = document.querySelector('.leaderboard-content');
    const collapseBtn = document.querySelector('.leaderboard-collapse-btn');
    const collapseIcon = collapseBtn.querySelector('i');
    
    isLeaderboardCollapsed = !isLeaderboardCollapsed;
    
    if (isLeaderboardCollapsed) {
        leaderboardContent.style.display = 'none';
        collapseIcon.style.transform = 'rotate(0deg)';
        collapseBtn.title = 'Expand Leaderboard';
        leaderboardSection.classList.add('collapsed');
    } else {
        leaderboardContent.style.display = 'block';
        collapseIcon.style.transform = 'rotate(180deg)';
        collapseBtn.title = 'Collapse Leaderboard';
        leaderboardSection.classList.remove('collapsed');
    }
}

function getLeaderboardData(period) {
    // Get actual users from your system
    const users = JSON.parse(localStorage.getItem('lazzyLatteUsers') || '[]');
    
    // Filter out admin/staff - only real customers
    const customers = users.filter(user => {
        // Check for various admin/staff indicators
        const isAdmin = user.isAdmin === true || 
                       user.role === 'admin' || 
                       user.role === 'staff' ||
                       user.email?.includes('admin') ||
                       user.name?.toLowerCase().includes('admin');
        
        return !isAdmin;
    });
    
    // Calculate points based on actual orders
    const usersWithPoints = customers.map(user => ({
        ...user,
        points: calculateUserPointsForLeaderboard(user, period),
        level: getUserLevel(calculateUserPointsForLeaderboard(user, period))
    })).filter(user => user.points > 0) // Only show users with points
      .sort((a, b) => b.points - a.points);

    return usersWithPoints;
}

function calculateUserPointsForLeaderboard(user, period) {
    if (!user.points) return 0;
    
    switch (period) {
        case 'weekly':
            return user.points.weekly || 0;
        case 'monthly':
            return user.points.monthly || 0;
        case 'all-time':
            return user.points.total || 0;
        default:
            return user.points.total || 0;
    }
}

function getUserLevel(points) {
    if (points >= 15000) return "The Ultimate Chiller";
    if (points >= 10000) return "Legendary Lounger";
    if (points >= 7500)  return "Serene Sipper";
    if (points >= 5000)  return "Mellow Mug";
    if (points >= 3000)  return "Dreamy Drinker";
    if (points >= 1500)  return "Chill Brewer";
    if (points >= 750)   return "Cozy Bean";
    if (points >= 300)   return "Slow Pourer";
    if (points >= 100)   return "Gentle Drip";
    return "Sleepy Starter";
}

function updateLeaderboard(period) {
    currentLeaderboardPeriod = period;
    const listContainer = document.getElementById('leaderboard-list');
    const emptyState = document.getElementById('empty-leaderboard');
    
    const data = getLeaderboardData(period);
    const currentUser = getCurrentUser();
    
    if (data.length === 0) {
        listContainer.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    listContainer.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Mark current user
    const dataWithCurrent = data.map(user => ({
        ...user,
        isCurrentUser: currentUser && user.id === currentUser.id
    }));
    
    renderLeaderboardList(dataWithCurrent);
}

function renderLeaderboardList(users) {
    const listContainer = document.getElementById('leaderboard-list');
    
    if (users.length === 0) {
        listContainer.innerHTML = '';
        return;
    }
    
    listContainer.innerHTML = users.map((user, index) => {
        const rank = index + 1;
        const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
        const profileImage = getProfileImageByLevel(user.level);
        
        // Single crown only for 1st place
        const crownHTML = rank === 1 ? 
            `<span class="crown-icon"><i class="fas fa-crown" style="color: #ffd700;"></i></span>` : '';
        
        return `
            <div class="leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}">
                <div class="place">
                    ${crownHTML}
                    <span class="rank-number">${rank}</span>
                </div>
                <div class="user-info">
                    <div class="user-avatar">
                        ${profileImage ? 
                            `<img src="${profileImage}" alt="${user.level}" class="level-profile-image">` :
                            `<div class="profile-initials">${initials}</div>`
                        }
                    </div>
                    <div class="user-details">
                        <div class="user-name">${user.name}</div>
                        <div class="user-level">${user.level}</div>
                    </div>
                </div>
                <div class="user-points">${user.points.toLocaleString()}</div>
                <div class="user-reward">${user.level}</div>
            </div>
        `;
    }).join('');
}

// Remove the old podium function since we're not using it anymore
function renderPodium(top3) {
    // Empty function - podium is no longer used
}

// ============================================================================
// ENHANCED POINTS SYSTEM
// ============================================================================

// Calculate points for a completed order
function calculateOrderPoints(order) {
    let points = 0;
    
    // Base points per order
    points += 10;
    
    // Points based on total amount (1 point per dollar)
    points += Math.floor(order.total);
    
    // Bonus points for larger orders
    if (order.total >= 50) points += 15;
    else if (order.total >= 30) points += 10;
    else if (order.total >= 20) points += 5;
    
    // Bonus for using card payment
    if (order.paymentMethod === 'card') {
        points += 5;
    }
    
    return points;
}

// Update user points when order is completed
function updateUserPoints(order) {
    if (order.status !== 'completed') return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const pointsEarned = calculateOrderPoints(order);
    
    // Initialize points system if not exists
    if (!currentUser.points) {
        currentUser.points = {
            total: 0,
            weekly: 0,
            monthly: 0,
            history: []
        };
    }
    
    // Update points
    const now = new Date();
    const pointsEntry = {
        orderId: order.id,
        points: pointsEarned,
        date: now.toISOString(),
        orderTotal: order.total
    };
    
    currentUser.points.total += pointsEarned;
    currentUser.points.history.push(pointsEntry);
    
    // Update weekly and monthly points
    updatePeriodicPoints(currentUser, pointsEarned, now);
    
    // Save updated user data
    localStorage.setItem('lazzyLatteCurrentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('lazzyLatteUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('lazzyLatteUsers', JSON.stringify(users));
    }
    
    // Update UI
    updatePointsTracker();
    
    // Update profile image when points change
    updateProfileImage();
    updateProfileModalImage();
    
    // Update profile sidebar if visible
    if (isProfileVisible) {
        loadProfileSidebarData();
    }
    
    // ALWAYS update leaderboard data, refresh UI if visible
    updateLeaderboard(currentLeaderboardPeriod);
    
    return pointsEarned;
}

// Update weekly and monthly points
function updatePeriodicPoints(user, pointsEarned, date) {
    const now = date || new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Reset weekly points if needed
    if (!user.points.lastWeeklyReset || new Date(user.points.lastWeeklyReset) < oneWeekAgo) {
        user.points.weekly = 0;
        user.points.lastWeeklyReset = now.toISOString();
    }
    
    // Reset monthly points if needed
    if (!user.points.lastMonthlyReset || new Date(user.points.lastMonthlyReset) < oneMonthAgo) {
        user.points.monthly = 0;
        user.points.lastMonthlyReset = now.toISOString();
    }
    
    user.points.weekly += pointsEarned;
    user.points.monthly += pointsEarned;
}

// Update points tracker in leaderboard header
function updatePointsTracker() {
    const currentUser = getCurrentUser();
    const pointsTracker = document.getElementById('user-points-tracker');
    const pointsValue = document.getElementById('current-user-points');
    
    if (!currentUser || !pointsTracker || !pointsValue) return;
    
    if (currentUser.points) {
        pointsTracker.style.display = 'flex';
        pointsValue.textContent = currentUser.points.total.toLocaleString();
    } else {
        pointsTracker.style.display = 'none';
    }
}

// Enhanced order completion with points
function completeOrder(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (order && order.status !== 'completed') {
        order.status = 'completed';
        saveOrders(orders);
        
        // Award points for completed order
        const pointsEarned = updateUserPoints(order);
        
        // Show points notification
        if (pointsEarned > 0) {
            showNotification(`🎉 Order completed! You earned ${pointsEarned} points!`);
        }
        
        updateOrdersBadge();
        updateMobileToggleOrdersButton();
        loadOrdersData();
        
        // Update profile sidebar if visible
        if (isProfileVisible) {
            loadProfileSidebarData();
        }
    }
}

// Modify the existing updateOrderStatus function to handle points
const originalUpdateOrderStatus = updateOrderStatus;
updateOrderStatus = function(orderId, status) {
    originalUpdateOrderStatus(orderId, status);
    
    // Award points when order is marked as completed
    if (status === 'completed') {
        completeOrder(orderId);
    }
};

// Initialize points system
function initializePointsSystem() {
    updatePointsTracker();
    
    // Check for any completed orders that might not have awarded points
    const currentUser = getCurrentUser();
    if (currentUser) {
        const userOrders = getOrders().filter(order => 
            order.userId === currentUser.id && 
            order.status === 'completed'
        );
        
        userOrders.forEach(order => {
            if (!currentUser.points?.history?.find(h => h.orderId === order.id)) {
                updateUserPoints(order);
            }
        });
    }
}

// ============================================================================
// LOGOUT FUNCTIONALITY
// ============================================================================

// Setup logout functionality
function setupLogout() {
    const logoutIcon = document.querySelector('.icon-logout');
    const currentUser = getCurrentUser();
    
    // Show/hide logout icon based on authentication
    if (currentUser) {
        logoutIcon.style.display = 'flex';
    } else {
        logoutIcon.style.display = 'none';
    }
}

function handleLogout() {
    // Create clean, bold logout confirmation modal
    const modal = document.createElement('div');
    modal.id = 'confirmation-modal';
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="confirmation-modal-content logout-modal">
            <div class="confirmation-modal-header">
                <i class="fas fa-sign-out-alt confirmation-icon"></i>
                <h3>CONFIRM LOGOUT</h3>
            </div>
            <div class="confirmation-modal-body">
                <p class="confirmation-message">Are you sure you want to log out of your account?</p>
                <div class="confirmation-actions">
                    <button class="cancel-confirm-btn">
                        <i class="fas fa-times"></i>
                        CANCEL
                    </button>
                    <button class="confirm-btn">
                        <i class="fas fa-check"></i>
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-confirm-btn');

    const closeModal = () => {
        modal.style.display = 'none';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    };

    confirmBtn.addEventListener('click', () => {
        closeModal();
        // Perform logout
        localStorage.removeItem('lazzyLatteCurrentUser');
        showNotification('Logged out successfully!');
        updateAuthUI();
        setTimeout(() => {
            window.location.href = 'login-signup.html';
        }, 1500);
    });

    cancelBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Escape key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Update authentication UI
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const logoutIcon = document.querySelector('.icon-logout');
    const ordersIcon = document.querySelector('.icon-orders');
    const profileIcon = document.querySelector('.icon-profile');
    const toggleOrders = document.querySelector('.toggle-orders');
    const toggleProfile = document.querySelector('.toggle-profile');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    if (currentUser) {
        // User is logged in
        if (logoutIcon) logoutIcon.style.display = 'flex';
        if (ordersIcon) ordersIcon.style.display = 'flex';
        if (profileIcon) profileIcon.style.display = 'flex';
        if (toggleOrders) toggleOrders.style.display = 'block';
        if (toggleProfile) toggleProfile.style.display = 'block';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
    } else {
        // User is not logged in
        if (logoutIcon) logoutIcon.style.display = 'none';
        if (ordersIcon) ordersIcon.style.display = 'none';
        if (profileIcon) profileIcon.style.display = 'none';
        if (toggleOrders) toggleOrders.style.display = 'none';
        if (toggleProfile) toggleProfile.style.display = 'none';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
        
        // Hide orders sidebar if open
        if (isOrdersVisible) {
            toggleOrders();
        }
        // Hide profile sidebar if open
        if (isProfileVisible) {
            toggleProfile();
        }
    }
    
    // Update user name display
    displayUserName();
}

// ============================================================================
// PROFILE AND ORDERS FUNCTIONALITY
// ============================================================================

// Get current user from localStorage
function getCurrentUser() {
    const stored = localStorage.getItem('lazzyLatteCurrentUser');
    return stored ? JSON.parse(stored) : null;
}

// Get orders from localStorage
function getOrders() {
    const stored = localStorage.getItem('lazzyLatteOrders');
    return stored ? JSON.parse(stored) : [];
}

// Save orders to localStorage
function saveOrders(orders) {
    localStorage.setItem('lazzyLatteOrders', JSON.stringify(orders));
}

// Open profile modal
function openProfileModal() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Please log in to access profile');
        setTimeout(() => {
            window.location.href = 'login-signup.html';
        }, 2000);
        return;
    }

    // Create profile modal if it doesn't exist
    if (!document.getElementById('profile-modal')) {
        const modal = document.createElement('div');
        modal.id = 'profile-modal';
        modal.className = 'modal';
        modal.innerHTML = `
    <div class="modal-content profile-modal-content">
        <span class="close-modal">&times;</span>
        <div class="profile-modal-header">
            <div class="profile-image-container" id="modal-profile-image">
                <!-- Dynamic profile image will be inserted here -->
            </div>
            <h2>EDIT PROFILE</h2>
            <p>Update your personal information and preferences</p>
            <div class="level-badge" id="modal-level-badge"></div>
        </div>
        
        <form id="profile-form" class="profile-form">
            <div class="form-section">
                <div class="section-header">
                    <i class="fas fa-user"></i>
                    <h3>Personal Information</h3>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="profile-name">Full Name</label>
                        <div class="input-with-icon">
                            <i class="fas fa-user"></i>
                            <input type="text" id="profile-name" placeholder="Enter your full name" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="profile-phone">Phone Number</label>
                        <div class="input-with-icon">
                            <i class="fas fa-phone"></i>
                            <input type="tel" id="profile-phone" placeholder="Enter your phone number" required>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="profile-email">Email Address</label>
                        <div class="input-with-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="profile-email" placeholder="Enter your email address" required readonly>
                        <span class="readonly-badge">Cannot change</span>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="section-header">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>Delivery Address</h3>
                </div>
                <div class="form-group">
                    <label for="profile-address">Street Address</label>
                    <div class="input-with-icon">
                        <i class="fas fa-home"></i>
                        <input type="text" id="profile-address" placeholder="Enter your street address" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="profile-city">City</label>
                        <div class="input-with-icon">
                            <i class="fas fa-city"></i>
                            <input type="text" id="profile-city" placeholder="City" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="profile-state">State</label>
                        <div class="input-with-icon">
                            <i class="fas fa-map-pin"></i>
                            <input type="text" id="profile-state" placeholder="State" required>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="profile-zip">ZIP Code</label>
                    <div class="input-with-icon">
                        <i class="fas fa-mail-bulk"></i>
                        <input type="text" id="profile-zip" placeholder="ZIP Code" required>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="section-header">
                    <i class="fas fa-heart"></i>
                    <h3>Preferences</h3>
                </div>
                <div class="form-group">
                    <label for="profile-allergies">Allergies or Dietary Restrictions</label>
                    <div class="textarea-with-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                        <textarea id="profile-allergies" rows="3" placeholder="List any allergies or dietary restrictions (e.g., gluten-free, dairy allergy, nuts...)"></textarea>
                    </div>
                    <div class="help-text">This helps us ensure your orders are prepared safely</div>
                </div>
            </div>

            <div class="profile-actions">
                <button type="button" class="cancel-btn">
                    <i class="fas fa-times"></i>
                    CANCEL
                </button>
                <button type="submit" class="save-btn">
                    <i class="fas fa-save"></i>
                    SAVE CHANGES
                </button>
            </div>
        </form>
    </div>
`;
        document.body.appendChild(modal);

        // Setup modal events
        setupProfileModalEvents();
    }

    const modal = document.getElementById('profile-modal');
    loadProfileData();
    
    // Update profile image in modal
    updateProfileModalImage();
    
    // Update level badge in modal
    const currentUserPoints = currentUser.points?.total || 0;
    const userLevel = getUserLevel(currentUserPoints);
    const modalLevelBadge = document.getElementById('modal-level-badge');
    if (modalLevelBadge) {
        modalLevelBadge.textContent = userLevel;
    }
    
    modal.style.display = 'block';
}

// Setup profile modal events
function setupProfileModalEvents() {
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
        saveProfile();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Load profile data into form
function loadProfileData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-email').value = currentUser.email || '';
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-address').value = currentUser.profile?.address || '';
    document.getElementById('profile-city').value = currentUser.profile?.city || '';
    document.getElementById('profile-state').value = currentUser.profile?.state || '';
    document.getElementById('profile-zip').value = currentUser.profile?.zipCode || '';
    document.getElementById('profile-allergies').value = currentUser.profile?.preferences?.allergies || '';
}

// Save profile data
function saveProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Update current user data
    currentUser.name = document.getElementById('profile-name').value;
    currentUser.phone = document.getElementById('profile-phone').value;
    currentUser.profile = {
        address: document.getElementById('profile-address').value,
        city: document.getElementById('profile-city').value,
        state: document.getElementById('profile-state').value,
        zipCode: document.getElementById('profile-zip').value,
        preferences: {
            allergies: document.getElementById('profile-allergies').value
        }
    };

    // Update in localStorage
    localStorage.setItem('lazzyLatteCurrentUser', JSON.stringify(currentUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('lazzyLatteUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('lazzyLatteUsers', JSON.stringify(users));
    }

    // Show success message
    showNotification('Profile updated successfully!');
    
    // Update user name display
    displayUserName();
    
    // Update profile sidebar data if visible
    if (isProfileVisible) {
        loadProfileSidebarData();
    }
    
    // Update profile image
    updateProfileImage();
    
    // Close modal
    document.getElementById('profile-modal').style.display = 'none';
}

// Create order
function createOrder(cartItems, total, paymentMethod) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Please log in to place an order');
        return null;
    }

    const order = {
        id: 'ORD' + Date.now(),
        userId: currentUser.id,
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
        address: currentUser.profile?.address || 'No address provided'
    };

    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);

    // Update badges
    updateOrdersBadge();
    updateMobileToggleOrdersButton();

    // Update profile sidebar if visible
    if (isProfileVisible) {
        loadProfileSidebarData();
    }

    // Simulate order processing - STOP AT READY STATUS
    setTimeout(() => {
        updateOrderStatus(order.id, 'confirmed');
    }, 2000);

    setTimeout(() => {
        updateOrderStatus(order.id, 'preparing');
    }, 5000);

    setTimeout(() => {
        updateOrderStatus(order.id, 'ready');
    }, 10000);

    return order;
}

// Update order status
function updateOrderStatus(orderId, status) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        saveOrders(orders);
        updateOrdersBadge();
        updateMobileToggleOrdersButton();
        loadOrdersData(); // Refresh display
        
        // Update profile sidebar if visible
        if (isProfileVisible) {
            loadProfileSidebarData();
        }
    }
}

// Cancel order
function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        updateOrderStatus(orderId, 'cancelled');
        showNotification('Order cancelled successfully');
    }
}

// View order details
function viewOrderDetails(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
        const details = order.items.map(item => 
            `${item.quantity}x ${item.name} - ₱${item.price.toFixed(2)}${item.customizations && Object.keys(item.customizations).length > 0 ? 
                '\n  Customizations: ' + Object.entries(item.customizations).map(([key, value]) => `${key}: ${value}`).join(', ') : ''}`
        ).join('\n');
        
        alert(`Order Details:\n\n${details}\n\nTotal: ₱${order.total.toFixed(2)}\nStatus: ${order.status}\nPayment: ${order.paymentMethod}\nAddress: ${order.address}`);
    }
}

// Open payment modal - IMPROVED VERSION
function openPaymentModal() {
    // Create payment modal
    const modal = document.createElement('div');
    modal.id = 'payment-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content payment-modal-content">
            <span class="close-modal">&times;</span>
            <div class="payment-modal-grid">
                <!-- Left Column - Order Summary -->
                <div class="payment-column payment-summary-column">
                    <div class="payment-section">
                        <div class="payment-header">
                            <i class="fas fa-receipt"></i>
                            <h3>ORDER SUMMARY</h3>
                        </div>
                        <div class="order-items-list">
                            ${cart.map(item => `
                                <div class="order-item-row">
                                    <div class="item-info">
                                        <span class="item-quantity">${item.quantity}x</span>
                                        <span class="item-name">${item.name}</span>
                                        ${Object.keys(item.customizations).length > 0 ? 
                                            `<div class="item-customizations">
                                                ${Object.entries(item.customizations).map(([key, value]) => 
                                                    `<small>${key}: ${value}</small>`
                                                ).join('')}
                                            </div>` : ''
                                        }
                                    </div>
                                    <span class="item-price">₱${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-totals">
                            <div class="total-row subtotal">
                                <span>Subtotal</span>
                                <span>₱${calculateCartTotal().toFixed(2)}</span>
                            </div>
                            <div class="total-row delivery">
                                <span>Delivery Fee</span>
                                <span>₱50.00</span>
                            </div>
                            <div class="total-row service">
                                <span>Service Fee</span>
                                <span>₱25.00</span>
                            </div>
                            <div class="total-row grand-total">
                                <span>Total Amount</span>
                                <span>₱${(calculateCartTotal() + 75).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="payment-section delivery-info">
                        <div class="payment-header">
                            <i class="fas fa-map-marker-alt"></i>
                            <h3>DELIVERY INFO</h3>
                        </div>
                        <div class="delivery-details">
                            <div class="delivery-address">
                                <strong>Delivery Address</strong>
                                <p>${getCurrentUser()?.profile?.address || 'No address set'}</p>
                            </div>
                            <div class="delivery-time">
                                <strong>Estimated Delivery</strong>
                                <p>25-35 minutes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Payment Methods -->
                <div class="payment-column payment-methods-column">
                    <div class="payment-section">
                        <div class="payment-header">
                            <i class="fas fa-credit-card"></i>
                            <h3>PAYMENT METHOD</h3>
                        </div>
                        
                        <div class="payment-methods-grid">
                            <div class="payment-method-card" data-method="card">
                                <input type="radio" name="payment-method" id="payment-card" class="payment-radio">
                                <label for="payment-card" class="payment-method-label">
                                    <div class="method-icon">
                                        <i class="fas fa-credit-card"></i>
                                    </div>
                                    <div class="method-info">
                                        <div class="method-title">Credit/Debit Card</div>
                                        <div class="method-subtitle">Pay securely with your card</div>
                                    </div>
                                    <div class="method-badges">
                                        <span class="payment-badge visa">Visa</span>
                                        <span class="payment-badge mastercard">MasterCard</span>
                                    </div>
                                </label>
                            </div>

                            <div class="payment-method-card" data-method="cash">
                                <input type="radio" name="payment-method" id="payment-cash" class="payment-radio">
                                <label for="payment-cash" class="payment-method-label">
                                    <div class="method-icon">
                                        <i class="fas fa-money-bill-wave"></i>
                                    </div>
                                    <div class="method-info">
                                        <div class="method-title">Cash on Delivery</div>
                                        <div class="method-subtitle">Pay when you receive your order</div>
                                    </div>
                                    <div class="method-badges">
                                        <span class="payment-badge cash">Cash</span>
                                    </div>
                                </label>
                            </div>

                            <div class="payment-method-card" data-method="gcash">
                                <input type="radio" name="payment-method" id="payment-gcash" class="payment-radio">
                                <label for="payment-gcash" class="payment-method-label">
                                    <div class="method-icon">
                                        <i class="fas fa-mobile-alt"></i>
                                    </div>
                                    <div class="method-info">
                                        <div class="method-title">GCash</div>
                                        <div class="method-subtitle">Pay using GCash wallet</div>
                                    </div>
                                    <div class="method-badges">
                                        <span class="payment-badge gcash">GCash</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Card Details Form -->
                        <div class="payment-details-card" id="card-details">
                            <div class="card-form-header">
                                <h4>Card Information</h4>
                                <div class="card-icons">
                                    <i class="fab fa-cc-visa"></i>
                                    <i class="fab fa-cc-mastercard"></i>
                                </div>
                            </div>
                            
                            <div class="card-form-grid">
                                <div class="form-group full-width">
                                    <label for="card-number">Card Number</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-credit-card"></i>
                                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="card-expiry">Expiry Date</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-calendar-alt"></i>
                                        <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5">
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="card-cvv">CVV</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-lock"></i>
                                        <input type="text" id="card-cvv" placeholder="123" maxlength="3">
                                    </div>
                                </div>
                                
                                <div class="form-group full-width">
                                    <label for="card-name">Cardholder Name</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-user"></i>
                                        <input type="text" id="card-name" placeholder="John Doe">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- GCash Details -->
                        <div class="payment-details-card" id="gcash-details">
                            <div class="gcash-info">
                                <div class="gcash-qr">
                                    <div class="qr-placeholder">
                                        <i class="fas fa-qrcode"></i>
                                        <p>GCash QR Code</p>
                                    </div>
                                </div>
                                <div class="gcash-instructions">
                                    <h4>How to Pay with GCash</h4>
                                    <ol>
                                        <li>Open GCash app</li>
                                        <li>Tap "Scan QR"</li>
                                        <li>Scan the QR code</li>
                                        <li>Enter amount: ₱${(calculateCartTotal() + 75).toFixed(2)}</li>
                                        <li>Complete payment</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="payment-actions">
                        <button type="button" class="cancel-payment-btn">
                            <i class="fas fa-arrow-left"></i>
                            Back to Cart
                        </button>
                        <button class="complete-payment-btn" id="complete-payment">
                            <i class="fas fa-lock"></i>
                            COMPLETE PAYMENT - ₱${(calculateCartTotal() + 75).toFixed(2)}
                        </button>
                    </div>

                    <div class="payment-security">
                        <div class="security-badges">
                            <div class="security-badge">
                                <i class="fas fa-shield-alt"></i>
                                <span>Secure Payment</span>
                            </div>
                            <div class="security-badge">
                                <i class="fas fa-lock"></i>
                                <span>SSL Encrypted</span>
                            </div>
                        </div>
                        <p class="security-note">Your payment information is secure and encrypted</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Setup payment modal events
    setupPaymentModalEvents(modal);
}

// Setup payment modal events - UPDATED
function setupPaymentModalEvents(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    const paymentMethods = modal.querySelectorAll('.payment-method-card');
    const completeBtn = modal.querySelector('#complete-payment');
    const cancelBtn = modal.querySelector('.cancel-payment-btn');
    const cardDetails = modal.querySelector('#card-details');
    const gcashDetails = modal.querySelector('#gcash-details');

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remove selected class from all methods
            paymentMethods.forEach(m => m.classList.remove('selected'));
            // Add selected class to clicked method
            method.classList.add('selected');
            method.querySelector('input').checked = true;

            const selectedMethod = method.getAttribute('data-method');
            
            // Hide all detail sections
            cardDetails.style.display = 'none';
            gcashDetails.style.display = 'none';
            
            // Show relevant detail section
            if (selectedMethod === 'card') {
                cardDetails.style.display = 'block';
            } else if (selectedMethod === 'gcash') {
                gcashDetails.style.display = 'block';
            }
        });
    });

    completeBtn.addEventListener('click', () => {
        processPayment(modal);
    });

    // Format card number input
    const cardNumberInput = modal.querySelector('#card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ');
            if (formattedValue) {
                e.target.value = formattedValue;
            }
        });
    }

    // Format expiry date input
    const expiryInput = modal.querySelector('#card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
}

// Process payment - UPDATED WITH CONFETTI
function processPayment(modal) {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    if (!selectedMethod) {
        showNotification('Please select a payment method');
        return;
    }

    const paymentMethod = selectedMethod.id.replace('payment-', '');

    // Validate card details if paying by card
    if (paymentMethod === 'card') {
        const cardNumber = document.querySelector('#card-details input[type="text"]').value;
        if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
            showNotification('Please enter a valid card number');
            return;
        }
    }

    // Create order
    const order = createOrder(cart, calculateCartTotal(), paymentMethod);

    if (order) {
        // TRIGGER CONFETTI
        triggerConfetti();
        
        showNotification(`Order placed successfully! Order #${order.id.slice(-6)}`);
        
        // Clear cart and save to localStorage
        cart = [];
        saveCartToStorage();
        
        updateCartDisplay();
        updateCartBadge();
        updateMobileToggleButton();
        
        // Close modal
        modal.remove();
        
        // Show orders sidebar
        toggleOrders();
    }
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Mobile logout functionality
function setupMobileLogout() {
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            handleLogout();
        });
    }
}

// ============================================================================
// SCROLL-CONTROLLED VIDEO FUNCTIONALITY
// ============================================================================

function initScrollVideo() {
    const vid = document.getElementById('v0');
    const setHeight = document.getElementById("set-height");
    
    if (!vid) {
        console.log('Scroll video element not found');
        return;
    }

    const playbackConst = 300; // Further reduced
    let targetTime = 0;
    let currentTime = 0;
    let isScrolling = false;
    let rafId = null;

    function handleVideoLoad() {
        if (vid.duration) {
            // Set a much smaller height - only for the video section
            const videoScrollHeight = Math.min(vid.duration * playbackConst, window.innerHeight * 0.8);
            
            setHeight.style.height = videoScrollHeight + "px";
            console.log("Video Duration: ", vid.duration, "Set Height: ", videoScrollHeight);
            
            // Start the smooth scroll play
            smoothScrollPlay();
        }
    }

    function handleScroll() {
        if (!isScrolling) {
            isScrolling = true;
            
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(updateVideoTime);
        }
    }

    function updateVideoTime() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
        
        targetTime = vid.duration * scrollFraction;
        
        if (vid.readyState >= 2) {
            vid.currentTime = Math.max(0, Math.min(vid.duration, targetTime));
        }
        
        isScrolling = false;
        rafId = null;
    }

    function smoothScrollPlay() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        // Only animate if we're within the video scroll area
        if (scrollTop <= maxScroll) {
            const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
            targetTime = vid.duration * scrollFraction;
            
            const smoothing = 0.1;
            currentTime += (targetTime - currentTime) * smoothing;
            
            if (vid.readyState >= 2) {
                vid.currentTime = Math.max(0, Math.min(vid.duration, currentTime));
            }
        }
        
        requestAnimationFrame(smoothScrollPlay);
    }

    // Event listeners
    if (vid.readyState >= 2) {
        handleVideoLoad();
    } else {
        vid.addEventListener('loadedmetadata', handleVideoLoad);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Emergency fallback - set a reasonable max height
    setTimeout(function() {
        if (setHeight && parseInt(setHeight.style.height) > window.innerHeight * 2) {
            setHeight.style.height = (window.innerHeight * 0.8) + "px";
        }
    }, 2000);

    // Preload video
    vid.load();
    
    // Ensure video can play
    vid.play().catch(function(e) {
        console.log('Video play prevented:', e);
    });
}

function initAboutScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: .9,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize everything - WITH MENU CACHE CLEARING
function initializeApp() {
    // Clear any old menu cache to ensure latest data loads
    const storedMenu = localStorage.getItem('lazzyLatteMenu');
    if (storedMenu) {
        const parsedMenu = JSON.parse(storedMenu);
        // Check if old menu data doesn't have ratings
        if (parsedMenu.menu && parsedMenu.menu.length > 0 && !parsedMenu.menu[0].hasOwnProperty('rating')) {
            localStorage.removeItem('lazzyLatteMenu');
            console.log('Cleared old menu cache without ratings');
        }
    }
    
    setupMobileLogout();
    // Initialize the new compact leaderboard
    initLeaderboard();
    
    // Initialize points system
    initializePointsSystem();
    
    // Initialize scroll video
    initScrollVideo();
    initAboutScrollAnimation();
    // Load data from localStorage FIRST
    loadCartFromStorage();
    loadFavoritesFromStorage();
    
    // Then update the displays
    updateCartDisplay();
    updateCartBadge();
    updateFavoritesDisplay();
    updateFavoritesBadge();
    updateOrdersBadge();
    updateMobileToggleButton();
    updateMobileToggleFavoritesButton();
    updateMobileToggleOrdersButton();
    updateMobileToggleProfileButton();
    setupSearch();
    setupLogout();
    
    // Display user name if logged in
    displayUserName();
    
    // Update profile image if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        updateProfileImage();
        updateProfileModalImage();
    }
    
    // Set initial state - all hidden
    cartSidebar.style.display = 'none';
    favoritesSidebar.style.display = 'none';
    ordersSidebar.style.display = 'none';
    profileSidebar.style.display = 'none';
    menuCartContainer.classList.add('both-hidden');
    isCartVisible = false;
    isFavoritesVisible = false;
    isOrdersVisible = false;
    isProfileVisible = false;
    updateCartIcon();
    updateFavoritesIcon();
    updateOrdersIcon();
    updateProfileIcon();
    updateMobileToggleButton();
    updateMobileToggleFavoritesButton();
    updateMobileToggleOrdersButton();
    updateMobileToggleProfileButton();

    // Setup refresh orders button
    const refreshOrdersBtn = document.querySelector('.refresh-orders-btn');
    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', () => {
            loadOrdersData();
            showNotification('Orders refreshed!');
        });
    }

    // Setup profile sidebar button events
    setupProfileSidebarEvents();
}

// Setup profile sidebar events
function setupProfileSidebarEvents() {
    // Edit profile button
    document.getElementById('edit-profile-btn')?.addEventListener('click', function() {
        toggleProfile();
        setTimeout(() => {
            openProfileModal();
        }, 300);
    });

    // View orders button
    document.getElementById('view-orders-btn')?.addEventListener('click', function() {
        toggleProfile();
        setTimeout(() => {
            toggleOrders();
        }, 300);
    });

    // Logout button in sidebar
    document.getElementById('sidebar-logout-btn')?.addEventListener('click', handleLogout);
}

function loadProfileSidebarData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Update basic info
    document.getElementById('profile-sidebar-name').textContent = currentUser.name || 'Guest User';
    document.getElementById('profile-sidebar-email').textContent = currentUser.email || 'Not logged in';
    document.getElementById('profile-sidebar-phone').textContent = currentUser.phone || '';

    // Update profile image based on level
    updateProfileImage();

    // Update order stats
    const userOrders = getOrders().filter(order => order.userId === currentUser.id);
    const totalOrders = userOrders.length;
    const pendingOrders = userOrders.filter(order => 
        ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
    ).length;
    const completedOrders = userOrders.filter(order => order.status === 'completed').length;

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('completed-orders').textContent = completedOrders;

    // Update points
    const totalPoints = currentUser.points?.total || 0;
    document.getElementById('total-points').textContent = totalPoints.toLocaleString();

    // Update preferences
    const allergies = currentUser.profile?.preferences?.allergies || 'None';
    document.getElementById('preference-allergies').textContent = allergies;
}

// Contact form submission
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    showNotification('Message sent successfully! We will get back to you soon.');
    
    // Reset form
    this.reset();
});

// Reviews Carousel Functionality
function initReviewsCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Function to update carousel
    function updateCarousel() {
        // Remove active class from all cards and dots
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current card and dot
        cards[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // Auto-advance carousel every 5 seconds
    let autoSlide = setInterval(nextSlide, 5000);
    
    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initReviewsCarousel();
    
    // Contact form submission
    document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        showNotification('Message sent successfully! We will get back to you soon.');
        
        // Reset form
        this.reset();
    });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);