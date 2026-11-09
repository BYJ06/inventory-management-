const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Add a product
app.post('/products', (req, res) => {
  const { name, price, quantity } = req.body;

  db.query(
    'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)',
    [name, price, quantity],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, name, price, quantity });
    }
  );
});

// Update a product
app.put('/products/:id', (req, res) => {
  const { name, price, quantity } = req.body;

  db.query(
    'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
    [name, price, quantity, req.params.id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: Number(req.params.id), name, price, quantity });
    }
  );
});

// Delete a product
app.delete('/products/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});