const adminAuth = (req,res,next) =>{
    let token = "xyz";
    let isAdminAuthorized = token === "xyz22332";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Request");
    }
    else {
        next();
    }
}

const userAuth = (req,res,next) =>{
    let token = "xyz";
    let isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Request");
    }
    else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}