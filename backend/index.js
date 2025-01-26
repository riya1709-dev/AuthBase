require('dotenv').config()
const express = require('express')
const cookieParser= require("cookie-parser")
const cors = require("cors")
const path = require("path")



require("./db/conn")
const authRoutes = require("./routes/authroute")

//import express from 'express'
const app= express();
const port = process.env.PORT || 5000;

//const __dirname= path.resolve()
//path.resolve() is a method in Node.js used to resolve paths to absolute paths.

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"../frontend","dist","index.html"))
    })
}
app.use(cors({ origin: "http://localhost:5173", credentials:true}))
// allows web applications to access resources from different domains

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})