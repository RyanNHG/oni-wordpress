const requireDirectory = require('require-directory')

const toObjectMap = ({ modelFunctions, sequelize }) =>
  Object.keys(modelFunctions).reduce((obj, key) => {
    obj[key] = modelFunctions[key](sequelize)
    return obj
  }, {})

module.exports = (sequelize) => {
  const modelFunctions = requireDirectory(module)
  const models = toObjectMap({ modelFunctions, sequelize })

  const { Post, PostMeta } = models

  Post.hasMany(PostMeta, { foreignKey: 'post_id', sourceKey: 'id' })
  PostMeta.belongsTo(Post, { foreignKey: 'post_id', targetKey: 'id' })

  return models
}
