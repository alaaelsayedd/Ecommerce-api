const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel'); // Assuming your Cart model is located in models/cart.model
const Product = require('../models/productModel'); // Assuming you have a Product model or service to get product details

// Get cart data (this will return the first cart in the database)
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne(); // Fetch the first available cart
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

// Add product to cart using product ID
router.post("/:productId", async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findOne({ id: +req.params.productId });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the cart (assuming there's a single cart for now)
    let cart = await Cart.findOne();
    
    if (!cart) {
      // If no cart exists, create a new one
      cart = new Cart({
        items: [],
        totalPrice: 0,
      });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.items.findIndex(item => item.productId === product.id);
    
    if (existingProductIndex >= 0) {
      // If product is already in the cart, update the quantity
      cart.items[existingProductIndex].quantity += 1;
    } else {
      // Add the new product to the cart
      cart.items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,  // default to 1 quantity
        image: product.images[0],  // assuming `images` is an array
      });
    }

    // Update the total price of the cart
    cart.totalPrice += product.price;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding product to cart", error });
  }
});

// Update the quantity of a product in the cart
router.put("/:productId", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId == req.params.productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
});

// Remove a product from the cart
router.delete("/:productId", async (req, res) => {
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId == req.params.productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from the cart
    const removedItem = cart.items.splice(itemIndex, 1)[0];

    // Update the total price
    cart.totalPrice -= removedItem.price * removedItem.quantity;

    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing product from cart", error });
  }
});

module.exports = router;
