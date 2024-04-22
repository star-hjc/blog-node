module.exports = {
    /** mysql连接配置 */
    mysql: [
        {
            /** ip地址 */
            host: 'starserve.xyz',
            /** 端口 */
            port: '13306',
            /** 用户名 */
            user: 'blog',
            /** 密码 */
            password: 'dCNdF4eAJhir8Qdd',
            /** 数据库名 */
            database: 'my-blog',
            /** 字符集 */
            charset: 'UTF8MB4_BIN'
        }
    ],
    redis: [
        {
            /** ip地址 */
            host: 'starserve.xyz',
            /** 端口 */
            port: 16379,
            /** 密码 */
            password: 'jhkdjhkjdhsIUTYURTU_N752Sh'
        }
    ],
    mali: {
        /** 邮箱 */
        service: '163',
        /** 安全的发送模式 */
        secure: true,
        /** 账号密码 */
        auth: {
            user: 'hjc59476905@163.com',
            pass: 'KLZDISEHMHKQDYEL'
        },
        message: {
            login: {
                title: '【博客验证】',
                content: (code) => `【博客】验证码：${code}（10分钟内有效）。您正在登录博客，请勿将验证码告诉他人哦。`
            },
            register: {
                title: '【博客验证】',
                content: (code) => `【博客】验证码：${code}（10分钟内有效）。您正在注册博客，请勿将验证码告诉他人哦。`
            },
            updatePassword: {
                title: '【博客验证】',
                content: (code) => `【博客】验证码：${code}（10分钟内有效）。您正在修改密码，请勿将验证码告诉他人哦。`
            }
        }
    },
    expressjwtOptions: {
        /** Token密钥 */
        secret: 'Star@2024ShenZhen',
        algorithms: ['HS256']
    },
    expressjwtUnlessOptions: {
        /** 不验证的路由 */
        path: ['/', '/api/blog', '/api/user/login', '/api/user/email', '/api/post/list']
    },
    port: {
        http: 8888,
        https: 9999
    },
    jwt: {
        /** token有效时长 */
        signOptions: {
            expiresIn: '1h'
        },
    },
    router: {
        prefix: '/api'
    },
    certOptions: {},
    user: {
        /** 默认的password */
        password: '123456789'
    }
}