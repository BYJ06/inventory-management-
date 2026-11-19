const express = require("express");
const router = express.Router();
const validateProduct = require("../middleware/productmiddleware");
const {authenticateToken,authorizeRole} = require("../middleware/authmiddleware");

const {
    getProducts,addProduct,updateProduct,
    deleteProduct
} = require("../controllers/productController");
router.use(authenticateToken);

router.get("/", getProducts);

router.post("/", authorizeRole("admin"), validateProduct, addProduct);

router.put("/:id", authorizeRole("admin"), validateProduct, updateProduct);

router.delete("/:id", authorizeRole("admin"), deleteProduct);

module.exports = router;