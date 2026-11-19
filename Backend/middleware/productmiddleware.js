function Validateproduct(req, res, next) {
  const { name, price, quantity } = req.body;
if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
        error: "Product name is required"
    });
}

 if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    return res.status(400).json({
        error: "Price must be a valid number greater than zero"
    });
}

if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 0
) {
    return res.status(400).json({
        error: "Quantity must be a non-negative integer"
    });
}
  next();
}
module.exports = Validateproduct;