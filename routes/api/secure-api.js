const express = require('express');
const {getUserInfo} = require("../../controllers/user-controller");
const {generateJWT} = require("../../middleware/auth-middleware");
const router = express.Router();

const loginUser = (req, res) => {
    const userInfo = getUserInfo(
        req.query.email || req.body.email,
        req.query.pwd || req.body.pwd);

    if (userInfo.id)
    {
        const token = generateJWT(userInfo);
        return res.status(200).json({
            token,
            userInfo
        });
    }
    //option 1 : if fails - make your json error message
    return res.status(404).json( {error: 'Users not found'})

    //option 2 : default error handler in app.js make the JSON error for you
    // return next();
}

router.get('/login',loginUser)

router.post('/login',loginUser)


module.exports = router;