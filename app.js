const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Product = require("./schema")
const streamifier = require('streamifier');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { v2: cloudinary } = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  Product.find()
    .then((products) => {

      res.render("index", { products });
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/user/add.ejs', (req, res) => {
  res.render('user/add')
})

app.post('/user/add.ejs', upload.single('image'), (req, res) => {
  const stream = cloudinary.uploader.upload_stream({ folder: 'juicy' }, (error, result) => {
    if (error) {
      console.error(error);
      return res.send('Error uploading image');
    }
    
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: result.secure_url
    })
    newProduct.save()
      .then(() => {
        res.redirect('/')

      })
      .catch((err) => {
        console.log(err)
      })
  })
  streamifier.createReadStream(req.file.buffer)
      .pipe(stream);
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  })
  .catch((err) => {
    console.log(err)
  })
