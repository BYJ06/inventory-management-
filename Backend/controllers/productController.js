const connection = require("../config/database");

const getProducts = (req, res, next) => {
    const sql = "SELECT * FROM products";

    connection.query(sql, (error, results) => {
        if (error) {
            return next(error);
        }

        res.status(200).json(results);
    });
};
const addProduct = (req, res, next) => {
    const { name, price, quantity } = req.body;

    const sql = "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)";

    connection.query(sql, [name, price, quantity], (error, results) => {
        if (error) {
            return next(error);
        }

        res.status(201).json({
            message: "Product added successfully"
        });
    });
};
const updateProduct = (req, res, next) => {
    const productId = Number(req.params.id);
    const { name, price, quantity } = req.body;

    const sql = `
        UPDATE products
        SET name = ?, price = ?, quantity = ?
        WHERE id = ?
    `;

    connection.query(
        sql,
        [name, price, quantity, productId],
        (error, results) => {
            if (error) {
                return next(error);
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.status(200).json({
                message: "Product updated successfully"
            });
        }
    );
};
const deleteProduct = (req, res, next) => {
    const productId = Number(req.params.id);

    const sql = "DELETE FROM products WHERE id = ?";

    connection.query(sql, [productId], (error, results) => {
        if (error) {
            return next(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    });
};
module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
};