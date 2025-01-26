const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/Auth-Tutorial").then(()=>{
    console.log("connected to database")
}).catch((e)=>{
    console.log(e)
})