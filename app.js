const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const request = require("request")
const https = require('https')
const app = express()
const multer = require("multer")
const path = require('path')
const fs = require('fs');
require('dotenv').config();
var server = require('http').createServer(app);

app.set("view engine", "ejs");


mongoose.set('strictQuery', false);
const connectDB = async () => {
try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`)
} catch (error) {
    console.log(error);
    process.exit(1);
}
}

// mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true})
// .then(() => console.log("connected succesfully"))
// .catch((err)=> console.log(err));


app.use(bodyParser.urlencoded({extended: true}))


 
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'Images')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// });
 
// var upload = multer({ storage: storage });


const menteeSchema = ({
    mentor: String,
    title: String,
    firstname:String,
    surname: String,
    department:String,
    designation:String,
    username: String,
    num:Number,
    image: String
})
const userSchema = {
      username: String,
      password:String
};

const Mentee = mongoose.model("Mentee",menteeSchema );
const User = mongoose.model("User",userSchema );

app.use(express.static("public"));


app.get("/", function(req,res){
    res.render("welcome")
})

app.get("/upload", function(req,res){
    res.render("upload")
})

app.get("/sucess", function(req,res){
    res.render("sucess")
})
app.get("/failure", function(req,res){
    res.render("failure")
})
app.get("/login", function(req,res){
    res.render("login")
})
app.get("/register", function(req,res){
    res.render("register")
})
app.get("/home", function(req,res){
    res.render("home")
})
// app.post("/upload", upload.single("image"), (req, res) =>{
//     res.render("home")
// })
app.post("/login", function(req,res){
const username =req.body.username;
const password = req.body.password
User.findOne({
    username: username, 
    password:password
     })
    .then((foundUser)=>{
         if(foundUser.password === password){
            res.render("home")
         }else{
            if(!foundUser){
                res.render("failure")
            }
         }
    })
    .catch((err) =>  res.render("failure"));
})



app.post("/", (req,res)=>{
     const mentor = req.body.mentor
     const title = req.body.title;
     const firstname  = req.body.fname;
     const surname = req.body.surname;
     const department = req.body.department;
     const designation = req.body.designation;
     const username = req.body.username;
     const num = req.body.num;
     const image = req.body.image;

     const mentee = new Mentee ({
        mentor:mentor,
        title:title,
        firstname:firstname,
        surname:surname,
        department:department,
        designation:designation,
        username:username,
        num:num,
        image:image
        // image: {
        //     data:req.file.filename,
        //     contentType: 'image/png'
        // }
        
     })
     mentee.save()
     .then(()=>{
        res.redirect("sucess")
     }).catch(() =>  res.render("failure"));


    

    //  if(res){
    //     res.redirect("/sucess")
    //  }else {
    //     res.redirect("/failure")

    //  }   

    //  upload(req,res, (err) =>{
    //     if(err) {
    //         console.log(err)
    //     }else{
    //         const newImage = new Image({
    //             image:{
    //                 data: req.file.filename,
    //                 contentType: "image/png"
    //             }
    //         })
    //         newImage.save()
    //         .then(()=> res.send("sucess"))
    //         .catch(err=>console.log(err))
    //     }
    //  })
 })
app.post("/register", function(req,res){
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    })
    newUser.save()
    .then(()=>{
        res.redirect("/home")
     }).catch(() =>  res.render("failure"));
    //   if(res){
    //     res.render("home")
    //  }else {
    //     res.redirect("failure")

    //  }  
    })

app.post("/failure", function(req, res){
    res.redirect("/")
})
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

connectDB().then(() =>{
    app.listen(port, function(){
        console.log(`server running at port ${port}`)
    })
    
})


