const router = require('express').Router()
const { Register, Login} = require('../../controller/auth/auth.controller')
const { CheckUser } =require('../../middleware/middleware')
const { Authenticate } = require('../../middleware/restrict')

router.post('/register', CheckUser, Register)
router.post('/login', Login)
// router.get('/whoami', Authenticate, Whoami)


module.exports = router