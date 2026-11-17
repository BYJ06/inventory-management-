function Validateproduct(req, res, next) {
  const { name, price, quantity } = req.body;

  if (!name || price<0 || quantity<0) {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Invalid price' });
  }

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  next();
}
module.exports = Validateproduct;