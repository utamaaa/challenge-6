const router = require('express').Router()
const morgan = require('morgan')
const authRoute = require('../routes/auth/auth.route')
const userRoute = require('../routes/user.route')
const feedRoute = require('../routes/feed.route')

router.use(morgan('dev'))

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/feeds', feedRoute)

module.exports = router