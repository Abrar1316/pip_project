const express =require("express");

const router = express.Router();

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    description:String,
    postId: String
})


const postModel = mongoose.model('post',postSchema)


router.get('/getpost',(req,res)=>{
    postModel.find({},function(docs,err){
        if(!err){
            res.send(docs)
        }else{
            res.send(err)
        }
    });

})
router.post('/addNewPost',(req,res)=>{
    
    const newPost = new postModel({
        title:req.body.title,
        imgUrl:req.body.imageUrl,
        description:req.body.description,
        uniqId:req.body.uniqid
    })
    newPost.save(function(err){
        if(!err){
            res.send("post added!!!!")
        }else{
            res.send(err);
        }
    })
})
module.exports =router