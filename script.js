/**
 * ========================================
 * MIEL DE WAHBI - PREMIUM JAVASCRIPT
 * Ultra Professional Script with Advanced Features
 * ========================================
 */

// ============= GLOBAL STATE =============
let cart = [];
let deliveryFee = 0;
let animationFrameId = null;

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeAnimations();
    initializeParticles();
    loadCartFromStorage();
    updateCartBadge();
    attachEventListeners();
});
/**
 * ========================================
 * SYNCHRONISATION AVEC LE PANNEAU ADMIN
 * ========================================
 */

// Cette fonction charge les produits depuis le panneau admin
function loadProductsFromAdmin() {
    try {
        const savedProducts = localStorage.getItem('honeyProducts');
        const savedSettings = localStorage.getItem('honeySettings');
        
        if (savedProducts) {
            const products = JSON.parse(savedProducts);
            console.log('✅ Produits chargés depuis admin:', products.length);
            renderProductsFromAdmin(products);
        }
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            console.log('✅ Paramètres chargés depuis admin');
            applySettings(settings);
        }
    } catch (e) {
        console.warn('❌ Erreur de chargement des produits admin:', e);
    }
}

// Fonction pour afficher les produits du panneau admin
function renderProductsFromAdmin(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Vider la grille actuelle
    productsGrid.innerHTML = '';
    
    // Générer le HTML pour chaque produit
    products.forEach((product, index) => {
        const productHTML = `
            <div class="product-card" data-product="${product.name}" data-aos="fade-up" data-aos-delay="${(index + 1) * 100}">
                <div class="product-image">
                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #ffd89b 0%, #f4a623 100%); display: flex; align-items: center; justify-content: center; font-size: 5rem;">
                        ${product.emoji || '🍯'}
                    </div>
                    <div class="product-overlay">
                        <span class="quick-view">Vue rapide</span>
                    </div>
                    <span class="product-badge">${product.inStock ? 'En Stock' : 'Épuisé'}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="price-value">${product.price1kg}</span>
                        <span class="price-currency">DT / kg</span>
                    </div>
                    
                    <div class="size-selector">
                        <button class="size-btn active" data-size="500g" data-price="${product.price500g}">
                            <span class="size-label">500g</span>
                            <span class="size-price">${product.price500g} DT</span>
                        </button>
                        <button class="size-btn" data-size="1kg" data-price="${product.price1kg}">
                            <span class="size-label">1kg</span>
                            <span class="size-price">${product.price1kg} DT</span>
                        </button>
                    </div>

                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="decreaseQty(this)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M5 12h14" stroke-width="2"/>
                            </svg>
                        </button>
                        <span class="quantity-value">1</span>
                        <button class="quantity-btn" onclick="increaseQty(this)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 5v14M5 12h14" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>

                    <button class="add-to-cart-btn" onclick="addToCart(this)">
                        <svg class="cart-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 2L7 6M17 2L19 6M3 6H21L19 20H5L3 6Z" stroke-width="2"/>
                        </svg>
                        <span>Ajouter au panier</span>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.insertAdjacentHTML('beforeend', productHTML);
    });
    
    // Réattacher les event listeners pour les boutons de taille
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', handleSizeSelection);
    });
    
    // Réinitialiser AOS si disponible
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Fonction pour appliquer les paramètres du panneau admin
function applySettings(settings) {
    // Mettre à jour le numéro de téléphone dans le footer
    const phoneElements = document.querySelectorAll('footer p');
    phoneElements.forEach(el => {
        if (el.textContent.includes('📞')) {
            el.innerHTML = `📞 ${settings.phone}`;
        }
        if (el.textContent.includes('📍')) {
            el.innerHTML = `📍 ${settings.address}`;
        }
    });
    
    // Mettre à jour le lien Facebook
    const facebookLinks = document.querySelectorAll('a[href*="facebook"], a[href*="m.me"]');
    facebookLinks.forEach(link => {
        if (settings.facebook) {
            link.href = settings.facebook;
        }
    });
    
    // Mettre à jour les liens WhatsApp
    window.WHATSAPP_NUMBER = settings.phone.replace(/\s/g, '');
    
    console.log('✅ Paramètres appliqués:', settings);
}

// Charger les produits au démarrage
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 Chargement des produits depuis le panneau admin...');
    loadProductsFromAdmin();
    
    // Écouter les changements de localStorage (si un autre onglet modifie les produits)
    window.addEventListener('storage', (e) => {
        if (e.key === 'honeyProducts' || e.key === 'honeySettings') {
            console.log('🔄 Mise à jour détectée depuis le panneau admin !');
            location.reload();
        }
    });
});

// Exporter pour utilisation globale
window.loadProductsFromAdmin = loadProductsFromAdmin;
// ============= APP INITIALIZATION =============
function initializeApp() {
    console.log('🍯 Miel de Wahbi - App initialized');
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    initializeProductPrices();
}

// ============= ADVANCED ANIMATIONS =============
function initializeAnimations() {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.05;
            shape.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed * 0.5}px)`;
        });
    });

    // Add intersection observer for product cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}


