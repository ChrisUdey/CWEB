/****
 * example.js
 * router for path http://localhost:3000/examples
 ***/

const express = require('express');
const router = express.Router();

router.get('/', function(req, res)
{
    res.send(`
    <html>
        <head>
        <link rel="stylesheet" type="text/css" href="/bw/vapor/bootstrap.css"></link>
        </head>
    <body class="container">
    <h1>Examples</h1>
    <ul>
        <li>
        <a href="/examples/simple-code">Simple Code</a>
        </li>
    </ul>
    </body>
    </html>
    
    `);


})

// GET handler for http://localhost:3000/examples/simple-code
router.get('/simple-code', (req, res) =>
{
    // do logic before the res.render because hbs files are not super smart
    const numbers = [6,3,9,1,0,45];
    const randomNum = Math.floor(Math.random() * 10);
    const randomIsEven = randomNum % 2 === 0 // Comparison operator returns boolean - save boolean to a variable;
    const randomNumbers = [];
    for(let i = 0; i < 10; i++) {
        randomNumbers[i] = Math.floor(Math.random() * 10);
    }

    res.render('simple-code', {
        title:"Welcome Page!",
        myPosition: "Student",
        myName: "Christopher U",
        numbers,
        cssClass: "bg-danger",
        randomNum,
        randomIsEven,
        randomNumbers

    });
})


// need to export in order for app.js to "read" this file
module.exports = router;