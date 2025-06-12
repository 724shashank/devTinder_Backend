const adminAuth = (req, res,next) => {
  const token ="xyz";
  const checkFunction = token==="xyz"
  if(!checkFunction){
    res.status(401).send("The Authurization failed");
  
  } 
  else{
      next();
  }
  
}

const userAuth = (req, res,next) => {
  const token ="xzyz";
  const checkFunction = token==="xzyz"
  if(!checkFunction){
    res.status(401).send("The User Authurization failed");
  
  } 
  else{
      next();
  }
  
}

module.exports ={
    adminAuth,userAuth
}