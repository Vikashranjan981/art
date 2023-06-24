const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review');
const User=require('./user');
// https://res.cloudinary.com/dmzeypto1/image/upload/w_300/v1686913452/Review-Art/qsrx4v1hvdeb4vi6w4fr.png

const ImageSchema=new Schema({
    url:String,
    filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
});
const ArtSchema=new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    description:String,
    
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

});

ArtSchema.post('findOneAndDelete',async function(doc){
if(doc){
    await Review.deleteMany({
        _id:{
            $in:doc.reviews
        }
    })
}
})

module.exports=mongoose.model('Art',ArtSchema);
