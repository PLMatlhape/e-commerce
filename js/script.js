
import {
  addToCart,
  cart,
  totals,
  removeFromCart,
  users,
  registerUser,
  loginUser,
  wishList,
  list,
  removeFromWishlist
} from "./index.js";

const cartTotalElement = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  //prepolulate the cart from the local storage
  populateCartFromStorage();
  populateWishlistFromStorage();
  renderItemCount();
  renderWishCount();
  //I need to pre-populate the wishlist from the local storage
  populateUsersFromStorage();
  checkLoggedInUser();
 setupCategorySelector();
});

function setupCategorySelector() {
  const originalSelect = document.getElementById("category");
  const radioButtons = document.querySelectorAll(
    '.category-option input[type="radio"]'
  );

  // Set initial state from original select
  const initialValue = originalSelect.value;
  radioButtons.forEach((radio) => {
    if (radio.value === initialValue) {
      radio.checked = true;
    }
  });

  // Update original select and filter products when custom option is selected
  radioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.checked) {
        originalSelect.value = this.value;

        // Trigger change event and filter products
        const event = new Event("change");
        originalSelect.dispatchEvent(event);
        filterProductsByCategory(this.value);
      }
    });
  });
  // Also listen to changes on the original select
  originalSelect.addEventListener("change", function () {
    filterProductsByCategory(this.value);
    radioButtons.forEach((radio) => {
      radio.checked = radio.value === this.value;
    });
  });
}

let allProducts = [];

