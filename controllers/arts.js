const Art=require('../models/art');
const {cloudinary}=require('../cloudinary');
module.exports.index=async (req, res) => {
    const arts = await Art.find({});
    res.render('arts/index', { arts });
}
module.exports.renderNewForm=(req, res) => {
    res.render('arts/new');
}
module.exports.createArt=async (req, res, next) => {
    // if (!req.body.art) throw new ExpressError('Invalid art data', 400)
     
     const art = new Art(req.body.art);
     art.images=req.files.map(f=>({url:f.path,filename:f.filename}))
      art.author=req.user._id;
     await art.save();
     req.flash('success','successfully made a new art');
     res.redirect(`/arts/${art._id}`);
 }

 module.exports.showArt=async (req, res) => {
    const art = await Art.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author',
        }
    }).populate('author');
   
    if(!art){
        req.flash('error','Cannot find that art');
        return res.redirect('/arts');
    }
    res.render('arts/show', {art})
}

module.exports.renderEditForm=async (req, res) => {
    const {id}=req.params;
    const art = await Art.findById(id);
  if(!art){
        req.flash('error','Cannot find that art');
        return res.redirect('/arts');
    }
   res.render('arts/edit', { art });

}

module.exports.updateArt=async (req, res) => {
    const { id } = req.params;
    
    const art = await Art.findByIdAndUpdate(id, { ...req.body.art });
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    art.images.push(...imgs);
    await art.save();
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename);
        }
        await art.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});

    }
    req.flash('success','successfully updated art')
    res.redirect(`/arts/${art._id}`);

}

module.exports.deleteArt=async (req, res) => {
    const { id } = req.params;
    await Art.findByIdAndDelete(id);
    req.flash('success','Successfully deleted art!!');
    res.redirect('/arts');
}