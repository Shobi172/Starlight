const verifyUser = (req,res,next)=>{

   

        if (req.session.user_id) {

        
            
            next();
        }
         else {
            // console.log("section")
            // res.send("section failed")
            res.redirect('/login');
            
        }
    }
        
 



module.exports = {
    verifyUser
    
}