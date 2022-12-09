const verifyAdmin = async(req,res,next)=>{

    if (req.session.admin_id) {

         next();
    }
     else {
        res.redirect('/admin')
        
    }
}


module.exports = {
    verifyAdmin
    
}