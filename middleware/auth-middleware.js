const jwt = require('jsonwebtoken');
const {findUserByUserInfo} = require('../controllers/user-controller');
const JWT_SECRET_KEY = 'askjbfkjshklfjshadfkljasdkjbfkasjdhfkja'

const FRIENDLY_AUTHORIZE = false;

exports.generateJWT = (payload)=> {
    return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: '1d'});
}