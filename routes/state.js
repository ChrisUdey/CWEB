const express = require('express');
const router = express.Router();

router.get('/cookie', (req, res) => {
    res.render('set-cookie', {
        title: 'GET - Set Cookie',
        activeCookies: req.cookies,
    });
})

router.post('/cookie', (req, res) => {
    const cookieOptions = {
        path:req.baseUrl, //URL path to our website
        sameSite: 'lax',
        httpOnly: req.body.hide && req.body.hide ==="yes",
        //httpOnly hides the cookie from the browser's JS Engine
    }
    //if "clear" button was clicked then clear out all the cookies
    if(req.body.clear && req.body.clear ==="clear"){
        console.log(req.cookies); //see all the cookies we got from the browser
        for(const cookieName in req.cookies)
        {
            res.clearCookie(cookieName,cookieOptions);
        }
    } else
    {
        //use header to set cookie on browser
        //use the timeout input to set the cookie expiry
        cookieOptions.maxAge = 1000 * req.body.expiry;
        res.cookie(req.body.name, req.body.value, cookieOptions);
    }

    res.render('set-cookie', {
        title: 'POST - Set Cookie',
        activeCookies: req.cookies,
        postedValues: req.body,
    });
})

router.get('/session', (req, res) => {

    req.session.myHardCodedSessionKey = "some hard coded value";

    res.render('set-session', {
        title: 'GET - Session',
        sessionID: req.sessionID, //id stored in cookie on browser

        //quick hack convert the session object into JSON to display on page - DO NOT DO THIS EVERY AGAIN -- ONLY EXMAPLE
        activeSession: JSON.stringify(req.session,null,4),
    })
})

router.post('/session', (req, res) => {

    req.session.myHardCodedSessionKey = "Hey traveller you just posted - you be changing ;)❤️❤️❤️❤️❤️";

    const callback = (err)=>{
        if(err)
        {
            console.log(err);
            throw err;
        }
    }
    switch(req.body.purpose)
    {
        case 'regenerate':
            req.session.regenerate(callback)
            break;
        case 'destroy':
            req.session.destroy(callback)
            break;
        case 'reload':
            req.session.reload(callback)
            break;
        default:
            if(req.body.category && !req.session.hasOwnProperty(req.body.category))
            {
                req.session[req.body.category] = {};
            }
            const sess = req.body.category? req.session[req.body.category]: req.session
            sess[req.body.name] = req.body.value;

    }

    res.render('set-session', {
        title: 'POST - Session',
        sessionID: req.sessionID, //id stored in cookie on browser
        //quick hack convert the session object into JSON to display on page - DO NOT DO THIS EVERY AGAIN -- ONLY EXMAPLE
        activeSession: JSON.stringify(req.session,null,4),
        postedValues: req.body,
    })
})







//So other files can "read" the code on this file
module.exports = router;