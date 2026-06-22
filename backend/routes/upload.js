const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../middleware/cloudinary');
const authMiddleware = require('../middleware/auth');

// Use memory storage — no disk needed (Vercel serverless safe)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  },
});

// POST /api/upload — Admin only: upload image to Cloudinary
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Stream buffer directly to Cloudinary
    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'riyas-family-dining/menu',
            transformation: [
              { width: 800, height: 600, crop: 'fill', gravity: 'center' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

    const result = await uploadFromBuffer();

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

// DELETE /api/upload/:publicId — Admin only: delete image from Cloudinary
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: 'publicId required' });

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted from Cloudinary' });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    res.status(500).json({ message: 'Image delete failed' });
  }
});

module.exports = router;
