const jwt = require('jsonwebtoken');
const {findUserByUserInfo} = require('../controllers/user-controller');
const JWT_SECRET_KEY = 'askjbfkjshklfjshadfkljasdkjbfkasjdhfkja'


//true just redirect to login for no token, invalid token, invalid token or user not found
const FRIENDLY_AUTHORIZE = false;


exports.generateJWT = (payload)=> {
    return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: '1d'});
}

exports.authenticateJWT = (req, res,next) => {
    let token = req.query.access_token || req.cookies['access_token'];
    //ADD code to also check the req.headers.authorization for the token
    if(req.headers?.authorization?.startsWith('Bearer ')){
        token = req.headers.authorization.split(  ' ')[1]
    }

    if(!token){
        // avoid ugly error - let later middleware redirect nicely instead
        if(FRIENDLY_AUTHORIZE) return next()

        //show ugly error
        const err = new Error('No token provided');
        err.status = 401; //indicates no token
        return next(err); //show ugly error
    }else{
        jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
            if(err){
                if(FRIENDLY_AUTHORIZE) return next()
                err.status = 403; //indicated invalid /malformed token
                return next(err); //show ugly error
            }
            // get the user in the db from the payload (should be userInfo object)
            const user = findUserByUserInfo(payload);
            if(!user){
                if(FRIENDLY_AUTHORIZE) return next()
                const err = new Error('No user found');
                err.status = 404; //indicates not found
                return next(err); //show ugly error
            }
            //Avoided all pitfalls so we good - store user and jwt in request for later middleware
            req.user = user;
            req.jwt = token;
            next();
            console.log('User'.user)
        })
    }
}


exports.authorizeUser = (req, res, next) => {
    req.currentScope = req.path.replace(/^\/+|\/+$/g, '');

    //No user - goto login page
    if(!req.user) res.redirect('/secure/login');

    //Admin can go and do anything, clients and employees can only go to their defaultHome
    if(req.currentScope !== req.user.defaultHome && req.user.role !== 'admin'){
        res.redirect(`/secure/${req.user.defaultHome}/?access_token=${req.jwt}`);
    }

    next() // go to next function in list
}

exports.authorizeAdmin = (req, res, next) => {


    //if user is not admin generate error and return
    req.currentScope = req.path.replace(/^\/+|\/+$/g, '');
    if(req.user.role !== 'admin')
    {
            const err = new Error('No user found');
            err.status = 404; //indicates not found
            return next(err); //show ugly error

    }

    //if user is admin call the next function in the chain
    next();


}