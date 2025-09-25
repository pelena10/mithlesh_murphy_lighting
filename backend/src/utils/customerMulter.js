const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for customer documents
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/customer_documents/';
    
    // Create subfolder based on document type
    if (file.fieldname.startsWith('shop_image')) {
      folder += 'shop_images/';
    } else if (file.fieldname.startsWith('image_security_cheque')) {
      folder += 'security_cheques/';
    } else if (file.fieldname === 'gst_certificate_image') {
      folder += 'gst_certificates/';
    }
    
    // Ensure the folder exists
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const customerId = req.params.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Generate filename: customerId_timestamp_fieldname.ext
    const filename = `${customerId}_${timestamp}_${file.fieldname}${ext}`;
    cb(null, filename);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid = allowedTypes.test(ext);
  
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG and PDF files are allowed!'), false);
  }
};

// Multer instance with limits
const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10 MB limit
    files: 9 // Maximum 9 files at once
  },
  fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 9 files.' });
    }
  }
  next(err);
};

module.exports = { upload, handleMulterError };