// ============= PARTICLE SYSTEM =============
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    Object.assign(particle.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, rgba(244, 166, 35, 0.6), transparent)`,
        borderRadius: '50%',
        left: `${startX}px`,
        top: `${startY}px`,
        animation: `floatParticle ${duration}s ease-in-out ${delay}s infinite`,
        pointerEvents: 'none'
    });
    
    container.appendChild(particle);
}

// Add CSS for particle animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.6;
        }
        50% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * -300 - 100}px) scale(1.5);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(style);

// ============= EVENT LISTENERS =============
// ============= EVENT LISTENERS =============
function attachEventListeners() {
    // Size button handlers
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', handleSizeSelection);
    });

    // Modal close on outside click
    window.addEventListener('click', handleOutsideClick);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

function handleSizeSelection(event) {
    const card = event.currentTarget.closest('.product-card');
    const size = event.currentTarget.dataset.size;
    const price = parseFloat(event.currentTarget.dataset.price);
    
    // Retirer la classe active des autres boutons
    card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // AJOUTER CETTE LIGNE :
    updateProductPrice(card, size, price);
    
    // Ajouter l'effet ripple
    createRipple(event);
}

function updateProductPrice(card, size, price) {
    const priceValue = card.querySelector('.price-value');
    const priceCurrency = card.querySelector('.price-currency');
    
    if (priceValue && priceCurrency) {
        // Animation de changement de prix
        priceValue.style.transform = 'scale(1.2)';
        priceValue.style.color = 'var(--primary-dark)';
        
        setTimeout(() => {
            priceValue.textContent = price;
            priceCurrency.textContent = `DT / ${size}`;
            
            setTimeout(() => {
                priceValue.style.transform = 'scale(1)';
                priceValue.style.color = '';
            }, 200);
        }, 150);
    }
}

// ============= INITIALIZE PRODUCT PRICES ON LOAD =============
function initializeProductPrices() {
    document.querySelectorAll('.product-card').forEach(card => {
        const activeBtn = card.querySelector('.size-btn.active');
        if (activeBtn) {
            const size = activeBtn.dataset.size;
            const price = parseFloat(activeBtn.dataset.price);
            
            // Mettre à jour le prix sans animation au chargement
            const priceValue = card.querySelector('.price-value');
            const priceCurrency = card.querySelector('.price-currency');
            
            if (priceValue && priceCurrency) {
                priceValue.textContent = price;
                priceCurrency.textContent = size === '500g' ? 'DT' : 'DT / kg';
            }
        }
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    Object.assign(ripple.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.6)',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'scale(0)',
        animation: 'ripple 0.6s ease-out',
        pointerEvents: 'none'
    });
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ============= CART MANAGEMENT =============
function saveCart() {
    try {
        localStorage.setItem('honeyCart', JSON.stringify(cart));
    } catch (e) {
        console.warn('Could not save cart to localStorage:', e);
    }
}

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('honeyCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.warn('Could not load cart from localStorage:', e);
        cart = [];
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.add('show');
        
        // Bounce animation
        badge.style.animation = 'none';
        setTimeout(() => {
            badge.style.animation = 'badgePulse 2s ease-in-out infinite';
        }, 10);
    } else {
        badge.classList.remove('show');
    }
}

// ============= QUANTITY CONTROLS =============
function decreaseQty(btn) {
    const valueSpan = btn.nextElementSibling;
    let qty = parseInt(valueSpan.textContent);
    
    if (qty > 1) {
        qty--;
        animateNumber(valueSpan, qty);
        
        // Haptic feedback (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
}

function increaseQty(btn) {
    const valueSpan = btn.previousElementSibling;
    let qty = parseInt(valueSpan.textContent);
    
    qty++;
    animateNumber(valueSpan, qty);
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

function animateNumber(element, newValue) {
    element.style.transform = 'scale(1.3)';
    element.style.color = 'var(--primary)';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        setTimeout(() => {
            element.style.color = '';
        }, 200);
    }, 150);
}

// ============= ADD TO CART =============
function addToCart(btn) {
    const card = btn.closest('.product-card');
    const productName = card.dataset.product;
    const activeSize = card.querySelector('.size-btn.active');
    const size = activeSize.dataset.size;
    const price = parseFloat(activeSize.dataset.price);
    const quantity = parseInt(card.querySelector('.quantity-value').textContent);

    // Check if item exists
    const existingIndex = cart.findIndex(item => 
        item.product === productName && item.size === size
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            product: productName,
            size: size,
            price: price,
            quantity: quantity
        });
    }

    // Animate button
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 200);

    saveCart();
    updateCartBadge();
    showToast(productName, size, quantity);
    
    // Reset quantity
    card.querySelector('.quantity-value').textContent = '1';
    
    // Confetti effect
    createConfetti(btn);
}

// ============= CONFETTI EFFECT =============
function createConfetti(button) {
    const colors = ['#f4a623', '#e88b0c', '#ffc14d', '#ff6b6b', '#4ecdc4'];
    const confettiCount = 15;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 * i) / confettiCount;
        const velocity = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        Object.assign(confetti.style, {
            position: 'fixed',
            left: `${centerX}px`,
            top: `${centerY}px`,
            width: '8px',
            height: '8px',
            background: color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '10000',
            animation: `confettiFall 1s ease-out forwards`
        });

        confetti.style.setProperty('--tx', `${tx}px`);
        confetti.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 1000);
    }
}

// Confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ============= TOAST NOTIFICATION =============
function showToast(product, size, quantity) {
    const toast = document.getElementById('toast');
    const message = document.getElementById('toastMessage');
    
    if (!toast || !message) return;
    
    message.textContent = `${product} (${size}) × ${quantity}`;
    toast.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (toast.classList.contains('show')) {
            closeToast();
        }
    }, 5000);
}

function closeToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
}

// ============= CART MODAL =============
function openCart() {
    renderCart();
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsDiv || !cartSummary) return;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Votre panier est vide</h3>
                <p>Ajoutez des produits pour commencer vos achats</p>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }

    // Render cart items
    let html = '';
    cart.forEach((item, index) => {
        const total = (item.price * item.quantity).toFixed(2);
        html += `
            <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                <div class="cart-item-image">🍯</div>
                <div class="cart-item-info">
                    <h4>${item.product}</h4>
                    <div class="cart-item-details">
                        Taille: ${item.size} • Prix unitaire: ${item.price} DT
                    </div>
                    <div class="cart-item-quantity">
                        <button class="cart-qty-btn" onclick="updateCartQuantity(${index}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="cart-qty-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">${total} DT</div>
                    <button class="remove-item" onclick="removeFromCart(${index})">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = html;

    // Render summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartSummary.innerHTML = `
        <div class="summary-row">
            <span>Sous-total:</span>
            <span>${subtotal.toFixed(2)} DT</span>
        </div>
        <div class="summary-row">
            <span>Livraison:</span>
            <span>À calculer</span>
        </div>
        <div class="summary-total">
            <span>TOTAL:</span>
            <span>${subtotal.toFixed(2)} DT</span>
        </div>
        <button class="checkout-btn" onclick="proceedToCheckout()">
            Passer la commande
        </button>
    `;
}

function updateCartQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            saveCart();
            renderCart();
            updateCartBadge();
        }
    }
}

function removeFromCart(index) {
    // Animate removal
    const items = document.querySelectorAll('.cart-item');
    if (items[index]) {
        items[index].style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            cart.splice(index, 1);
            saveCart();
            renderCart();
            updateCartBadge();
        }, 300);
    }
}

// Removal animation
const removalStyle = document.createElement('style');
removalStyle.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(removalStyle);

// ============= CHECKOUT =============
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }

    closeCart();
    renderCheckoutSummary();
    
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderCheckoutSummary() {
    const summaryDiv = document.getElementById('checkoutSummary');
    if (!summaryDiv) return;

    let html = '<h3>Récapitulatif de la commande</h3>';
    
    cart.forEach(item => {
        const total = (item.price * item.quantity).toFixed(2);
        html += `
            <div class="order-item">
                <span>${item.product} (${item.size}) × ${item.quantity}</span>
                <span>${total} DT</span>
            </div>
        `;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    html += `
        <div class="order-summary-total">
            <span>TOTAL:</span>
            <span id="checkoutTotal">${subtotal.toFixed(2)} DT</span>
        </div>
        <div class="delivery-info" id="deliveryInfo" style="display: none;">
            <p id="deliveryMessage"></p>
        </div>
    `;

    summaryDiv.innerHTML = html;
}

function calculateDelivery() {
    const city = document.getElementById('customerCity')?.value;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('checkoutTotal');
    const deliveryInfo = document.getElementById('deliveryInfo');
    const deliveryMessage = document.getElementById('deliveryMessage');
    
    if (!city || !totalElement || !deliveryInfo || !deliveryMessage) return;

    if (city === 'Sidi Bouzid') {
        deliveryFee = 0;
        deliveryInfo.className = 'delivery-info';
        deliveryInfo.style.display = 'block';
        deliveryMessage.innerHTML = '🎉 <strong>Livraison gratuite</strong> pour Sidi Bouzid !';
    } else {
        deliveryFee = 5;
        deliveryInfo.className = 'delivery-info paid';
        deliveryInfo.style.display = 'block';
        deliveryMessage.innerHTML = '🚚 Frais de livraison: <strong>5 DT</strong>';
    }

    const total = subtotal + deliveryFee;
    
    // Animate total change
    animateNumberChange(totalElement, total.toFixed(2) + ' DT');
}

function animateNumberChange(element, newValue) {
    element.style.transform = 'scale(1.1)';
    element.style.color = 'var(--primary-dark)';
    
    setTimeout(() => {
        element.textContent = newValue;
        element.style.transform = 'scale(1)';
        setTimeout(() => {
            element.style.color = '';
        }, 200);
    }, 150);
}

// ============= ORDER SUBMISSION =============
function getOrderData() {
    const name = document.getElementById('customerName')?.value;
    const phone = document.getElementById('customerPhone')?.value;
    const city = document.getElementById('customerCity')?.value;
    const address = document.getElementById('customerAddress')?.value;
    const message = document.getElementById('customerMessage')?.value;

    if (!name || !phone || !city || !address) {
        showError('Veuillez remplir tous les champs obligatoires (*)');
        return null;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;

    return {
        name, phone, city, address, message,
        cart: cart,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: total.toFixed(2)
    };
}

function formatOrderMessage(data) {
    let message = `🍯 NOUVELLE COMMANDE - MIEL DE WAHBI\n\n`;
    message += `📦 COMMANDE:\n`;
    
    data.cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        message += `• ${item.product} (${item.size}) × ${item.quantity} = ${itemTotal} DT\n`;
    });

    message += `\n• Sous-total: ${data.subtotal} DT\n`;
    message += `• Livraison: ${data.deliveryFee === '0.00' ? 'GRATUITE 🎁' : data.deliveryFee + ' DT'}\n`;
    message += `💰 TOTAL: ${data.total} DT\n\n`;

    message += `👤 CLIENT:\n`;
    message += `• Nom: ${data.name}\n`;
    message += `• 📞 Téléphone: ${data.phone}\n`;
    message += `• 🏙️ Ville: ${data.city}\n`;
    message += `• 📍 Adresse: ${data.address}`;

    if (data.message) {
        message += `\n\n💬 Message: ${data.message}`;
    }

    return message;
}

function sendWhatsAppOrder() {
    const orderData = getOrderData();
    if (!orderData) return;

    const message = formatOrderMessage(orderData);
    const whatsappURL = `https://wa.me/21697244049?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
    showSuccessMessage('WhatsApp');
}

