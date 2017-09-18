const Sequelize = require('sequelize')

module.exports = (sequelize) => sequelize.define('wp_postmeta', {
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
