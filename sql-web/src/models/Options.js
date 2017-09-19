const Sequelize = require('sequelize')

module.exports = (sequelize) => sequelize.define('wp_options', {
  optionId: {
    field: 'option_id',
    type: Sequelize.BIGINT(20).UNSIGNED,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  optionName: {
    field: 'option_name',
    type: Sequelize.STRING(191),
    unique: true,
    defaultValue: '',
    allowNull: false
  },
  optionValue: {
    field: 'option_value',
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  autoload: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: 'yes',
  }
})
