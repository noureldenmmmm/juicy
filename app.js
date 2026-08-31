const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Product = require("./schema")
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
  Product.find()
    .then((products) => {
      
      res.render("index", { products });
    })
    .catch((err) => {
      console.log(err)
    })
})

app.get('/user/add.ejs',(req,res) => {
  res.render('user/add')
})

app.post('/user/add.ejs',(req,res) => {
  const newProduct = new Product(req.body)
  
  newProduct.save()
  .then(() => {
    res.redirect('/')
    
  })
  .catch((err) => {
    console.log(err)
  })
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
