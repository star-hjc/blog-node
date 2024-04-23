const { user } = require('../../config/settings')
const { blogDB } = require('./')

/**
 * 根据用户ID和博客ID收藏博客
 * @param {String} userId 用户ID
 * @param {String} postId 博客ID
 * @returns 
 */
const createStarPost = async (userId, postId) => {
    return await blogDB.star.create({
        data: {
            userId,
            postId
        }
    })
}

/**
 * 删除收藏记录
 * @param {String} starId 
 * @returns 
 */
const deleteStarPost = async (starId) => {
    return await blogDB.star.delete({
        where: { id: starId }
    })
}

/**
 * 根据用户ID和博客ID查询是否存在收藏
 * @param {String} code 用户Code
 * @param {String} postId 博客ID
 * @returns 
 */
const starPost = async (code, postId) => {
    return await blogDB.star.findFirst({
        where: {
            AND: [
                { postId },
                { user: { code } }
            ]
        }
    })
}


module.exports = { starPost, createStarPost, deleteStarPost }