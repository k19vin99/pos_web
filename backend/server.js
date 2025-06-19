require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const authRoutes   = require('./routes/auth');
const productosRoutes = require('./routes/products');
const app = express();

app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productosRoutes);
app.get('/', (_, res) => res.send('API levantada 🚀'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend en http://localhost:${PORT}`));
