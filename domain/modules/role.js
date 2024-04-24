const { blogDB } = require('./')


const createRole = async (name) => {
    const role = await blogDB.role.findUnique({ where: { name } })
    if (role) return role
    return await blogDB.role.create({
        data: { name }
    })
}


module.exports = { createRole }