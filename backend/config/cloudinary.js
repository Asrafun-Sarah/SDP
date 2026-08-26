// Sets up Cloudinary using the credentials from .env.
// Cloudinary is a free file-hosting service — we use it instead of saving
// files to the server's disk, because most free hosting platforms wipe
// local files whenever the app restarts or redeploys.

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Uploads a file buffer (from multer) to Cloudinary and returns its URL.
// We use "raw" resource type so it accepts any file type (PDF, zip, pptx),
// not just images.
function uploadBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'raw' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

module.exports = { cloudinary, uploadBuffer };
