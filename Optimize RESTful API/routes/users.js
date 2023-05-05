const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(0).max(120).required()
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

router.post('/', async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const newUser = new User(value);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
