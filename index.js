//create multiple buttons on home page
//clicking on button takes to form and post
//display after submission on homepage as list

import bodyParser from "body-parser";
import express from "express";
import {dirname, join} from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";


const __dirname=dirname(fileURLToPath(import.meta.url));
const app=express();
const port=3000;
let formData={};
var submissions=[];
//using middlewares

//getting session data
//app.use(morgan("tiny"));

app.use(express.static(join(__dirname, "public"))); 
app.set('view engine', 'ejs');

//catching form data
app.use(bodyParser.urlencoded({extended:true}));


//HOME PAGE
app.get("/", (req,res)=>{
    //res.send("<h1>Hello jee</h1>")
    res.render("home", {submissions});
    //res.sendFile(__dirname+"/Public/index.html");
});

//press create button on home and will take to create path
app.post("/create", (req,res)=>{
    //res.send("<h1>Hello jee</h1>")
    res.render("create");
    //res.sendFile(__dirname+"/Public/index.html");
});


//press edit button on home and will take to edit path
app.get('/list', (req, res) => {
    res.render('list', { submissions });
});

app.get('/edit', (req, res) => {
    const submissionIndex = req.query.submissionIndex;
    const submission = submissions[submissionIndex];
    res.render('edit', { submission, submissionIndex });
});

app.post('/update', (req, res) => {
    const submissionIndex = req.body.submissionIndex;
    submissions[submissionIndex].title = req.body.title;
    submissions[submissionIndex].content = req.body.content;
    res.send(`
        <html>
            <body>
                <p>Submission updated successfully!</p>
                <script>
                    setTimeout(function() {
                        window.location.href = '/';
                    }, 2500);
                </script>
            </body>
        </html>
    `);
});

//press delete button on home and will take to create path
app.post("/delete", (req,res)=>{
    //res.send("<h1>Hello jee</h1>")
    res.render("delete", {submissions});
    //res.sendFile(__dirname+"/Public/index.html");
});

app.post('/delete_selected', (req, res) => {
    let selectedTitles = req.body.titles;
    if (!selectedTitles) {
        selectedTitles = [];
    } else if (!Array.isArray(selectedTitles)) {
        selectedTitles = [selectedTitles];
    }

    // Filter out the submissions that are not selected for deletion
    submissions = submissions.filter(submission => !selectedTitles.includes(submission.title));

    console.log('Remaining submissions:', submissions);
    res.send(`
        <html>
            <body>
                <p>Selected submissions have been deleted successfully!</p>
                <script>
                    setTimeout(function() {
                        window.location.href = '/';
                    }, 2000);
                </script>
            </body>
        </html>
    `);
});

app.post("/submit", (req, res) => {
    const { title, content } = req.body;
    submissions.push({ title, content });
    console.log(submissions);
    res.redirect("/");
});

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
})

