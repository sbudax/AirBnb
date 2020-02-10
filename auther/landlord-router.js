const router = require('express').Router();
const mongoose = require('mongoose');
const user = require('../models/users-model')
const Rooms = require('../models/landlord-model');

// const Rooms =  mongoose.model('house');


router.get('/', (req, res)=>{
    Rooms.find({status: 'public'})
    .populate('user') 
    .then(newroom =>{
        res.render('landlord', {
            data: newroom
        });
        
    });
});

//show page 

router.get('/show/:id', (req, res ) =>{
    Rooms.findOne({
        _id: req.params.id
    })
    .populate('user')
    .then(show =>{
        res.render('show', {
            show: show
        });
    });
});

router.get('/add', (req, res)=>{
    res.render('add');
});

router.post('/', (req, res)=>{
    const newRoom = {
        location: req.body.location,
        price: req.body.price,
        body: req.body.body,
        status: req.body.status,
        image: req.body.image,
        user: req.user.id
    }

    new Rooms(newRoom)
    .save()
    .then(house =>{
        res.redirect(`/landlord/show/${house.id}`);
    });
});

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
    CheckFileType(file, cb);
  } 
}).single('myImage');

function CheckFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else{
    cb('Error: Not a valid image file');
  }
};

router.post('/show/:id', (req, res) => {
    upload(req, res, (err) =>{
      if(err){
        res.render('landlord/add', {
          msg: err
        });
      } else{
        if(req.file == undefined){
          res.render('landlord/add', {
            msg: 'Error: No file selected!'
          });
        } else{
            res.render('landord/show', {
            msg: 'file uploaded',
            file: `uploads/${req.file.filename}` 
            });
        }
      }
    });
  });

module.exports = router;