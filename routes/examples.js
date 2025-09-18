/****
 * example.js
 * router for path http://localhost:3000/examples
 ***/

const express = require('express');
const router = express.Router();

//use the multer package to make file upload handling "easier" for developers
const multer = require("multer");
//override the default temp upload location
const uploadFuncs = multer({
    dest: "public/temp-uploads",
    fileFilter: function (req, file, callback) {
        //Note: This code is called by the uploadFuncs.fields() method- !!!BEFORE "our code"
        //Check mimetype for a quick way to check if file is an image
        if(file.mimetype.startsWith("image/"))
        {
            //Allow image so call the callback function
            callback(null, true); //null means no error and true means allowed
        } else
        {
            //file is not an image - so NOT allowed - return callback with an error to BREAK the workflow
            return callback(new Error("Only images are allowed"), false);
        }
    },
    //2 MegaByes is 2095752 easier for dev to do a calculation
    limits: {fileSize: 1024* 1024 * 2} //Max of 2MB file size

});

const fs = require("fs");


function moveFile(tempFileInfo, newPath)
{
    newPath += tempFileInfo.filename + '-' + tempFileInfo.originalname;
    fs.rename(tempFileInfo.path, newPath, (err) => {
        if (err) { throw err;}
        console.log("File moved to " + newPath);
    })
    tempFileInfo.filename += '-' + tempFileInfo.originalname; //append the orginal path
    tempFileInfo.path = newPath; // Update the fileInfo opject with updated filepath
}

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

/**
 * This is the get handler for http://localhost:3000/examples/form
 */
router.get('/form', (req, res) => {
//GENERAL RULE: req.query is usually handed in the get -router.get
    res.render('form-example',{
        title:"GET - form example",
        submittedPassword: req.query.pwd,
        submittedEmail: req.query.email,
        submittedAgreed: req.query.agreed,
    });

})

/**
 * This is the POST handler for http://localhost:3000/examples/form
 */
router.post('/form', (req, res) => {
//GENERAL RULE: req.body is usually handed in the post - router.post

    res.render('form-example',{
        title:'POST - form example',
        isSubmitted: true, //post handler means form was submitted
        submittedPassword: req.body.pwd,
        submittedEmail: req.body["email"],
        submittedAgreed: req.body.agreed,
        QueryMail: req.query.qmail,
        //The more popular way is to pass the entire req.body object
        body : req.body,

    });

})


//TODO make 2 routes handlers for http://localhost:3000/examples/upload - display form and title

router.get('/upload', (req, res) => {
    res.render('upload-files',{
        title: 'GET - UPLOAD FILE',

    });
})

router.post('/upload',
    //multer middleware get req,res, and next and modifies the req object
    uploadFuncs.fields([{name: "filetag1",maxCount:3},{name: "filetag2",maxCount:3}])

    ,(req, res) => {
    // At this point multer (uploadFuncs.fields()) has modified the request object
    console.log(req.files) // output the structure of the files object

        //just move 1 file for now - first file
        //const firstFileInfo = req.files.filetag1[0];

    const uploadedFileNames=[];
    //outer loop through req.files object

        for(const [KEY, fileinfoArray] of Object.entries(req.files))
        {
            for(const newImage of fileinfoArray)
            {
                moveFile(newImage, __dirname + "/../public/images/")
                uploadedFileNames.push(newImage.filename);
            }
        }




    //TODO upload at least 2 files in filetag1 then display the original name of the file
    res.render('upload-files',{
        title: 'POST - Upload example',
        isSubmitted: true,
        //OgName: req.files.filetag1?.[1].originalname,
        firstFileInfo: req.files.filetag1[0],
        fileInfo: req.files.filetag1.concat(req.files.filetag2),
        uploadedFileNames,
    });
})



// need to export in order for app.js to "read" this file
module.exports = router;