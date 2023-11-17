const express = require('express')
const app = express()
const router = require('./src/routes/route')
require('dotenv').config()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/API/v1/', router)

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`)
})
