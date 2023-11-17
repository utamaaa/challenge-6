const { ResponseTemplate } = require('../helper/resp.helper')
const Joi = require('joi')

function CheckUser(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()]{8,30}$')).required()
    })

    const { error } = schema.validate(req.body)
    if (error) {
        let response = ResponseFormatter(null, 'invalid request', error.details[0].message, 400)
        return res.status(400).json(response)
    }
    next()
}


module.exports = {
    CheckUser,
}