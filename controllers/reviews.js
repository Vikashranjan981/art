const Art = require('../models/art')
const Review = require('../models/review');
module.exports.createReview=async (req, res) => {

    const art = await Art.findById(req.params.id);
    const review =  Review(req.body.review);
    review.author=req.user._id;
    art.reviews.push(review);
    await review.save();
    await art.save();
    req.flash('success','created new review!');
    res.redirect(`/arts/${art._id}`);
}

module.exports.deleteReview=async(req,res)=>{
    const {id,reviewId}=req.params;
     await Art.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash('success','Successfully deleted review!!');
     res.redirect(`/arts/${id}`);
 }