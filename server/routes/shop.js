// routes/cart.js
const express = require('express');
const router = express.Router();
const Product = require('../../models/product');

let listCards = []

router.get('/shop', async (req, res) => {
  
   
     try {
       const products = await Product.find()
   
       res.render('shop', {products, listCards, currentRoute: '/shop'})
        
       } catch (err) {
       res.status(400).send({ error: err})
   }
   })



// Add to cart
router.post('/add/:productId', (req, res) => {
    const productId = req.body.productId;

    // Fetch product details from the database
    Product.findById(productId, (err, product) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Add product to the cart
        addToCard(product);
        // res.json({ success: true, message: 'Product added to the cart successfully' });
    });
});



// Utility function to add a product to the cart
function addToCard(product) {
    const key = product.id.toString();

    if (listCards[key] == null) {
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(product));
        listCards[key].quantity = 1;
    }
}

module.exports = router;
