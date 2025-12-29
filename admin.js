/**
 * PANNEAU D'ADMINISTRATION - MIEL DE WAHBI
 * Gestion facile des produits sans toucher au code
 */

// ============= DONNÉES PAR DÉFAUT =============
let products = [
    {
        id: 1,
        name: "Miel d'Eucalyptus",
        description: "Vertus respiratoires exceptionnelles, idéal pour l'hiver",
        price500g: 32.5,
        price1kg: 65,
        emoji: "🍯",
        inStock: true
    },
    {
        id: 2,
        name: "Miel de Thym",
        description: "Propriétés antiseptiques exceptionnelles, rare et précieux",
        price500g: 32.5,
        price1kg: 65,
        emoji: "🍯",
        inStock: true
    },
    {
        id: 3,
        name: "Miel de Fleurs",
        description: "Miel polyfloral doux et parfumé, récolte artisanale",
        price500g: 32.5,
        price1kg: 65,
        emoji: "🍯",
        inStock: true
    },
    {
        id: 4,
        name: "Miel d'Agrumes",
        description: "Miel fruité et délicat, parfum d'orangers tunisiens",
        price500g: 32.5,
        price1kg: 65,
        emoji: "🍯",
        inStock: true
    }
];

let settings = {
    phone: "+216 97 244 049",
    facebook: "https://www.facebook.com/abdel.gharbi.7",
    address: "Sidi Bouzid, Tunisie",
    deliveryFee: 5,
    adminUsername: "admin",
    adminPassword: "admin123"
};

// ============= INITIALISATION =============
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    checkLogin();
});

// ============= AUTHENTIFICATION =============
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === settings.adminUsername && password === settings.adminPassword) {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('errorMessage').style.display = 'none';
        }, 3000);
    }
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('adminLoggedIn');
        location.reload();
    }
}

function checkLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderProducts();
    updateStats();
}

// ============= GESTION DES ONGLETS =============
function switchTab(tabName) {
    // Désactiver tous les onglets
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activer l'onglet sélectionné
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// ============= GESTION DES PRODUITS =============
function renderProducts() {
    const container = document.getElementById('productsList');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <p style="font-size: 3rem; margin-bottom: 1rem;">📦</p>
                <p style="font-size: 1.25rem;">Aucun produit pour le moment</p>
                <p style="margin-top: 0.5rem;">Ajoutez votre premier produit !</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-item-image">
                ${product.emoji}
            </div>
            <div class="product-item-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-item-price">
                    500g: ${product.price500g} DT • 1kg: ${product.price1kg} DT
                </div>
            </div>
            <div class="product-item-actions">
                <button class="btn btn-edit" onclick="editProduct(${product.id})">
                    ✏️ Modifier
                </button>
                <button class="btn btn-delete" onclick="deleteProduct(${product.id})">
                    🗑️ Supprimer
                </button>
            </div>
        </div>
    `).join('');
}

function addProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('newProductName').value;
    const description = document.getElementById('newProductDescription').value;
    const price1kg = parseFloat(document.getElementById('newProductPrice').value);
    const price500g = price1kg / 2;
    const emoji = document.getElementById('newProductEmoji').value || '🍯';
    
    const newProduct = {
        id: Date.now(),
        name: name,
        description: description,
        price500g: price500g,
        price1kg: price1kg,
        emoji: emoji,
        inStock: true
    };
    
    products.push(newProduct);
    saveData();
    
    // Réinitialiser le formulaire
    event.target.reset();
    
    // Afficher message de succès
    showSuccess('✅ Produit ajouté avec succès !');
    
    // Revenir à l'onglet produits
    switchTab('products');
    document.querySelector('.tab').click();
    
    renderProducts();
    updateStats();
    exportToMainSite();
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProduct500g').value = product.price500g;
    document.getElementById('editProduct1kg').value = product.price1kg;
    
    document.getElementById('editModal').classList.add('active');
}

function saveEdit(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editProductId').value);
    const product = products.find(p => p.id === id);
    
    if (product) {
        product.name = document.getElementById('editProductName').value;
        product.description = document.getElementById('editProductDescription').value;
        product.price500g = parseFloat(document.getElementById('editProduct500g').value);
        product.price1kg = parseFloat(document.getElementById('editProduct1kg').value);
        
        saveData();
        renderProducts();
        closeEditModal();
        showSuccess('✅ Produit modifié avec succès !');
        exportToMainSite();
    }
}

function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderProducts();
        updateStats();
        showSuccess('✅ Produit supprimé avec succès !');
        exportToMainSite();
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

// ============= PARAMÈTRES =============
function saveSettings(event) {
    event.preventDefault();
    
    settings.phone = document.getElementById('settingsPhone').value;
    settings.facebook = document.getElementById('settingsFacebook').value;
    settings.address = document.getElementById('settingsAddress').value;
    settings.deliveryFee = parseFloat(document.getElementById('settingsDelivery').value);
    
    const newPassword = document.getElementById('settingsPassword').value;
    if (newPassword) {
        settings.adminPassword = newPassword;
        document.getElementById('settingsPassword').value = '';
    }
    
    saveData();
    showSuccess('✅ Paramètres enregistrés avec succès !');
    exportToMainSite();
}

// ============= STATISTIQUES =============
function updateStats() {
    document.getElementById('totalProducts').textContent = products.length;
}

// ============= STOCKAGE =============
function saveData() {
    try {
        localStorage.setItem('honeyProducts', JSON.stringify(products));
        localStorage.setItem('honeySettings', JSON.stringify(settings));
    } catch (e) {
        console.error('Erreur de sauvegarde:', e);
    }
}

function loadData() {
    try {
        const savedProducts = localStorage.getItem('honeyProducts');
        const savedSettings = localStorage.getItem('honeySettings');
        
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        }
        
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    } catch (e) {
        console.error('Erreur de chargement:', e);
    }
}

// ============= EXPORT VERS LE SITE PRINCIPAL =============
function exportToMainSite() {
    // Générer le HTML des produits
    const productsHTML = products.map(product => `
            <div class="product-card" data-product="${product.name}" data-aos="fade-up">
                <div class="product-image">
                    <img src="images/placeholder.jpg" alt="${product.name}">
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
    `).join('\n');

    // Sauvegarder dans localStorage pour que index.html puisse le lire
    localStorage.setItem('generatedProductsHTML', productsHTML);
    
    console.log('✅ Produits exportés vers le site principal !');
}

// ============= MESSAGES =============
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 4000);
}

// ============= TÉLÉCHARGEMENT DES DONNÉES =============
function downloadData() {
    const data = {
        products: products,
        settings: settings
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'miel-de-wahbi-backup.json';
    link.click();
}

console.log('🍯 Panneau d\'administration chargé !');
