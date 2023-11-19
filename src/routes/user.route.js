const router = require('express').Router()
const storage = require('../libs/multer')
const multer = require('multer')()
const { ListUser, ViewProfile, ChangePhoto, DeleteUser } = require('../controller/user.controller')
const { Authenticate } = require('../middleware/restrict')

router.get('/', ListUser)
router.get('/:username', ViewProfile)
router.delete('/:id', Authenticate, DeleteUser)
router.post('/change-photo', Authenticate, multer.single('image'), ChangePhoto)


module.exports = router