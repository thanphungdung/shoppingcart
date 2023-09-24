const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://dungthanphung:tpd170304@cluster0.61qvj3k.mongodb.net/shoppingcart?retryWrites=true&w=majority')
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.log(error.message));
app.use(bodyParser.json()); // for parsing application/json

// Your MongoDB model for the cart orders.
const Order = mongoose.model('Order', {
    items: Array,
    total: Number
});

app.post('/api/place-order', async (req, res) => {
    try {
        const order = new Order({
            items: req.body.cartItems,
            total: req.body.total
        });
        await order.save();
        res.status(200).send({ message: 'Order saved successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error saving order.' });
    }
});


app.listen(3001, () => console.log('Server Started'));