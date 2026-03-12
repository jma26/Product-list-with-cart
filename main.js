// GLOBALS
let cart = [];
const productListEl = document.querySelector('.product__section-list');
const cartListEl = document.querySelector('.cart__list-wrapper');
const cartQuantityEl = document.querySelector('.cart__counter');

// EVENT DELEGATION FOR PRODUCT LIST
productListEl.addEventListener('click', function(e) {
  const productEl = e.target.closest('.product');
  if (!productEl) return;

  const title = productEl.querySelector('.product__info-title').textContent;
  const category = productEl.querySelector('.product__info-category').textContent;
  const price = parseFloat(productEl.querySelector('.product__info-price').textContent.replace('$', ''));

  // Add to Cart
  if (e.target.closest('.product__add-to-cart')) {
    addToCart({ title, category, price, productEl })
  }

  // Handle quantity increase/decrease
  if (e.target.closest('.quantity-increase')) changeQuantity(title, 1);
  if (e.target.closest('.quantity-decrease')) changeQuantity(title, -1);
});

// ADD TO CART FUNCTION
function addToCart({ title, category, price, productEl }) {
  const existingItem = cart.find(item => item.title === title);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      title,
      category,
      price,
      quantity: 1
    })
  }

  // Replace Add-to-Cart with quantity selector
  replaceAddToCartWithQuantitySelector(productEl, title);

  displayCart();
}

// CHANGE QUANTITY
function changeQuantity(title, quantity) {
  const cartItem = cart.find(item => item.title === title);
  if (!cartItem) return;

  cartItem.quantity += quantity;
  if (cartItem.quantity <= 0) {
    removeFromCart(title);
    return;
  }

  // Update product quantity display;
  const productInfoEl = document.querySelector(`.product__info-wrapper[data-id="${title}"]`);
  const productEl = productInfoEl.closest('.product');
  const quantityEl = productEl.querySelector('.product__quantity-selector .quantity-value');
  if (quantityEl) quantityEl.textContent = cartItem.quantity;

  displayCart();
}

// REMOVE ITEM FROM CART
function removeFromCart(title) {
  cart = cart.filter(item => item.title !== title);

  // Restore add-to-cart button in product list
  console.log('What is the title', title);
  const productInfoEl = document.querySelector(`.product__info-wrapper[data-id="${title}"]`);
  console.log('What is this productInfoEl', productInfoEl);
  if (productInfoEl) {
    const productEl = productInfoEl.closest('.product');
    restoreAddToCartButton(productEl);
  }

  displayCart();
}

// REPLACE ADD-TO-CART WITH QUANTITY SELECTOR
function replaceAddToCartWithQuantitySelector(productEl, title) {
  const addToCartBtnEl = productEl.querySelector('.product__add-to-cart');
  if (!addToCartBtnEl) return;

  const cartItem = cart.find(item => item.title === title);

  const quantitySelector = document.createElement('div');
  quantitySelector.classList.add('product__quantity-selector');
  quantitySelector.innerHTML = `
    <button class="quantity-decrease">
      <img src="./assets/images/icon-decrement-quantity.svg" alt="Decrease">
    </button>
    <span class="quantity-value">${cartItem.quantity}</span>
    <button class="quantity-increase">
      <img src="./assets/images/icon-increment-quantity.svg" alt="Increase">
    </button>
  `;

  addToCartBtnEl.replaceWith(quantitySelector);
}

// RESTORE ADD-TO-CART BUTTON
function restoreAddToCartButton(productEl) {
  const quantitySelectorEl = productEl.querySelector('.product__quantity-selector');
  if (!quantitySelectorEl) return;

  const addToCartBtn = document.createElement('button');
  addToCartBtn.classList.add('product__add-to-cart');
  addToCartBtn.innerHTML = `
    <img class="product__add-to-cart-icon" src="./assets/images/icon-add-to-cart.svg">
    Add to Cart
  `;

  quantitySelectorEl.replaceWith(addToCartBtn);
}

// DISPLAY CART
function displayCart() {
  cartListEl.replaceChildren();

  if (cart.length === 0) {
    cartListEl.innerHTML = `
      <img class="cart__empty-icon" src="./assets/images/illustration-empty-cart.svg" alt="Empty cart icon">
      <p class="cart__empty-text">Your added items will appear here</p>
    `;
    cartQuantityEl.textContent = 0;
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    const lineTotal = (item.price * item.quantity).toFixed(2);

    const cartItemEl = document.createElement('div');
    cartItemEl.classList.add('cart__line-item');
    cartItemEl.dataset.id = item.title;
    cartItemEl.innerHTML = `
      <h3 class="cart__line-item-title">${item.title}</h3>
      <div class="cart__line-item-info-wrapper">
        <span class="cart__line-item-quantity">${item.quantity}x</span>
        <span class="cart__line-item-price">@ $${item.price.toFixed(2)}</span>
        <span class="cart__line-item-subtotal">$${lineTotal}</span>
      </div>
      <button class="cart__line-item-button-removal" data-id="${item.title}">
        <img src="./assets/images/icon-remove-item.svg" alt="Remove">
      </button>
    `;
    cartListEl.appendChild(cartItemEl);
  });

  // Subtotal section
  const subtotalEl = document.createElement('div');
  subtotalEl.classList.add('cart__subtotal-wrapper');
  subtotalEl.innerHTML = `
    <p class="cart__subtotal">
      Order Total
      <span class="cart__subtotal-amount">$${subtotal.toFixed(2)}</span>
    </p>
    <p class="carbon-neutral-delivery">
      <img src="./assets/images/icon-carbon-neutral.svg" alt="Carbon neutral delivery">
      <span>This is a <span class="emphasis">carbon-neutral</span> delivery</span>
    </p>
    <button class="cart__confirm-order-button">Confirm Order</button>
  `;
  cartListEl.appendChild(subtotalEl);

  cartQuantityEl.textContent = cart.length;

  // Event delegation for cart remove buttons
  cartListEl.addEventListener('click', function(e) {
    const removeBtn = e.target.closest('.cart__line-item-button-removal');
    if (!removeBtn) return;

    const title = removeBtn.dataset.id;
    removeFromCart(title);
  });
}