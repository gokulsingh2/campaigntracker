// Loader
window.addEventListener("load", () => {
    document.getElementById("loader").style.display = "none";
});

// Register
function register(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = {name,email,password};
    localStorage.setItem(email, JSON.stringify(user));

    alert("Registered!");
    window.location.href="index.html";
}

// Login
function login(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = JSON.parse(localStorage.getItem(email));

    if(user && user.password === password){
        localStorage.setItem("loggedInUser", email);
        window.location.href="dashboard.html";
    } else {
        alert("Invalid Login");
    }
}

// Logout
function logout(){
    localStorage.removeItem("loggedInUser");
    window.location.href="index.html";
}

// Add to Cart
function addToCart(item, price){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({item, price});
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
}

// Cart Display
if(document.getElementById("cartList")){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(i => {
        document.getElementById("cartList").innerHTML += `<li class="list-group-item">${i.item} - ₹${i.price}</li>`;
        total += i.price;
    });

    document.getElementById("total").innerText = "Total: ₹" + total;
}

// Place Order
function placeOrder(){
    alert("Order Placed Successfully!");
    localStorage.removeItem("cart");
    window.location.href="dashboard.html";
}