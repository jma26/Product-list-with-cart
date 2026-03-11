let cart = [];

const buttons = document.querySelectorAll('.product__add-to-cart');
buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const productEl = button.closest('.product');
    const title = productEl.querySelector('.product__info-title').textContent;
    const price = parseFloat(productEl.querySelector('.product__info-price').textContent.replace('$', ''));
    console.log('What is the price', price.toFixed(2));
    const product = {
      title,
      price,
      quantity: 1
    }
    // Check if product exists in cart
    // If yes, update quantity
    const isItemInCart = cart.find(product => product.title === title);
    if (isItemInCart) {
      isItemInCart.quantity += 1;
    } else {
      cart.push(product);
    }
    // Update Cart
    displayCart();
  });

})

// Cart list container
const cartListEl = document.querySelector('.cart__list-wrapper');
// Attach event listeners
cartListEl.addEventListener('click', function(e) {
  const removeLineItemBtn = e.target.closest('.cart__line-item-button-removal');
  if (!removeLineItemBtn) return;

  const cartItemEl = removeLineItemBtn.closest('.cart__line-item');
  const lineItemId = cartItemEl.dataset.id;

  removeLineItem(lineItemId);
  displayCart(cart);
})

// Display cart
function displayCart() {

  // Remove all child nodes in cart
  cartListEl.replaceChildren();
  let cartSubtotal = 0;
  
  // Build out the line items in cart
  cart.map((item) => {
    cartSubtotal += (item.price) * (item.quantity);
    const lineTotal = item.price * item.quantity;
    const cartItemEl = document.createElement('div');
    cartItemEl.classList.add('cart__line-item');
    cartItemEl.dataset.id = item.title;
    cartItemEl.innerHTML = `
      <h3 class="cart__line-item-title">${item.title}</h3>
      <div class="cart__line-item-info-wrapper">
        <span class="cart__line-item-quantity">${item.quantity}x</span>
        <span class="cart__line-item-price">@ $${item.price.toFixed(2)}</span>
        <span class="cart__line-item-subtotal">$${lineTotal.toFixed(2)}</span>
      </div>
      <button class="cart__line-item-button-removal" data-id='${item.title}'><img src="./assets/images/icon-remove-item.svg"></button>
    `;
    cartListEl.appendChild(cartItemEl);
  });

  // Display Subtotal
  const cartSubtotalEl = document.createElement('div');
  cartSubtotalEl.classList.add('cart__subtotal-wrapper');
  cartSubtotalEl.innerHTML = `
    <p class="cart__subtotal">
      Order Total
      <span class="cart__subtotal-amount">$${cartSubtotal.toFixed(2)}</span>
    </p>
    <p class="carbon-neutral-delivery">
      <img src="./assets/images/icon-carbon-neutral.svg" alt="Carbon neutral delivery tree icon">
      <span>This is a <span class="emphasis">carbon-neutral</span> delivery</span>
    </p>
    <button class="cart__confirm-order-button">Confirm Order</button>
  `;
  cartListEl.appendChild(cartSubtotalEl);

  // Update cart counter
  const cartQuantityEl = document.querySelector('.cart__counter');
  cartQuantityEl.textContent = cart.length;
}


// Remove Line Item
function removeLineItem(lineItemId) {
  cart = cart.filter(item => item.title !== lineItemId);
  console.log('Cart after removal', cart);
}


