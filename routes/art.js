const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const arts=require('../controllers/arts');
const Art = require('../models/art');
const multer  = require('multer')

const {storage}=require('../cloudinary');
const upload = multer({storage})
const{validateArt,isAuthor,isLoggedIn}=require('../middleware');
router.route('/')
       .get(catchAsync(arts.index))
       .post(isLoggedIn,upload.array('image'), validateArt, catchAsync(arts.createArt))
     


router.get('/new',isLoggedIn,arts.renderNewForm)

router.route('/:id')
           .get(catchAsync(arts.showArt))
           .put(isLoggedIn,isAuthor,upload.array('image'),validateArt, catchAsync(arts.updateArt))
           .delete(isLoggedIn,isAuthor, catchAsync(arts.deleteArt))


router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(arts.renderEditForm));


module.exports=router;