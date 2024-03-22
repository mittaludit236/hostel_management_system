const passport=require("passport");
const session=require("express-session");
function requireAuthenticate(req,res,next){
    if(req.session && req.session.userId)
    next();
    else
    res.redirect("/signin_student");
  }
  function requireAuthenticate1(req,res,next){
    if(req.session && req.session.userId)
    next();
    else
    res.redirect("/signin_admin");
  }
  //get requests for our routes
  const ExtractJwt=require("passport-jwt").ExtractJwt;
  const JwtStrategy=require("passport-jwt").Strategy;
  let opts={};
  opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey=process.env.SECRET_JWT;
  passport.use( new JwtStrategy(opts,function(jwt_payload,done){
      User.findOne({_id: jwt_payload.identifier},function(err,user){
          if(err)
          done(err,false);
          if(user)
          done(null,true);
          else
          done(null,false);
      });
  }));
module.exports={requireAuthenticate,requireAuthenticate1};