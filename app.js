const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Product = require("./schema")
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}));
//Auto setup
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
app.use(connectLivereload());
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});




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
  .connect("mongodb+srv://nnourelden_db_user:YRds5GOmkYQ4OkO5@cluster0.ipewqxy.mongodb.net/data?appName=Cluster0")
  .then(() => {
    app.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  })
  .catch((err) => {
    console.log(err)
  })
