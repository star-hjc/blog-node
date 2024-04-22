const express = require('express')
const { postModel, userModel } = require('../../domain')

const router = express.Router()


router.get('/list', async (req, res) => {
    res.data(await postModel.getPostList(req.body))
})


router.get('/details', (req, res, next) => {
    const result = Joi.string().allow('').validate(req.body.postId).error
    if (result) {
        const err = new Error(result.message)
        err.status = 401
        next(err)
    }
    next()
}, async (req, res) => {
    const { postId } = req.body
    const post = await postModel.watchPost(postId)
    if (!post) res.err({ message: '当前博客不存在...' })
    res.data(post)
})


router.get('/add', async (req, res) => {
    const { code } = req.auth
    const user = userModel.searchUser({ code })
    res.data(await postModel.createPost({
        authorId: user.id,
        cover: '',
        title: '',
        content: '',
        catalog: ''
    }))
})


module.exports = router