async function fetchProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    allProducts = data.products; // Store all products
    displayProducts(allProducts); // Display all products initially
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function displayProducts(products) {
  const productContainer = document.querySelector('.product-container');
  
  if (!products || products.length === 0) {
    productContainer.innerHTML = '<p class="no-products">No products found in this category</p>';
    return;
  }

  productContainer.innerHTML = '';
  products.forEach(product => {
    const discountPercentage = Math.round(product.discountPercentage);
    const price = Math.round(product.price);

    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
      <div class="favourite"><i class="bi bi-heart-fill"></i></div>
      <img src="${product.thumbnail}" alt="${product.title}">
      <div class="discount">${discountPercentage}%</div>        
      <div class="details">
        <div class="reviews"><i class="bi bi-star-fill"></i> ${product.rating}</div>
        <div class="title">${product.title}</div>
        <div class="price">R${price}.00</div>
        <div class="btn-group">
          <button class="btn-primary">Add to Bag</button>
          <button class="btn-secondary">See more...</button>
        </div>
      </div>
    `;

    productContainer.appendChild(productElement);
  });

  // Reattach event listeners to the new products
  attachProductEventListeners(products);
}


function filterProductsByCategory(category) {
  if (!category || category === "") {
    // If no category selected, show all products
    displayProducts(allProducts);
    return;
  }

  // Filter products by category (case insensitive)
  const filteredProducts = allProducts.filter(product => 
    product.category.toLowerCase().includes(category.toLowerCase())
  );
  
  // If no products found, show a message
  if (filteredProducts.length === 0) {
    const productContainer = document.querySelector('.product-container');
    productContainer.innerHTML = '<p class="no-products">No products found in this category</p>';
  } else {
    displayProducts(filteredProducts);
  }
}

function attachProductEventListeners(products) {
  // Add to Bag button
  const addToBagBtns = document.querySelectorAll(".btn-primary");
  addToBagBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      try {
        const product = products[index];
        const id = product.id;
        const name = product.title;
        const price = Math.round(product.price);
        const thumbnail = product.thumbnail;

        addToCart(id, name, price, thumbnail);
        updatePopCount(1, '+');
        totals.cartTotal += price;
        cartTotalElement.textContent = `R${totals.cartTotal}.00`;
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('totals', JSON.stringify(totals));
        window.setTimeout(alert(`${name} has been added to your cart`), 2000);
      }
      catch (error) {
        alert(error.message);
      }
    });
  });

  //add to wishlist
  const addToWishlist = document.querySelectorAll('.favourite');
  addToWishlist.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      try{
        const product = products[index];
        const id = product.id;
        const name = product.title;
        const price = Math.round(product.price);
        const thumbnail = product.thumbnail;
  
        wishList(id, name, price, thumbnail);
        updateWishCount(1, '+');
        totals.wishlistTotal += price;
        // listTotalElement.textContent = `R${totals.wishlistTotal}.00`;
        localStorage.setItem('wishlist', JSON.stringify(list));
        localStorage.setItem('totals', JSON.stringify(totals));
        window.setTimeout(alert(`${name} has been added to your wishlist`), 2000);

      } catch(error) {
        alert(error.message)
      }
    })
  })

  // See more button
  const viewProductModalBtns = document.querySelectorAll(".btn-secondary");
  viewProductModalBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const product = products[index];
      openProductModal(product);
    });
  });
}

const loginBtn = document.getElementById("login-btn");
const loginEmail = document.getElementById("log-in-email");
const loginPassword = document.getElementById("log-in-password");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    try {
      const user = loginUser(loginEmail.value, loginPassword.value);
      alert(`Welcome back, ${user.name}!`);
      viewLoginDialog.style.display = "none";
      viewLoginDialog.close();

      // Store current user email in localStorage
      localStorage.setItem('currentUserEmail', user.email);

      // Update UI to show logged in state
      updateLoginUI(user);

      // Clear fields
      loginEmail.value = "";
      loginPassword.value = "";
    } catch (error) {
      alert(error.message);
    }
  });
}

function updateLoginUI(user) {
  // Change "Sign In" to user's name
  const loginLink = document.querySelector(".login");
  const registerLink = document.querySelector(".register"); // Get the sign up link
  
  if (loginLink) {
    loginLink.textContent = user.name;
    loginLink.href = "#";
    
    // Add logout functionality
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to log out?")) {
        // Reset login UI
        loginLink.textContent = "Sign In";
        loginLink.href = "#";
        
        // Show sign up link again
        if (registerLink) {
          registerLink.style.display = "block";
        }
        
        // Remove currentUserEmail from localStorage
        localStorage.removeItem('currentUserEmail');
        
        alert("You have been logged out");
      }
    });
  }
  
  // Hide the sign up link when logged in
  if (registerLink) {
    registerLink.style.display = "none";
  }
}

function checkLoggedInUser() {
  const storedUsers = localStorage.getItem('users');
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  
  if (storedUsers && currentUserEmail) {
    try {
      const users = JSON.parse(storedUsers);
      const user = users.find(u => u.email === currentUserEmail);
      if (user) {
        updateLoginUI(user);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
}

checkoutBtn.addEventListener("click", () => {
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  
  if (currentUserEmail) {
    // User is logged in - proceed with checkout
    checkoutSuccess();
  } else {
    // User is not logged in - show alert
    alert("You're not logged in. Please log in first to complete your purchase.");

    viewLoginDialog.style.display = "block";
    viewLoginDialog.showModal();
  }
});

function checkoutSuccess() {
  // Clear the cart
  cart.length = 0;
  totals.cartTotal = 0;
  cartTotalElement.textContent = `R${totals.cartTotal}.00`;

  // Update localStorage
  localStorage.removeItem("cart");
  localStorage.setItem("totals", JSON.stringify(totals));
  
  // Update cart count
  updatePopCount(0, 0);
  
  // Show success message
  alert("Checkout successful! Your order has been placed.");
  
  // Refresh cart display if it's open
  if (viewCartDialog.style.display === "block") {
    displayCart();
  }
}

function populateUsersFromStorage() {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    const parsedUsers = JSON.parse(storedUsers);
    parsedUsers.forEach((user) => {
      users.push(user);
    });
  }
}


// Function to populate the cart from local storage
// This function will be called when the page loads
// and will check if there are any items in the local storage
// If there are, it will add them to the cart arraycf
// and update the cart display
function populateCartFromStorage() {
  const storedCart = localStorage.getItem("cart");
  const storedTotals = localStorage.getItem("totals");
  if (storedCart) {
    const parsedCart = JSON.parse(storedCart);
    parsedCart.forEach((item) => {
      cart.push(item);
    });
  }
  if (storedTotals) {
    const parsedTotals = JSON.parse(storedTotals);
    totals.cartTotal = parsedTotals.cartTotal;
    cartTotalElement.textContent = `R${totals.cartTotal}.00`;
  }
}

function populateWishlistFromStorage() {
  const storedCart = localStorage.getItem("wishlist");
  const storedTotals = localStorage.getItem("totals");
  if (storedCart) {
    const parsedCart = JSON.parse(storedCart);
    parsedCart.forEach((item) => {
      list.push(item);
    });
  }
  if (storedTotals) {
    const parsedTotals = JSON.parse(storedTotals);
    totals.wishlistTotal = parsedTotals.wishlistTotal;
    
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const clearWishlistBtn = document.getElementById("clear-wishlist-btn");

  if (clearWishlistBtn) {
    clearWishlistBtn.addEventListener("click", clearWishlist);
  }
});

function clearWishlist() {
  // 1. Clear localStorage
  localStorage.removeItem("wishlist");
  list.length = 0;
  updateWishCount(0, 0)
  totals.wishlistTotal = 0.00;
  localStorage.setItem("totals", JSON.stringify(totals))

  // 2. Optional: Reset any global wishlist array
  if (typeof wishlist !== "undefined" && Array.isArray(wishlist)) {
    list.length = 0;
  }

  // 3. Clear wishlist items in the modal
  const listContainer = document.querySelector(".list-container");
  if (listContainer) {
    listContainer.innerHTML = "<p>Your wishlist is empty.</p>";
  }

  // 4. Reset the total price display
  const wishlistTotal = document.getElementById("wishlist-total");
  if (wishlistTotal) {
    wishlistTotal.textContent = "Total: R 0.00";
  }

  console.log("Wishlist cleared.");
}


//clear button
const clearBtn = document.getElementById("clear-btn");
// const totalPrice = document.getElementById("cart-total");

clearBtn.addEventListener("click", () => {
  clearCart();
  updatePopCount(0, 0);
});

function clearCart() {
  cart.length = 0;
  localStorage.removeItem("cart");
  document.querySelector(".cart-container").innerHTML =
    "<br><br>Your cart is empty !";

  const totalPrice = document.getElementById("cart-total");
  document.querySelector(".cart-total");
  totals.cartTotal = 0.00;
  localStorage.setItem("totals", JSON.stringify({ cartTotal: 0 }));
  totalPrice.innerHTML = "R" + 0.00.toFixed(2);

  const cartModal = document.querySelector(".cart-modal-container");
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = "";
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cart.forEach((item) => {
      cartContainer.innerHTML += `
                    <div class="cart-product">
                        <div>
                            <img src="${item.thumbnail}"/>
                        </div>
                        <div class="right-cart">
                            <div class="center-left">
                                <h3>${item.name}</h3>
                                <div class="bottom-buttons">
                                    <p>In Stock</p>
                                    <div>
                                        <p class="quantity"> <button> - </button> <span class="quantity-span"> 1 </span> <button>+</button> </p>
                                    </div>
                                </div>
                            </div>
                            <div class="center-right">
                                <h3 class="price">R ${item.cartTotal}</h3>
                                <div class="bottom-buttons">
                                    <p><i class="bi bi-trash3"></i> Delete</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
    });
  }
}


