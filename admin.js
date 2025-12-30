/**
 * PANNEAU D'ADMINISTRATION - MIEL DE WAHBI
 * Version corrigée avec synchronisation automatique
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
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
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
    
    event.target.reset();
    showSuccess('✅ Produit ajouté avec succès ! Rechargez index.html pour voir les changements.');
    
    switchTab('products');
    document.querySelector('.tab').click();
    
    renderProducts();
    updateStats();
    
    // Déclencher l'événement de mise à jour
    notifyMainSite();
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
        showSuccess('✅ Produit modifié avec succès ! Rechargez index.html pour voir les changements.');
        
        // Déclencher l'événement de mise à jour
        notifyMainSite();
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
        showSuccess('✅ Produit supprimé avec succès ! Rechargez index.html pour voir les changements.');
        
        // Déclencher l'événement de mise à jour
        notifyMainSite();
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
    showSuccess('✅ Paramètres enregistrés avec succès ! Rechargez index.html pour voir les changements.');
    
    // Déclencher l'événement de mise à jour
    notifyMainSite();
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
        console.log('💾 Données sauvegardées:', {
            products: products.length,
            settings: settings
        });
    } catch (e) {
        console.error('❌ Erreur de sauvegarde:', e);
        alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
}

function loadData() {
    try {
        const savedProducts = localStorage.getItem('honeyProducts');
        const savedSettings = localStorage.getItem('honeySettings');
        
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            console.log('✅ Produits chargés:', products.length);
        }
        
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
            console.log('✅ Paramètres chargés');
        }
    } catch (e) {
        console.error('❌ Erreur de chargement:', e);
    }
}

// ============= NOTIFICATION AU SITE PRINCIPAL =============
function notifyMainSite() {
    // Créer un événement personnalisé pour notifier le site principal
    localStorage.setItem('lastUpdate', Date.now().toString());
    
    console.log('🔔 Notification envoyée au site principal');
    console.log('📊 Données actuelles:', {
        products: products.length,
        settings: settings
    });
}

// ============= MESSAGES =============
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Scroll vers le message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 6000);
}

// ============= BOUTON DE PRÉVISUALISATION =============
function previewChanges() {
    // Ouvrir index.html dans un nouvel onglet
    window.open('index.html', '_blank');
}

console.log('🍯 Panneau d\'administration chargé !');
console.log('📊 État actuel:', {
    products: products.length,
    settings: settings
});
