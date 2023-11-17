const { ComparePassword, HashPassword } = require('../../helper/pass.helper')
const { ResponseTemplate } = require('../../helper/resp.helper')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient

const jwt = require('jsonwebtoken')

async function Register(req, res, next) {

    const { username, email, password } = req.body

    const hashPass = await HashPassword(password)

    const payload = {
        username,
        email,
        password: hashPass,
    }

    try {

        const checkUser = await prisma.users.findUnique({
            where: {
                email
            }
        })

        if (checkUser) {
            let response = ResponseTemplate(null, 'email already used', null, 400)
            return res.status(400).json(response)

        }

        await prisma.users.create({
            data: {
                username: payload.username,
                email: payload.email,
                password: payload.password
            },
        })

        let response = ResponseTemplate(null, 'created success', null, 200)
        return res.status(200).json(response)

    } catch (error) {
        next(error)
    }
}

async function Login(req, res, next) {
    const { email, password } = req.body

    try {

        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            let response = ResponseTemplate(null, 'bad request', 'invalid email or password', 400)
            res.status(400).json(response)
            return
        }

        let checkPassword = await ComparePassword(password, user.password)

        if (!checkPassword) {
            let response = ResponseTemplate(null, 'bad request', 'invalid email or password', 400)
            res.status(400).json(response)
            return
        }

        let token = jwt.sign(user, process.env.JWT_SECRET_KEY)

        let response = ResponseTemplate(token, 'success', null, 200)
        res.status(200).json(response)
        return

    } catch (error) {
        next(error)
    }
}



module.exports = {
    Register,
    Login,
}