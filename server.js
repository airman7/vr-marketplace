var loadJsonFile = require('load-json-file');
var bodyParser = require('body-parser');
var express = require('express');
var fileUpload = require('express-fileupload');

const app = express();

var suppliers = loadJsonFile.sync('resources/supplier.json');

const fs = require("fs");

// default options
app.use(fileUpload());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3001, () => {
  console.log('Starting server');
});

//supplier and its product info
app.get('/supplier/:id/products', function (req, res) {
  var supp = suppliers;
  var supplierData;
  supp.data.forEach(supplier => {
    if(supplier.id == req.params.id) {
      supplierData =  supplier;
    }
  });
  res.send(supplierData);
});

//all products
app.get('/products', function (req, res) {
  var supp = suppliers;
  var products = [];
  supp.data.forEach(supplier => {
    supplier.products.forEach(product => {
      product.supplierName = supplier.name;
      product.supplierId = supplier.id;
      products.push(product);
    });
  });
  res.send(products);
});

//products of a category
app.get('/products/:category', function (req, res) {
  var supp = suppliers;
  var products = [];
  supp.data.forEach(supplier => {
    supplier.products.forEach(product => {
      if(product.category == req.params.category){
        product.supplierName = supplier.name;
        product.supplierId = supplier.id;
        products.push(product);
      }
    });
  });
  res.send(products);
});

//all categories
app.get('/categories', function (req, res) {
  var supp = suppliers;
  res.send(supp.categories);
});

//upload product 3d model or image by supplier
//<input name="file" type="file" />
app.post('/upload', function (req, res) {
  let sampleFile;
  let uploadPath;
  sampleFile = req.files.file;
  uploadPath = __dirname + '/resources/images/' + sampleFile.name;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('File uploaded to ' + uploadPath);
  });
  
});

app.get('/',function(req,res) {
    fs.readFile(__dirname + '/resources/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
  // res.sendFile(path.join(__dirname+'/index.html'));
});