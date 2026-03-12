// GLOBALS
let cart = [];
const productListEl = document.querySelector('.product__section-list');
const cartListEl = document.querySelector('.cart__list-wrapper');
const cartQuantityEl = document.querySelector('.cart__counter');
const confirmationOrderListEl = document.querySelector('.confirmation-order__list');
const dialogEl = document.querySelector('.confirmation-order__dialog');

// EVENT DELEGATION FOR PRODUCT LIST
productListEl.addEventListener('click', function(e) {
  const productEl = e.target.closest('.product');
  if (!productEl) return;

  const id = productEl.querySelector('.product__info-wrapper').dataset.id;
  const title = productEl.querySelector('.product__info-title').textContent;
  const category = productEl.querySelector('.product__info-category').textContent;
  const price = parseFloat(productEl.querySelector('.product__info-price').textContent.replace('$', ''));

  // Add to Cart
  if (e.target.closest('.product__add-to-cart')) {
    addToCart({ id, title, category, price, productEl })
  }

  // Handle quantity increase/decrease
  if (e.target.closest('.quantity-increase')) changeQuantity(id, 1);
  if (e.target.closest('.quantity-decrease')) changeQuantity(id, -1);
});

// ADD TO CART FUNCTION
function addToCart({ id, title, category, price, productEl }) {
  const existingItem = cart.find(item => item.title === title);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
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
function changeQuantity(id, quantity) {
  const cartItem = cart.find(item => item.id === id);
  if (!cartItem) return;

  cartItem.quantity += quantity;
  if (cartItem.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  // Update product quantity display;
  const productInfoEl = document.querySelector(`.product__info-wrapper[data-id="${id}"]`);
  const productEl = productInfoEl.closest('.product');
  const quantityEl = productEl.querySelector('.product__quantity-selector .quantity-value');
  if (quantityEl) quantityEl.textContent = cartItem.quantity;

  displayCart();
}

// REMOVE ITEM FROM CART
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  // Restore add-to-cart button in product list
  const productInfoEl = document.querySelector(`.product__info-wrapper[data-id="${id}"]`);
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
  console.log('What is in my cart', cart);
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
    cartItemEl.dataset.id = item.id;
    cartItemEl.innerHTML = `
      <h3 class="cart__line-item-title">${item.title}</h3>
      <div class="cart__line-item-info-wrapper">
        <span class="cart__line-item-quantity">${item.quantity}x</span>
        <span class="cart__line-item-price">@ $${item.price.toFixed(2)}</span>
        <span class="cart__line-item-subtotal">$${lineTotal}</span>
      </div>
      <button class="cart__line-item-button-removal" data-id="${item.id}">
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
}

function displayConfirmationOrder() {
  confirmationOrderListEl.replaceChildren();
  let orderTotal = 0;
  cart.forEach((item) => {
    orderTotal += item.price * item.quantity;
    const lineTotal = (item.price * item.quantity).toFixed(2);
    const orderItemEl = document.createElement('div');
    orderItemEl.classList.add('order__line-item');
    orderItemEl.innerHTML = `
      <img class="order__line-item-thumbnail" src="./assets/images/image-${item.id}-thumbnail.jpg" alt="${item.title}">
      <div class="order__line-item">
        <h3 class="order__line-item-title">${item.title}</h3>
        <div class="order__line-item-info-wrapper">
          <span class="order__line-item-quantity">${item.quantity}x</span>
          <span class="order__line-item-price">@ $${item.price.toFixed(2)}</span>
        </div>
        <span class="order__line-item-subtotal">$${lineTotal}</span>
      </div>
    `;
    confirmationOrderListEl.appendChild(orderItemEl);
  });

    // Order total section
  const orderTotalEl = document.createElement('div');
  orderTotalEl.classList.add('order-total__wrapper');
  orderTotalEl.innerHTML = `
    <p class="order-total">
      Order Total
      <span class="order-total__amount">$${orderTotal.toFixed(2)}</span>
    </p>
  `;

  confirmationOrderListEl.append(orderTotalEl);

  const newOrderBtn = document.createElement('button');
  newOrderBtn.classList.add('new-order__button');
  newOrderBtn.textContent = 'Start New Order';
  dialogEl.appendChild(newOrderBtn);

  dialogEl.showModal();
}

// EVENT DELEGATION FOR CART LIST
// CART REMOVEAL BTNS
// ORDER CONFIRMATION BTN
cartListEl.addEventListener('click', function(e) {
  if (e.target.closest('.cart__confirm-order-button')) displayConfirmationOrder();

  const removeBtn = e.target.closest('.cart__line-item-button-removal');
  if (!removeBtn) return;
  
  const id = removeBtn.dataset.id;
  removeFromCart(id);
});

// EVENT DELEGATION FOR DIALOG MODAL
dialogEl.addEventListener('click', function() {
  const newOrderBtn = document.querySelector('.new-order__button');
  if (!newOrderBtn) return;

  refreshPage();
})

// Refresh page to simulate "start new order"
function refreshPage() {
  window.location.reload();
}