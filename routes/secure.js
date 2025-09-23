const express = require('express');
const router = express.Router();

const {generateJWT, authenticateJWT, authorizeUser} = require('../middleware/auth-middleware')
const {getUserInfo} = require('../controllers/user-controller')

//LOGIN http://localhost:3000/secure/login
router.get('/login', (req, res) => {
    res.render('secure-login', {
        title: 'GET - Login form' ,
        //prepopulate textbox to reduce typing
        credentials: {email:'admin@t.ca', pwd:'123456Pw'},
    });
})

router.post('/login', (req, res) => {
    const userInfo = getUserInfo(req.body.email, req.body.pwd);

    if(userInfo.id){
        // user info has id so generate the JWT
        const token = generateJWT(userInfo);

        // we have a token so redirect with that token
        res.redirect(`/secure/${userInfo.defaultHome}/?access_token=${token}`);
    }

    res.render('secure-login', {
        title: 'POST - Login form' ,
        //prepopulate textbox to reduce typing
        credentials: req.body,
        isSubmitted: true,
        //hard code err message - why? because if we see this page we did not get redirected
        err:{email:'Credentials not recongized', pwd:'WRONG'}
    });
})


const genericHandler =  (req, res) => {
    res.render('secure-generic', {
        title: 'GET - ' + req.currentScope?.toUpperCase(), //Aadded by our middleware
        token: req.jwt, //added by our middleware
        payload: req.user, //added by our middleware
        action: req.baseUrl + req.path,
    })
}

// DASHBOARD / PROFILE / BOOKING
router.get(['/dashboard','/profile','/booking'],
    authenticateJWT,
    authorizeUser,
    genericHandler


)


router.post(['/dashboard','/profile','/booking'],
    authenticateJWT,
    authorizeUser,
    genericHandler
)








module.exports = router;