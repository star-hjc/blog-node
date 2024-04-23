const express = require('express')
const Joi = require('joi')
const dayjs = require('dayjs')
const md = require('markdown-it')
const { uuidRegexp } = require('../../utils/regexp')
const { postModel, userModel, likeModel, starModel, labelModel } = require('../../domain')
const { user: { MaximumLikesPerDay } } = require('../../config/settings')
const router = express.Router()


router.get('/list', (req, res, next) => {
    const result = Joi.object({
        pageNum: Joi.number().min(0),
        pageSize: Joi.number().min(1)
    }).validate(req.body).error
    if (result) {
        const err = new Error(result.message)
        err.status = 405
        next(err)
    }
    next()
}, async (req, res) => {
    const posts = await postModel.getPostList(req.body)
    for (const post of posts) {
        const author = post.author
        post.author = {
            name: author.name,
            code: String(author.code)
        }
        post.content = md().render(post.content || '')
            .replace(/<\/?[^>]*>/g, '')
            .replace(/[|]*\n/, ' ')
            .replace(/&npsp;/gi, '').slice(0, 150)
        post.createdAt = dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')
        post.updatedAt = dayjs(post.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        delete post.authorId
        delete post.published
    }
    res.data(posts)
})

router.get('/details', (req, res, next) => {
    const result = Joi.object({
        postId: Joi.string().regex(uuidRegexp).message('博客ID格式错误...')
    }).validate(req.body).error
    if (result) {
        const err = new Error(result.message)
        err.status = 405
        next(err)
    }
    next()
}, async (req, res) => {
    const { postId } = req.body
    const post = await postModel.watchPost(postId)
    if (!post) res.err({ message: '当前文章不存在...' })
    res.data(post)
})

router.post('/add', async (req, res) => {
    const { code } = req.auth
    const user = await userModel.searchUser({ code })
    res.data(await postModel.createPost({
        authorId: user.id,
        cover: '测试头像',
        title: '测试标题',
        content: '内容',
        catalog: '目录'
    }))
})

router.post('/star', (req, res, next) => {
    const result = Joi.object({
        postId: Joi.string().regex(uuidRegexp).message('博客ID格式错误...')
    }).validate(req.body).error
    if (result) {
        const err = new Error(result.message)
        err.status = 405
        next(err)
    }
    next()
}, async (req, res) => {
    const { code } = req.auth
    const { postId } = req.body
    const star = await starModel.starPost(code, postId)
    if (star) {
        await starModel.deleteStarPost(star.id)
        return res.data({ isStar: false }, { message: '取消收藏成功...' })
    }
    const user = await userModel.searchUser({ code })
    await starModel.createStarPost(user.id, postId)
    res.data({ isStar: true }, { message: '收藏成功...' })
})

router.post('/like', (req, res, next) => {
    const result = Joi.object({
        postId: Joi.string().regex(uuidRegexp).message('博客ID格式错误...'),
        num: Joi.number().max(10).min(1).messages({
            'number.base': '点赞数格式错误',
            'number.min': '点赞数必须大于等于 {#limit}',
            'number.max': '点赞数必须小于等于 {#limit}'
        }).validate(req.body).error
    })
    if (result) {
        const err = new Error(result.message)
        err.status = 405
        next(err)
    }
    next()
}, async (req, res) => {
    const { code } = req.auth
    const { postId } = req.body
    const num = Math.min(MaximumLikesPerDay, Math.max(1, req.body?.num || 1))
    const like = await likeModel.getlikePost(code, postId)
    if (!like) {
        const user = await userModel.searchUser({ code })
        const likepost = await likeModel.createlikePost({
            userId: user.id,
            postId,
            num,
            todayNum: num
        })
        return res.data({ num: likepost.num, todayNum: likepost.todayNum })
    }
    /** 今天 */
    if (dayjs(like.updatedAt).isSame(dayjs(), 'day')) {
        if (like.todayNum === MaximumLikesPerDay) return res.err({ code: 205, message: '今日点赞已经满...', data: { num: like.num, todayNum: like.todayNum } })
        const addNum = Math.min(MaximumLikesPerDay - like.todayNum, num)
        const todayIsLike = await likeModel.likePost({
            likeId: like.id,
            num: like.num + addNum,
            todayNum: like.todayNum + addNum
        })
        return res.data({ num: todayIsLike.num, todayNum: todayIsLike.todayNum })
    }
    const notTodayIsLike = await likeModel.likePost({
        likeId: like.id,
        num: like.num + num,
        todayNum: num
    })
    return res.data({ num: notTodayIsLike.num, todayNum: notTodayIsLike.todayNum })
})

router.post('/label', (req, res, next) => {
    const result = Joi.object({
        value: Joi.string(),
        pageNum: Joi.number().min(0),
        pageSize: Joi.number().min(1)
    }).validate(req.body).error;
    if (result) {
        const err = new Error(result.message)
        err.status = 405
        next(err)
    }
    next()
}, async (req, res) => {
    if (req.body.value) {
        return res.data(await labelModel.searchLabels(req.body))
    }
    return res.data(await labelModel.getLabelList(req.body))
})

router.post('/label/add', (req, res, next) => {
    const result = Joi.array().items(
        Joi.object({
            name: Joi.string().required().messages({
                'any.required': 'name 是必填项'
            })
        }).required()
    ).required().messages({
        'array.includesRequiredUnknowns': '数组中的元素必须包含必填属性 Object'
    }).validate(req.body).error;
    if (result) {
        const err = new Error(result.message)
        err.status = 405
        next(err)
    }
    next()
}, async (req, res) => {
    res.data(await labelModel.addLabels(req.body))
})


module.exports = router