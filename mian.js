const Express = require('express')
const cors = require('cors')
const { expressjwt } = require('express-jwt')
const http = require('node:http')
const https = require('node:https')
const { MV: { initMV, globalErrorMV } } = require('./modules/index.js')
const { jwt: { expressjwtOptions, expressjwtUnlessOptions }, port, certOptions } = require('./config/settings.js')
const router = require('./router')
const app = Express()

app.use(cors())
app.use(Express.json())
app.use(expressjwt(expressjwtOptions).unless(expressjwtUnlessOptions))
initMV.forEach(mv => app.use(mv))
router.use(app)

app.get('/', (req, res) => {
    res.data(req.auth)
})

/** 全局错误处理中间件 */
app.use(globalErrorMV)


http.createServer(app).listen(port.http)

https.createServer(certOptions, app).listen(port.https, () => {
    console.log('服务器启动成功!')
    console.log(`Local:\thttp://localhost:${port.http}`);
    console.log(`Local:\thttps://localhost:${port.https}`);
})