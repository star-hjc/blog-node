const getNetworkMW = (req, res, next) => {
    const ip = req.ip.split(':').at(-1)
    req.network = {
        ip: ip.trim() === '1' ? req.hostname : ip,
        hostname: req.hostname
    }
    next()
}

const getParamsMW = (req, res, next) => {
    req.data = { params: req.params, query: req.query, body: req.body, auth: req.auth }
    next()
}

const errorMV = (req, res, next) => {
    res.err = (options = {}) => {
        res.status(200).json({
            code: 500,
            message: '服务端发生一个未知的错误...',
            path: req.originalUrl || '未知的路径...',
            ...options,
            data: null
        })
    }
    next()
}

const successMV = (req, res, next) => {
    res.data = (data, options = {}) => {
        res.status(200).json({
            code: 200,
            message: '成功！',
            ...options,
            data
        })
    }
    next()
}

/** 全局错误处理中间件 */
const globalErrorMV = (err, req, res, next) => {
    if (err) {
        if (err.name === 'UnauthorizedError') {
            res.status(err.status).json({
                code: err.status,
                message: '无效的token...',
                path: req.originalUrl || '未知的路径...',
                data: null
            })
            return
        }
        res.status(err?.status || 500).json({
            code: 0,
            message: `[${err.name}] ${err.message}`,
            path: req.originalUrl || '未知的路径...',
            data: null
        })
        return
    }
    next()
}


module.exports = { globalErrorMV, initMV: [getNetworkMW, getParamsMW, errorMV, successMV] }
