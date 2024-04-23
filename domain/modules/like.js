const { blogDB } = require('./')



const getlikePost = async (code, postId) => {
    return await blogDB.like.findFirst({
        where: {
            AND: [
                { postId },
                { user: { code } }
            ]
        }
    })
}

/**
 * 根据用户ID和博客ID点赞博客
 * @param { { userId:String, postId: String, previousNum?: Number, currentNum?:Number } } options 
 * @param  options.userId       用户ID
 * @param  options.postId       博客ID
 * @param  options.num          总点赞数量
 * @param  options.todayNum     今天点赞数量
 * @returns 
 */
const createlikePost = async (options = {}) => {
    const { userId, postId, num, todayNum } = options
    return await blogDB.like.create({
        data: {
            userId,
            postId,
            num,
            todayNum
        }
    })
}

const likePost = async (options = {}) => {
    const { likeId, num, todayNum } = options
    return await blogDB.like.update({
        where: {
            id: likeId
        },
        data: { num, todayNum }
    })
}


module.exports = { getlikePost, createlikePost, likePost }