function sendFacebookOrder() {
    const orderData = getOrderData();
    if (!orderData) return;

    const message = formatOrderMessage(orderData);
    
    navigator.clipboard.writeText(message).then(() => {
        alert('✅ Message copié ! Collez-le dans Facebook Messenger.');
        window.open('https://m.me/abdel.gharbi.7', '_blank');
        showSuccessMessage('Facebook Messenger');
    }).catch(() => {
        alert('Veuillez copier ce message et l\'envoyer via Messenger:\n\n' + message);
        window.open('https://m.me/abdel.gharbi.7', '_blank');
    });
}

function callPhone() {
    const orderData = getOrderData();
    if (!orderData) return;

    if (confirm('📞 Vous allez appeler Miel de Wahbi au +216 97 244 049\n\nPréparez vos informations de commande !')) {
        window.location.href = 'tel:+21697244049';
        showSuccessMessage('Appel téléphonique');
    }
}

function showSuccessMessage(platform) {
    closeCheckout();
    
    // Custom success modal
    const successHtml = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h2 style="color: var(--primary); margin-bottom: 1rem;">Commande envoyée !</h2>
            <p>Votre commande a été envoyée via ${platform}.</p>
            <p>Nous vous contacterons rapidement ! 🍯</p>
        </div>
    `;
    
    alert(`Merci ! Votre commande va être envoyée via ${platform}. Nous vous contacterons rapidement ! 🍯`);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartBadge();
}

function showError(message) {
    alert('❌ ' + message);
}

// ============= UTILITY FUNCTIONS =============
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function handleOutsideClick(event) {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (event.target.classList.contains('modal-overlay')) {
        if (cartModal && cartModal.classList.contains('active')) {
            closeCart();
        }
        if (checkoutModal && checkoutModal.classList.contains('active')) {
            closeCheckout();
        }
    }
}

function handleKeyboardNavigation(event) {
    // ESC key closes modals
    if (event.key === 'Escape') {
        closeCart();
        closeCheckout();
        closeToast();
    }
}

// ============= PERFORMANCE OPTIMIZATION =============
// Debounce function for expensive operations
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

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============= EXPORT FOR TESTING =============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        calculateDelivery
    };
}

console.log('🚀 Miel de Wahbi - Premium JavaScript loaded successfully!');
