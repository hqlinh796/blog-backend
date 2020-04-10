const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const postModel = require('../models/post.model');

//get all post
router.get('/', async (req, res, next) => {
    const page = parseInt(req.query.page || 0),
          limit = parseInt(req.query.limit || 2),
          sort = req.query.sort || 'date',
          category = new RegExp(escapeSpace(req.query.category || ''), 'gi');
    try {
        let totalPosts, posts;
        if (sort !== 'rating') {
            [totalPosts, posts] = await Promise.all(
                    [postModel
                        .find({"category.slug": category})
                        .count(),
                    postModel
                        .find({"category.slug": category})
                        .sort({ [sort]: -1 })
                        .skip(page * limit)
                        .limit(limit)
                    ])
        } else { 
            [totalPosts, posts] = await Promise.all(
                [postModel
                    .find({"category.slug": category})
                    .count(),
                postModel
                    .aggregate([
                        {
                            $match: {"category.slug": category}
                    },
                        { 
                            $project: {
                            _id: 1,
                            title: 1,
                            cover: 1,
                            description: 1,
                            category: 1,
                            date: 1,
                            tags: 1,
                            rating: 1,
                            averate_rating: { "$avg": "$rating" }
                        }
                    }])
                    .sort({averate_rating: -1})
                    .skip(page * limit)
                    .limit(limit)
                ])
        }
        
        const totalPages = Math.ceil(totalPosts/limit),
              hasMore = page + 1 < totalPages;
        console.log('total page: ' + totalPages);
        return res.status(200).json({
            count: posts.length,
            page,
            totalPages,
            hasMore,
            posts: posts.map( postSingle => {
                const {_id, title, cover, description, category, date, tags, rating} = postSingle;
                return {
                    _id,
                    title,
                    cover,
                    description,
                    category: category.name,
                    date,
                    tags,
                    rating
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
          limit = parseInt(req.query.limit || 2),
          sort = req.query.sort || 'date',
          category = new RegExp(escapeSpace(req.query.category || ''), 'gi');

    const keyRex =  new RegExp(escapeSpace(keyword), 'gi');
    //console.log("sau khi escape: " + keyRex);

    try {
        let totalPosts, posts;
        if (sort !== 'rating') {
            [totalPosts, posts] = await Promise.all(
                    [postModel
                        .find({title: keyRex, "category.slug": category})
                        .count(),
                    postModel
                        .find({title: keyRex, "category.slug": category})
                        .sort({ [sort]: -1 })
                        .skip(page * limit)
                        .limit(limit)
                    ])
        } else { 
            [totalPosts, posts] = await Promise.all(
                [postModel
                    .find({title: keyRex, "category.slug": category})
                    .count(),
                postModel
                    .aggregate([{
                        $match: {
                            title: keyRex,
                            "category.slug": category
                        }},
                        {
                        $project: {
                            _id: 1,
                            title: 1,
                            cover: 1,
                            description: 1,
                            category: 1,
                            date: 1,
                            tags: 1,
                            rating: 1,
                            average_rating: { "$avg": "$rating" }
                        }
                    }])
                    .sort({average_rating: -1})
                    .skip(page * limit)
                    .limit(limit)
                ])
        }

        const totalPages = Math.ceil(totalPosts/limit),
              hasMore = page + 1 < totalPages;

        return res.status(200).json({
            count: posts.length,
            page,
            totalPages,
            hasMore,
            posts: posts.map( postSingle => {
                const {_id, title, cover, description, category, date, tags, rating} = postSingle;
                return {
                    _id,
                    title,
                    cover,
                    description,
                    category: category.name,
                    date,
                    tags,
                    rating
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

//get top favorite post
router.get('/top-rating', async (req, res, next) => {
    try {
        const posts = await postModel.aggregate([
            {"$project": {
                _id: 1,
                title: 1,
                cover: 1,
                rating: {"$avg": "$rating"}
            }}
        ]).sort({rating: -1}).limit(5);
        if (posts !== null)
            return res.status(200).json(
                posts.map(postSingle => {
                    const {_id, title, cover} = postSingle;
                    let rating = postSingle.rating;
                    rating = Math.round(rating*100)/100;
                    return {
                        _id,
                        title,
                        cover,
                        rating
                    }
                })
            );
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
            return res.status(200).json(
                posts.map(postSingle => {
                    const {title, cover, date, _id} = postSingle;
                    return {
                        _id,
                        title,
                        cover,
                        date
                    }
                })
            );
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
})

//get top view post
router.get('/top-view', async (req, res, next) => {
    try {
        const posts = await postModel.find().sort({views: -1}).limit(5);
        return res.status(200).json(posts.map(post => {
            const {_id, title, cover, views} = post;
            return {
                _id,
                title,
                cover,
                views
            }
        }));
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
        const post = await postModel.findById(postID);
        post.views++;
        const newPost = await post.save();
        if (post !== null) {
            const {title, cover, author, tags, date, content, category, rating} = newPost;
            return res.status(200).json({
                title,
                cover,
                author,
                tags,
                date,
                content,
                category: category.name,
                rating
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        })
    }
    next();
})

//get related posts
router.get('/:postID/related-post', async (req, res, next) => {
    const postID = req.params.postID;
    const post =  await postModel.findById(postID);
    const category = post.category; 
    
    console.log(category);
    try {
        const posts = await postModel.find({category: category, _id : {$ne: postID}}).limit(3);
       // if (posts.length)
            return res.status(200).json(
                posts.map(post => {
                    const {_id, cover, title} = post;
                    return {
                        _id,
                        cover,
                        title
                    }
                })
            )
        next()
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
})



//create post
router.post('/', async(req, res, next) => {
    const { title, description, author, category, content, cover, tags } = req.body;
    const date = Date.now();
   // console.log("ok ne");
    const newPost = new postModel({
        
        title,
        description,
        author,
        date,
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

//rate
router.post('/rate', async (req, res, next) => {
    const {postID, rating} = req.body;
    try {
        const post = await postModel.findById(postID);
        
        post.rating.push(rating);
        await post.save();
        res.status(200).json({
            message: 'Rate Successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

escapeSpace = (text) => text.replace(/\s/g, "\\$&",);

calulateAverage = (arr) => arr.reduce((total, value) => total += value)/arr.length;

module.exports = router;