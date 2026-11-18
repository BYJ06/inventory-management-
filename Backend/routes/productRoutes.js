const express = require("express");
const router = express.Router();
const validateProduct = require("../middleware/productmiddleware");

const {
    getProducts,addProduct,updateProduct,
    deleteProduct
} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/",validateProduct, addProduct);
router.put("/:id", validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;