// config/upload.js
const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename:    (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)), // 1697656234.jpg
});

module.exports = multer({ storage });
