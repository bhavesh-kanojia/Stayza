const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().allow(""),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),
        image : Joi.string().allow("",null),
    }).required()
})

const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().allow("")
    }).required()
})

const signupSchema = Joi.object({
    email : Joi.string().email().required(),
    username : Joi.string().required(),
    password : Joi.string().required(),
})

module.exports = {listingSchema,reviewSchema,signupSchema};