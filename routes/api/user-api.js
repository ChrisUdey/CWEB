const express = require('express')
const router = express.Router()

const {findAllUsers,findUserByUserInfo} = require('../../controllers/user-controller')

router.get('/users', (req, res) => {
    let filter = null // no filter - bring back all users
    if(req.query && Object.keys(req.query).length > 0){
        filter = req.query;
    }
    const users = findAllUsers(filter);
    if(users.length) {
        return res.status(200).json(users);
    }
    //option 1 : if fails - make your json error message
    return res.status(404).json( {error: 'Users not found'})

    //option 2 : default error handler in app.js make the JSON error for you
    // return next();

})


router.get('/users/:id', (req, res) => {
    const user = findUserByUserInfo(
        { id: parseInt(req.params.id,0) }
    );

    if(user){
        user.password = undefined; //remove sensitive data
        return res.status(200).json(user);
    }
    //Opt 1: if fails make your own JSON Error message
    return res.status(404).json({error: 'User not found'})

    //Opt2
    //return next();


})



module.exports = router;