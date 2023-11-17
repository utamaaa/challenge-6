const { ResponseTemplate, Pagination } = require('../helper/resp.helper')
const imagekit = require('../libs/imagekit')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient

async function AddPost(req, res) {

    const { title, description } = req.body

    const fileString = req.file.buffer.toString('base64')
    const uploadImage = await imagekit.upload({
        fileName: req.file.originalname,
        file: fileString
    })

    const payload = {
        userId: req.users.id,
        image_url: uploadImage.url,
        title,
        description
    }

    try {
        await prisma.feeds.create({
            data: {
                ...payload
            }
        })

        const payloadData = {
            image_url: uploadImage.url,
            title,
            description
        }

        let response = ResponseTemplate(payloadData, 'succes', null, 200)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        let response = ResponseTemplate(null, 'internal server error', error, 500)
        return res.status(500).json(response)
    }
}

async function DeletePost(req, res) {
    const { id } = req.params
    try {
        await prisma.feeds.delete({
            where: {
                id
            }
        })
        let response = ResponseTemplate(null, 'success', null, 200)
        return res.status(200).json(response)
    } catch (error) {
        let response = ResponseTemplate(null, 'internal server error', error, 500)
        return res.status(500).json(response)
    }
}

async function EditPost(req, res) {

    const { title, description } = req.body
    const { id } = req.params

    const payload = {}

    if (!title && !description) {
        let response = ResponseTemplate(null, 'bad request', null, 400)
        return res.status(400).json(response)
    }

    if (title) {
        payload.title = title
    }

    if (description) {
        payload.description = description
    }

    try {
        const updateImage = await prisma.feeds.update({
            where: { id },
            data: { ...payload },
            select:{
                id:true,
                title:true,
                image_url:true,
                description:true,
                updatedAt:true,

            }
        })

        let response = ResponseTemplate(updateImage, 'success', null, 200)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        let response = ResponseTemplate(null, 'internal server error', error, 500)
        return res.status(500).json(response)
    }
}

async function ListPost(req, res) {
    const { userId, image_url, title, description, page, perPage } = req.query

    const payload = {}

    if (userId) {
        payload.userId = req.users.id
    }

    if (image_url) {
        payload.image_url = image_url
    }

    if (title) {
        payload.title = title
    }

    if (description) {
        payload.description = description
    }

    try {

        const currentPage = parseInt(page) || 1
        const itemsPerPage = parseInt(perPage) || 10

        const totalCount = await prisma.feeds.count({
            where: payload,
        })

        const allPost = await prisma.feeds.findMany({
            where: payload,
            select:{
                id:true,
                image_url:true,
                title:true,
                description:true
            },  
            orderBy: {
                createdAt: 'asc'
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        })

        const totalPages = Math.ceil(totalCount / itemsPerPage)

        let pagination = Pagination(currentPage, totalCount, totalPages)
        let response = ResponseTemplate(allPost, 'fetch all posts success', null, 200)
        res.status(200).json({ data: response, pagination })
        return
    } catch (error) {
        let response = ResponseTemplate(null, 'internal server error', error, 500)
        res.status(500).json(response)
        return
    }

}

module.exports = {
    AddPost,
    DeletePost,
    EditPost,
    ListPost,
}