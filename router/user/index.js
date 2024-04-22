const express = require('express')
const MD5 = require('md5')
const ms = require('ms')
const { getToken, redis, sendEmali } = require('../../modules')
const { jwt: { signOptions: { expiresIn } }, mali } = require('../../config/settings')
const { cerateValidcode } = require('../../utils/tools')
const { emailValidate } = require('../../utils/regexp')
const { userModel } = require('../../domain')


const router = express.Router()


function getUserToken(user) {
    const code = String(user.code)
    return getToken({ code, name: user.name, identity: user.identity })
}

function getUserRefreshToken(code) {
    return getToken({ code: String(code), refresh: true }, { expiresIn: ms(ms(expiresIn) * 2) })
}

router.get('/token', async (req, res) => {
    const { code, refresh } = req.auth
    if (refresh) {
        console.log(code);
        const user = await userModel.searchUser({ code })
        return res.data({ token: getUserToken(user), refreshToken: getUserRefreshToken(code) })
    }
    res.err({ code: 401, message: '登录超时，请重新登录...' })
})

router.patch('/email', async (req, res) => {
    const { email } = req.body
    const key = `emli-validcode-${email}`
    const ttl = await redis().ttl(key)
    /** 验证码获取过快 */
    if (ttl > 60) {
        return res.err({ message: `【剩余${ttl - 60}s】验证码获取过快,请稍后再试...` })
    }
    const code = cerateValidcode()
    await redis().set(key, code, 'EX', 60)
    const users = await userModel.getUserByInfo(email)
    const message = mali.message
    if (!users[0]?.code) return res.data(await sendEmali(message.register.title, email, message.register.content(code)))
    return res.data(await sendEmali(message.login.title, email, message.login.content(code)))
})

router.post('/login', async (req, res) => {
    const { user, pwd, emailValidCode } = req.body
    const users = await userModel.getUserByInfo(user)
    /** 邮箱验证码登录、注册 */
    if (emailValidate.test(user) && emailValidCode !== void 0) {
        const code = await redis().get(`emli-validcode-${user}`)
        if (!code || code !== emailValidCode) return res.err({ message: '输入的验证码错误...' })
        let token = ''
        let refreshToken = ''
        /** 注册 */
        if (!users?.length) {
            const createUser = await userModel.createUser({ email: user, password: MD5(pwd || new Date().getTime()) })
            token = getUserToken(createUser)
            refreshToken = getUserRefreshToken(createUser.code)
        } else {
            /** 登录 */
            token = getUserToken(users[0])
            refreshToken = getUserRefreshToken(users[0])
        }
        return res.data({ token, refreshToken })
    }
    /** 密码登录 */
    if (pwd) {
        const userInfo = users.find(v => v.password == MD5(pwd))
        if (!userInfo) return res.err({ message: '输入用户名或者密码错误...' })
        return res.data({ token: getUserToken(userInfo), refreshToken: getUserRefreshToken(userInfo.code) })
    }
    res.err({ message: '输入用户名或者密码错误...' })
})

/** 获取用户信息 */
router.get('/', async (req, res) => {
    const code = req.body?.code || req.auth?.code
    const { email, phone, name, avatar, identity, WeChat, QQ } = await userModel.searchUser({ code })
    res.data({
        code,
        email,
        phone,
        name,
        avatar,
        identity,
        WeChat,
        QQ
    })

})

module.exports = router