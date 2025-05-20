

import { registerUser, loginUser, users, cart, list, addToCart, clearCart, wishList, removeFromCart } from "../js";

describe('[users]', () => {
  test('should be defined and should be an array', () => {
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
  })
})

describe("[registerUser]", () => {
  test("should be defined and should be a function", () => {
    expect(registerUser).toBeDefined();
    expect(typeof registerUser).toBe("function");
  });

  test("should have 4 valid parameters", () => {
    let name = null;
    let surname = null;
    let email = null;
    let password = null;
    expect(() => registerUser(name, surname, email, password)).toThrow();
  });

  test("should have name and surname parameters as strings of at least 2 characters", () => {
    // let name = "alicia";
    // let surname = "tau";
    // let email = "ogonatau@gmail.com";
    // let password = "Alicia@123";
    let name = null;
    let surname = null;
    let email = null;
    let password = null;
    expect(() => registerUser(name, surname, email, password)).toThrow();
  });

  test("should have valid password", () => {
    let name = null;
    let surname = null;
    let email = null;
    let password = null;
    expect(() => registerUser(name, surname, email, password)).toThrow();
  });

  test("should be able to push user data into an array", () => {
    let name = "alicia";
    let surname = "tau";
    let email = "alicia@gmail.com";
    let password = "Alicia@123";
    registerUser(name, surname, email, password);
    expect(users.length).toBeGreaterThan(0);
  });
});

describe("[clearCart]", () => {
  beforeEach(() => {
    cart.push({ id: 1, productname: "product1", quantity: 2 });
  });

  afterEach(() => {
    cart.length = 0;
  });

  test("should be defined and should be a function", () => {
    expect(clearCart).toBeDefined();
    expect(typeof clearCart).toBe("function");
  });

  test("should clear when something is in cart", () => {
    clearCart();
    expect(cart.length).toBeLessThan(1);

    // expect(cartItems.length).toBe(0);
  });
});

describe('[loginUser]', () => {
  test("should be defined and should be a function", () => {
    expect(loginUser).toBeDefined();
    expect(typeof loginUser).toBe("function");
  });

  test("should have 2 valid parameters", () => {
    let email = null;
    let password = null;
    expect(() => loginUser(email, password)).toThrow();
  });

  test("should have an email existing in the array", () => {
    let email = "ogonatau@gmail.com";
    let password = "Alicia@123";
    expect(() => loginUser(email, password)).toThrow();
  });
})

/****** --Add to cart tests-- ********************************/
describe("[addToCart]", () => {
  test("[addToCart] cart should be defined and should be an array", () => {
    expect(Array.isArray(cart)).toBe(true);
  });

  test("[addToCart] function should be defined and should be a function", () => {
    expect(addToCart).toBeDefined();
    expect(typeof addToCart).toBe("function");
  });

  test("[addToCart] should accept id, name and price as parameters", () => {
    let id = null;
    let name = null;
    let price = null;
    expect(() => addToCart(id, name, price)).toThrow();
  });

  test("[addToCart] should add to cart if all parameters are valid", () => {
    let id = 1;
    let name = "apple";
    let price = 2.5;
    let thumbnail = "https://example.com/apple.jpg";
    let quantity = 1;
    addToCart(id, name, price, thumbnail, quantity);
    expect(cart.length).toBeGreaterThan(0);
    expect(cart[0].id).toBe(id);
    expect(cart[0].name).toBe(name);
    expect(cart[0].price).toBe(price);
    expect(cart[0]).toEqual({
      id: id,
      name: name,
      price: price,
      cartTotal: price,
      thumbnail: thumbnail,
      quantity: quantity
    });

  });

});
describe('[wishList]', () => {
  test('should should be defined and should be an array', () => {
    expect(Array.isArray(list)).toBe(true);

  })
  test('should be defined and should be a function', () => {
    expect(wishList).toBeDefined();
    expect(typeof wishList).toBe("function");
  })
  test("[wishList] should accept id, name and price as parameters", () => {
    let id = null;
    let name = null;
    let price = null;
    expect(() => addToCart(id, name, price)).toThrow();
  });

  test("[wishList] should add to wish if all parameters are valid", () => {
    let id = 1;
    let name = "apple";
    let price = 2.5;
    wishList(id, name, price);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].id).toBe(id);
    expect(list[0].name).toBe(name);
    expect(list[0].price).toBe(price);
    expect(list[0]).toEqual({
      id: id,
      name: name,
      price: price
    });

  });


})

//testing function to remove products from the cart
describe('[removeFromCart]', () => {
  beforeAll(() => {
    
  })
  test('should be defined and a function ', () => {
    expect(removeFromCart).toBeDefined();
    expect(typeof removeFromCart).toBe("function");
  });

  test('should accept id as a parameter and check if product exists', () => {
    let val = " string ";
    expect(() => removeFromCart(val)).toThrow();
    expect(() => removeFromCart(val)).toThrow();
  });

  test('should remove product from cart', () => {
    cart.push({ 
      id: 0,
      name: "mascara",
      price: 68.21});

      cart.push({
      id: 1,
      name: "mascara",
      price: 68.21});
      
      removeFromCart(0)
      expect(cart.length).toBeLessThan(3); //3 items exist
  });

 });
