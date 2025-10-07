const express = require('express');
const {getUserInfo, findUserByUserInfo} = require("../../controllers/user-controller");
const {authenticateJWT, generateJWT} = require("../../middleware/auth-middleware");
const router = express.Router();


const loginUser = (req,res) => {
    const userInfo = getUserInfo(
        req.query.email || req.body.email,
        req.query.pwd || req.body.pwd);
    if (userInfo.id) {
        // is user id exists then generate token from userInfo object
        const token =  generateJWT(userInfo) //TODO generate the token from userInfo object
        return res.status(200).json({
            token: token,
            userInfo: userInfo,
        })
    }
    //option 1 : if fails - make your json error message
    return res.status(404).json( {error: 'Users not found'})
}


router.get('/login', loginUser)
router.post('/login', loginUser)



module.exports = router;