const { blogDB } = require('./index')
const { objectSplit } = require('../../utils/object')

const addPost = async (data) => {
    return await blogDB.post.create({
        data
    })
}

/**
 * 获取博客
 * @param {String} id 博客ID
 * @returns 
 */
const getPostByPostId = async (id) => {
    return await prisma.post.findUnique({
        where: { id }
    })
}

const createPost = async (options = {}) => {
    const { authorId, cover, title, content, catalog } = options
    return await blogDB.post.create({
        data: { authorId, cover, title, content, catalog }
    })
}



/**
 * 查看博客
 * @param {String} id 博客ID
 * @returns { Promise<{ id: String, authorId: String, cover: String, title: String, content: String | null, catalog: Prisma.JsonValue, published: Boolean, watch: Number, createdAt: Date, updatedAt: Date}> | {} }
 */
const watchPost = async (id) => {
    if (!id) return {};
    try {
        return await blogDB.$transaction(async (prisma) => {
            const post = await getPostByPostId(id)
            if (!post) throw new Error(`根据博客ID:${id},无法找到内容...`)

            /** 自增观看数量 */
            return await prisma.post.update({
                where: { id },
                data: {
                    watch: post.watch + 1
                }
            })
        })
    } catch (error) {
        console.error('[Error:watchPost]', error);
        return null
    }
}

/**
 * 
 * @param { { value:string, pageNum: Number, pageSize: Number } } options 参数
 * @param options.value      搜索关键字(title:标题,label:标签,content:内容)
 * @param options.pageNum    页码
 * @param options.pageSize   每页多少条
 * @returns
 */
const searchPosts = async (options = {}) => {
    const { value } = options
    const where = {
        OR: [
            {
                postlabel: {
                    some: {
                        labels: {
                            name: {
                                contains: value || ''
                            }
                        }
                    }

                }
            },
            {
                title: {
                    contains: value || ''
                }
            },
            {
                content: {
                    contains: value || ''
                }
            }
        ]
    }
   return await getPostList(options, { where: value ? where : void 0 })
}

/**
 * 
 * @param { { pageNum: Number, pageSize: Number } } options 参数
 * @param options.value      搜索关键字(title:标题,label:标签,content:内容)
 * @param options.pageNum    页码
 * @param { Object } findManyOptions 表查询参数
 * @returns 
 */
const getPostList = async (options = {}, findManyOptions) => {
    const pageNum = options.pageNum || 1
    const pageSize = options.pageSize || 10
    return await blogDB.post.findMany({
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
        include: {
            postlabel: {
                include: {
                    labels: {
                        include: true
                    }
                }
            }
        },
        ...findManyOptions
    })
}

module.exports = { getPostList, searchPosts, watchPost, addPost, createPost }