function openProductModal(product) {
  const viewProductDialog = document.querySelector(".product-modal");
  const addFromProduct = document.querySelectorAll(".btn-primary-modal");
  const price = Math.round(product.price);

  viewProductDialog.querySelector(".img-div img").src = product.thumbnail;
  viewProductDialog.querySelector(".img-div img").alt = product.title;
  viewProductDialog.querySelector(".name").textContent = product.title;
  viewProductDialog.querySelector(".price").textContent = `R${price}.00`;
  viewProductDialog.querySelector(".reviews span").textContent = product.rating;
  viewProductDialog.querySelector(".descr").textContent = product.description;

  const reviewsDiv = document.querySelector(".reviews-div");
  reviewsDiv.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    reviewsDiv.innerHTML += `
                        <div class="review">
                            <h3 class="review-name">${product.reviews[i].reviewerName}</h3>
                            <p class="review-descr"><em>${product.reviews[i].comment}</em>
                            </p>
                            <br>
                        </div>`;

  }
  viewProductDialog.style.display = "block";
  viewProductDialog.showModal();
}

// Modal for the product details
const addFromProduct = document.querySelectorAll(".btn-primary-modal");
const viewProductDialog = document.querySelector(".product-modal");

// Modal for Cart
const viewCartDialog = document.querySelector(".cart-modal");
const viewCartModal = document.querySelector(".bag");
const cartContainer = document.querySelector(".cart-container");
let cartTotalItems = JSON.parse(localStorage.getItem("totalItems")) || 0;

