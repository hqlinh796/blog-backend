const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const postModel = require('../models/post.model');

//get all post
router.get('/', async (req, res, next) => {
    const page = req.query.page || 0,
          limit = req.query.limit || 5;

    try {
        const postArray = await postModel.find().skip(page*limit).limit(limit);
        //console.log(postArray);
        return res.status(200).json({
            count: postArray.length,
            posts: postArray.map( postSingle => {
                return postSingle;
            })
        }) 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        })
    }
})

//search post
router.get('/search', async (req, res, next) => {
    const keyword = req.query.keyword,
          page = req.query.page || 0,
          limit = req.query.limit || 2;

    const keyRex =  new RegExp(escapeSpace(keyword), 'gi');
    console.log("sau khi escape: " + keyRex);

    try {
        const posts = await postModel.find({title: keyRex}).skip(page*limit).limit(limit);
        if (posts !== null)
            return res.status(200).json({
                count: posts.length,
                posts: posts.map(postSingle => {
                    return postSingle;
                })
            });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
})

//get top post
router.get('/top-post', async (req, res, next) => {
    try {
        const posts = await postModel.find().sort({rate: -1}).limit(5);
        if (posts !== null)
            return res.status(200).json({
                count: posts.length,
                posts: posts.map(postSingle => {
                    const {title, cover, rate} = postSingle;
                    return {
                        id: postSingle._id,
                        title,
                        cover,
                        rate
                    }
                })
            });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
})


//get recent post
router.get('/recent-post', async (req, res, next) => {
    try {
        const posts = await postModel.find().sort({date: -1}).limit(5);
        if (posts !== null)
            return res.status(200).json({
                count: posts.length,
                posts: posts.map(postSingle => {
                    const {title, cover, date} = postSingle;
                    return {
                        id: postSingle._id,
                        title,
                        cover,
                        date
                    }
                })
            });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
})

//get specific post
router.get('/:postID', async (req, res, next) => {
    const postID = req.params.postID;
    try {
        const post = await postModel.findById(postID).populate('comments');
        if (post !== null)
            return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        })
    }
    next();
})



//create post
router.post('/', async(req, res, next) => {
    const { title, description, author, category, content, cover, tags } = req.body;
   // console.log("ok ne");
    const newPost = new postModel({
        
        title,
        description,
        author,
        category,
        content,
        cover,
        tags
    })
    try {
        const post = await newPost.save();
        return res.status(201).json({
            message: 'Created successfully',
            request: {
                type: 'GET',
                url: 'localhost:5500/posts/' + post.id
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        })
    }
})



escapeSpace = (text) => text.replace(/\s/g, "\\$&",);


module.exports = router;