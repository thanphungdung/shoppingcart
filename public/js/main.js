let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

cartIcon.onclick = () =>{
    cart.classList.add('active');
}

closeCart.onclick = () =>{
    cart.classList.remove('active');
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}




function ready() {
    var removeCartButtons = document.getElementsByClassName('cart-remove')
    console.log(removeCartButtons);
    for(var i = 0; i < removeCartButtons.length; i++){
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem)
    }
    //Quantity change
    var quantityInputs = document.getElementsByClassName('cart-quantity')
    for(var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged)
    }
    var addCart = document.getElementsByClassName('add-cart')
    for(var i = 0; i < addCart.length; i++){
        var button = addCart[i];
        button.addEventListener('click', addCartClicked)
    }
    document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked)
}   
// BUYYYYYY
function buyButtonClicked() {
    var cartItemsElement = document.getElementsByClassName('cart-content')[0];
    var cartItems = []; // You will populate this with the cart data.
    
    // Loop through cart items and extract relevant data, then push to cartItems array.
    // Note: You'll need to modify this depending on the exact structure of your cart items.
    var cartBoxes = cartItemsElement.getElementsByClassName('cart-box');
    for (var i = 0; i < cartBoxes.length; i++) {
        var item = {
            title: cartBoxes[i].querySelector('.cart-product-title').innerText,
            price: parseFloat(cartBoxes[i].querySelector('.cart-price').innerText.replace('$', '')),
            quantity: parseInt(cartBoxes[i].querySelector('.cart-quantity').value)
        };
        cartItems.push(item);
    }

    const total = parseFloat(document.querySelector('.total-price').innerText.replace('$', ''));

    fetch('/api/place-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cartItems: cartItems,
            total: total
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        // Clear cart items from the UI
        while (cartItemsElement.hasChildNodes()) {
            cartItemsElement.removeChild(cartItemsElement.firstChild);
        }
        updatetotal();
    })
    .catch(error => {
        console.error("Error saving order:", error);
        alert('Failed to place order. Please try again.');
    });
}



function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
}


function quantityChanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updatetotal();
}

//ADdo to cart
function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    
    addProductToCart(title, price, productImg);
    updatetotal();
}  

function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert('This item is already added to the cart');
            return;
        }
    }
    
    var cartBoxContents = `
                            <img src="${productImg}" alt="" class="cart-img">
                            <div class="detail-box">
                                <div class="cart-product-title">${title}</div>
                                <div class="cart-price">${price}</div>
                                <input type="number" value="1" class="cart-quantity">
                            </div>

                            <i class="bx bxs-trash-alt cart-remove"></i>
                        `;
    cartShopBox.innerHTML = cartBoxContents;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);
}




function updatetotal(){
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for(var i = 0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i]
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('$',''));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
        total = Math.round(total * 100) / 100;
    
    document.getElementsByClassName('total-price')[0].innerText = '$' + total;
      
}