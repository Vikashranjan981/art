const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
}

module.exports.register=async(req,res,next)=>{
    try{
    const{email,username,password}=req.body;
    const user=new User({email,username});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,err=>{
         if(err) return next(err);
         req.flash('success','Welcome to ReviewArt Community');
    res.redirect('/arts');
    })
    }catch(e){
       req.flash('error',e.message);
       res.redirect('/register');
    }
    
}

module.exports.renderLogIn=(req,res)=>{
    res.render('users/login');
  }

  module.exports.login=async(req,res)=>{
    req.flash('success','welcome back');
    const redirectUrl = res.locals.returnTo || '/arts';
    res.redirect(redirectUrl);
    }
      module.exports.logout=async (req,res,next)=>{
    req.logout()
    req.flash('success','Goodbye! See you soon again')
    res.redirect('/arts')
}
   
