const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const postModel = require('../models/post.model');

//get all post
router.get('/', async (req, res, next) => {
    const page = parseInt(req.query.page || 0),
          limit = parseInt(req.query.limit || 2);

    try {
        const  [totalPosts, posts] = await Promise.all(  
            [   postModel.count(),
                postModel.find().skip(page*limit).limit(limit).populate('comments', '_id')
             ])
        const totalPages = Math.ceil(totalPosts/limit) - 1,
              hasMore = page < totalPages;
        //postModel.find().skip(page*limit).limit(limit).populate('comments', '_id');
        //console.log(posts);
        return res.status(200).json({
            count: posts.length,
            page,
            totalPages,
            hasMore,
            posts: posts.map( postSingle => {
                const {_id, title, cover, description, category, comments, date} = postSingle;
                return {
                    _id,
                    title,
                    cover,
                    description,
                    category,
                    date,
                    numOfComments: comments.length
                }
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
    const keyword = req.query.keyword || '',
          page = parseInt(req.query.page || 0),
          limit = parseInt(req.query.limit || 2);

    const keyRex =  new RegExp(escapeSpace(keyword), 'gi');
    //console.log("sau khi escape: " + keyRex);

    try {
        const  [totalPosts, posts] = await Promise.all(  
            [   postModel.count({title: keyRex}),
                postModel.find({title: keyRex})
                         .skip(page*limit)
                         .limit(limit)
             ])
        const totalPages = Math.ceil(totalPosts/limit) - 1,
              hasMore = page < totalPages;

        if (posts !== null)
            return res.status(200).json({
                keyword,
                count: posts.length,
                page,
                totalPages,
                hasMore,
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
        const post = await postModel.findById(postID).populate('comments', 'name content rate');
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