const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

if (process.env.CLOUDINARY_URL) {
  // auto-configured from CLOUDINARY_URL
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

console.log('Cloudinary cloud_name:', process.env.CLOUDINARY_CLOUD_NAME || '(from URL)');

const memUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `obelix-menu/${folder}` },
      (error, result) => (error ? reject(error) : resolve(result.secure_url))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

module.exports = { memUpload, uploadToCloudinary };
