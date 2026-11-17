const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);

// Get all products
// This route is now handled by the productRoutes

// Add a product.

// Update a product
// Delete a product
app.use((err,req,res,next)=>
{
  console.error(err.stack)
  res.status(500).json({
    message:"Internalserver error"
  })
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});