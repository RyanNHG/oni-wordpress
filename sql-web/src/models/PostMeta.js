const Sequelize = require('sequelize')
let PostMeta

module.exports = (sequelize) => {
  if (PostMeta !== undefined) {
    return PostMeta
  }

  PostMeta = sequelize.define('wp_postmeta', {
    metaId: {
      field: 'meta_id',
      type: Sequelize.BIGINT(20).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    metaKey: {
      field: 'meta_key',
      type: Sequelize.STRING
    },
    metaValue: {
      field: 'meta_value',
      type: Sequelize.TEXT('long')
    }
  })

  const Post = require('./Post')(sequelize)

  PostMeta.hasOne(Post, { foreign_key: 'post_id' })

  return PostMeta
}
