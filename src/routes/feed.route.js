const router = require('express').Router()
const storage = require('../libs/multer')
const multer = require('multer')()
const { AddPost, DeletePost, EditPost, ListPost } = require('../controller/media.controller')
const { Authenticate } = require('../middleware/restrict')

router.post('/post', Authenticate, multer.single('image_url'), AddPost)
router.put('/update-caption/:id', Authenticate, EditPost)
router.delete('/:id', Authenticate, DeletePost)
router.get('/', Authenticate, ListPost)

module.exports = router