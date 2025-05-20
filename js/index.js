let users = [];
let cart = [];
let list = [];

const totals = {
    cartTotal: 0.00,
    wishlistTotal: 0.00
}

function addToCart(id, name, price, thumbnail, quantity = 1) {
    if(!id || !name || !price){
        throw new Error("All fields are required");
    }

    if ((typeof id != "number" && id < 0)) {
        throw new Error("ID should be a positive number");
    }

    if ((typeof name != "string" && name.length < 2)) {
        throw new Error("Name should be string and should contain at least 2 characters");
    }

    if ((typeof price != "number" && price < 0)) {
        throw new Error("Price should be a positive number");
    }

    if ( cart.some(item => item.id === id)) {
        throw new Error("ERROR: Item already in cart, please increase quantity");
    } 

    cart.push({
        id: id,
        name: name,
        price: price,
        cartTotal: price * quantity,
        thumbnail: thumbnail,
        quantity: quantity
    }) 
}

function registerUser(name, surname, email, password) {
    if (!name || !surname || !email || !password) {
        throw new Error("All fields are required");
    }

    if (typeof name !== "string" || name.length < 2) {
        throw new Error("Name should be a string and contain at least 2 characters");
    }

    if (typeof surname !== "string" || surname.length < 2) {
        throw new Error("Surname should be a string and contain at least 2 characters");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
    }

    if (typeof password !== "string" || password.length < 8) {
        throw new Error("Password should be a string and contain at least 8 characters");
    }

    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        throw new Error("User email already registered");
    }

    const user = {
        id: Date.now(),
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim().toLowerCase(),
        password: password
    };

    users.push(user);
    return user;
}

function clearCart() {
    cart = []

}

function loginUser(email, password) {
    if (!email || !password) {
        throw new Error("All fields are required");
    }

    const user = users.find(u => u.email === email.trim().toLowerCase());

    if (!user) {
        throw new Error("User with this email does not exist");
    }

    if (user.password !== password) {
        throw new Error("Incorrect password");
    }

    return user;
}
// console.log(users);


function wishList(id, name, price, thumbnail){

    if(!id || !name || !price){
        throw new Error("All fields are required");    
    }

    if((typeof id != "number" && id < 0)){
        throw new Error("ID should be a positive number");
    }

    
    if((typeof name != "string" && name.length < 2)){
        throw new Error("Name should be string and should contain at least 2 characters");
    }

    if((typeof price != "number" && price < 0)){
        throw new Error("Price should be a positive number");
    }
    
    if ( list.some(item => item.id === id)) {
        throw new Error("ERROR: Item already added to wishList");
    } 

    list.push({
        id: id,
        name: name,
        price: price,
        thumbnail: thumbnail
    })

    

}

function removeFromCart(id) {
    if (typeof id !== "number") {
        throw new Error("Oops! Something went wrong.");
        
    }

    if (!cart[id]) {
        throw new Error("Item not found");
        
    }


    cart.splice(id, 1)
}

function removeFromWishlist(id) {
    if (typeof id !== "number") {
        throw new Error("Oops! Something went wrong.");
        
    }

    if (!list[id]) {
        throw new Error("Item not found");
        
    }


    list.splice(id, 1)
}

export {registerUser, loginUser, users, cart, list, addToCart, clearCart, wishList, totals, removeFromCart, removeFromWishlist}

