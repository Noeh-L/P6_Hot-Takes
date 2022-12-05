const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const originalName = file.originalname.split(' ').join('_');
    const name = originalName.split(path.extname(originalName))[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({

    storage: storage,
    fileFilter: function(req, file, callback) {
      let ext = path.extname(file.originalname);
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        console.log(`${ext} file are not allowed !`);
        return callback(new Error('Only images are allowed'))
      }
      callback(null, true)
    }

  }).single('image');