const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const categoryModel = require('../models/category.model');


//get list category and number of posts in them
router.get('/', async (req, res, next) => {

    try {
        const categories = await categoryModel.find();
        if (categories.length > 0) 
            return res.status(200).json(categories);
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        })
    }
    

})



module.exports = router;