// Modal for Wishlist
const viewWishlistDialog = document.querySelector(".wishlist-modal");
const viewWishlistModal = document.querySelector(".wishlist");
const wishlistContainer = document.querySelector(".list-container");
let listTotalItems = JSON.parse(localStorage.getItem("totalWishItems")) || 0;


// Modal for Login
const viewLoginDialog = document.querySelector(".login-modal");
const viewLoginModal = document.querySelector(".login");

// Modal for Register
const viewRegisterDialog = document.querySelector(".register-modal");
const viewRegisterModal = document.querySelector(".register");
const closeProductDialog = document.querySelectorAll(".close");

//display Cart function
function displayCart() {
  viewCartDialog.style.display = "block";
  const cartModal = document.querySelector(".cart-modal-container");
  cartContainer.innerHTML = "";
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
  } else {
    cart.forEach((item) => {
      cartContainer.innerHTML += `
                    <div class="cart-product">
                        <div>
                            <img src="${item.thumbnail}"/>
                        </div>
                        <div class="right-cart">
                            <div class="center-left">
                                <h3>${item.name}</h3>
                                <div class="bottom-buttons">
                                    <p>In Stock</p>
                                    <div>
                                        <p class="quantity"> <button class="class">  - </button> <span class="quantity-span">${item.quantity}</span> <button class="plus"> + </button> </p>
                                    </div>
                                </div>
                            </div>
                            <div class="center-right">
                                <h3 class="item-price">R ${item.cartTotal}</h3>
                                <div class="bottom-buttons">
                                    <button class="delete-btn"><i class="bi bi-trash3"></i> Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
    });
  }


  const plusBtns = document.querySelectorAll('.plus');
  const minusBtns = document.querySelectorAll('.class');
  const quantitySpans = document.querySelectorAll('.quantity-span');
  const itemTotals = document.querySelectorAll('.item-price');
  const deleteBtn = document.querySelectorAll('.delete-btn');
  console.log(deleteBtn)

  deleteBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      deleteItemFromCart(index);
    })
  })

  plusBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {

      //increase the quantity of the item in the cart
      //increase the quantity in the cart array
      //increase the price in the totals
      cart[index].quantity++;
      cart[index].cartTotal = cart[index].price * cart[index].quantity;
      totals.cartTotal += cart[index].price;
      
      cartTotalElement.textContent = `R${totals.cartTotal}.00`;
      quantitySpans[index].textContent = ""+cart[index].quantity;
      itemTotals[index].textContent = `R${cart[index].cartTotal}.00`;

      localStorage.setItem('totals', JSON.stringify(totals));
      localStorage.setItem('cart', JSON.stringify(cart));

      updatePopCount(1, '+');
    });
  });

  minusBtns.forEach((btn, index) => {

    btn.addEventListener("click", () => {

      //decrease the quantity of the item in the cart
      //decrease the quantity in the cart array
      //decrease the price in the totals
      if (cart[index].quantity === 1) {
        console.log("remove the item from the cart");
        deleteItemFromCart(index)

      } else {
        cart[index].quantity--;
        cart[index].cartTotal = cart[index].price * cart[index].quantity;
        totals.cartTotal -= cart[index].price;
        
        cartTotalElement.textContent = `R${totals.cartTotal}.00`;
        quantitySpans[index].textContent = ""+cart[index].quantity;
        itemTotals[index].textContent = `R${cart[index].cartTotal}.00`;

        localStorage.setItem('totals', JSON.stringify(totals));
        localStorage.setItem('cart', JSON.stringify(cart));

        updatePopCount(1, '-');
      }
    });
  })

}

function displayWishlist(){
  viewWishlistDialog.style.display = 'block';
  const listModal = document.querySelector(".wishlist-modal-container");
  wishlistContainer.innerHTML = "";
  
  if (list.length === 0) {
    wishlistContainer.innerHTML = '<p class="empty-cart">Your wishlist is empty</p>';
  } else {
    list.forEach((item) => {
      wishlistContainer.innerHTML += `
                <div class="list-container">
                    <div>
                        <img src=${item.thumbnail} />
                    </div>
                    <div class="right-cart">
                        <div class="center-left">
                            <h2>${item.name}</h2>
                            <div class="bottom-buttons">
                                <h3 class="list-price">R ${item.price}</h3>
                            </div>
                        </div>
                        <div class="center-right">
                            <div class="bottom-buttons">
                                <button class="add-from-list"><i class="bi bi-bag-heart-fill"></i> Add To Bag</button>
                                <button class="delete-list"><i class="bi bi-trash3"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                </div>`;
    });
  }

  const addFromListBtns = document.querySelectorAll('.add-from-list');
  const deleteListBtns = document.querySelectorAll('.delete-list');

  deleteListBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      deleteItemFromWishlist(index);
    })
  })

  addFromListBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      addToBagFromWishlist(index);
    })
  })

}

function deleteItemFromCart(index) {
  totals.cartTotal -= cart[index].cartTotal;
  let itemCount = cart[index].quantity;
  updatePopCount(itemCount, '-');
  removeFromCart(index)
  cartTotalElement.textContent = `R${totals.cartTotal}.00`;
  
  localStorage.setItem('cart', JSON.stringify(cart))
  localStorage.setItem('totals', JSON.stringify(totals))
  
  displayCart();
}

function deleteItemFromWishlist(index) {
  totals.wishlistTotal -= list[index].price;
  updateWishCount(1, '-');
  removeFromWishlist(index)
  
  localStorage.setItem('wishlist', JSON.stringify(list))
  localStorage.setItem('totals', JSON.stringify(totals))
  
  displayWishlist();
}

function addToBagFromWishlist(index) {
  try{
    const product = list[index];
    const id = product.id;
    const name = product.name;
    const price = product.price;
    const thumbnail = product.thumbnail;

    addToCart(id, name, price, thumbnail);
    updatePopCount(1, '+');
    totals.cartTotal += price;
    cartTotalElement.textContent = `R${totals.cartTotal}.00`;
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totals', JSON.stringify(totals));
    window.setTimeout(alert(`${name} has been added to your cart`), 2000);
  } catch (error ){
    alert(error.message)
  }
  

  displayCart();
}

function updatePopCount(quant = 1, sign) {
  // const popCount = document.getElementById("pop-quantity");
  if(quant === 0){
    cartTotalItems = 0;
    renderItemCount()
    localStorage.setItem("totalItems", JSON.stringify(cartTotalItems));
    return;
  }
  if(sign === '+'){
    cartTotalItems += quant;
    localStorage.setItem("totalItems", JSON.stringify(cartTotalItems));
    renderItemCount();
  } else if(sign === '-'){
    cartTotalItems -= quant;
    localStorage.setItem("totalItems", JSON.stringify(cartTotalItems));
    renderItemCount();
  }

}

function updateWishCount(quant = 1, sign) {
  const wishCount = document.getElementById("wish-quantity");
  if(quant === 0){
    listTotalItems = 0;
    renderWishCount()
    localStorage.setItem("totalWishItems", JSON.stringify(listTotalItems));
    return;
  }
  if(sign === '+'){
    listTotalItems += quant;
    localStorage.setItem("totalWishItems", JSON.stringify(listTotalItems));
    renderWishCount();
  } else if(sign === '-'){
    listTotalItems -= quant;
    localStorage.setItem("totalWishItems", JSON.stringify(listTotalItems));
    renderWishCount();
  }

}

function renderItemCount() {
  const popCount = document.getElementById("pop-quantity");
  popCount.textContent = cartTotalItems;
}

function renderWishCount() {
  const wishCount = document.getElementById("wish-quantity");
  wishCount.textContent = listTotalItems;
}

viewCartModal.addEventListener("click", () => {
  displayCart();


  viewCartDialog.showModal();


  // viewCartDialog.showModal();
});



viewLoginModal.addEventListener("click", () => {
  viewLoginDialog.style.display = "block";
  viewLoginDialog.showModal();
});

viewRegisterModal.addEventListener("click", () => {
  viewRegisterDialog.style.display = "block";
  viewRegisterDialog.showModal();
});

viewWishlistModal.addEventListener("click", () => {
  displayWishlist();
  // viewWishlistDialog.style.display = "block";
  viewWishlistDialog.showModal();
});

closeProductDialog.forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    viewProductDialog.style.display = "none";
    viewProductDialog.close();
    viewCartDialog.style.display = "none";
    viewCartDialog.close();
    viewWishlistDialog.style.display = "none";
    viewWishlistDialog.close();
    viewRegisterDialog.style.display = "none";
    viewRegisterDialog.close();
    viewLoginDialog.style.display = "none";
    viewLoginDialog.close();
  });
});

// Nav bar onscroll
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("nav").style.backgroundColor = "#a30c4a";
  } else {
    document.getElementById("nav").style.backgroundColor = "#4b4a4a7a";
  }
}

// Image carsoul
let slideIndex = 1;
showSlides(slideIndex);
showSlidesAuto(0);

const previous = document.querySelector(".prev");
const next = document.querySelector(".next");

previous.addEventListener("click", () => {
  plusSlides(-1);
});

next.addEventListener("click", () => {
  plusSlides(1);
});

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slides");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    dots[i].classList.remove("active");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].classList.add("active");
}

function showSlidesAuto() {
  let i;
  let slides = document.getElementsByClassName("slides");
  let dots = document.getElementsByClassName("dot");

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    dots[i].classList.remove("active");
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].classList.add("active");
  setTimeout(showSlidesAuto, 5000);

}

const signUpBtn = document.getElementById("sign-up-btn");
const name = document.getElementById("name");
const surName = document.getElementById("surname");
const signUpEmail = document.getElementById("sign-up-email");
const signUpPassword = document.getElementById("sign-up-password");
const signRePassword = document.getElementById("sign-up-re-password");

signUpBtn.addEventListener("click", () => {
  registerUser(
    name.value,
    surName.value,
    signUpEmail.value,
    signUpPassword.value
  );
  console.log(users);
  localStorage.setItem("users", JSON.stringify(users));
  name.value = "";
  surName.value = "";
  (signUpEmail.value = ""), (signUpPassword.value = "");
  signRePassword.value = "";
  alert("Signed up successfully! You can now login")
});