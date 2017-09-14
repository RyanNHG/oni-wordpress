const Sequelize = require('sequelize')

let Post

module.exports = (sequelize) => {
  if (Post !== undefined) {
    return Post
  }

  Post = sequelize.define('wp_posts', {
    id: {
      field: 'ID',
      type: Sequelize.BIGINT(20).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    postAuthor: {
      field: 'post_author',
      type: Sequelize.BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    postDate: {
      field: 'post_date',
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    postDateGmt: {
      field: 'post_date_gmt',
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    postContent: {
      field: 'post_content',
      type: Sequelize.TEXT('long'),
      allowNull: false
    },
    postTitle: {
      field: 'post_title',
      type: Sequelize.TEXT,
      allowNull: false
    },
    postStatus: {
      field: 'post_status',
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'publish'
    },
    commentStatus: {
      field: 'comment_status',
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'open'
    },
    pingStatus: {
      field: 'ping_status',
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'open'
    },
    postPassword: {
      field: 'post_password',
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    postName: {
      field: 'post_name',
      type: Sequelize.STRING(200),
      allowNull: false,
      defaultValue: ''
    },
    toPing: {
      field: 'to_ping',
      type: Sequelize.TEXT
    },
    pinged: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    postModified: {
      field: 'post_modified',
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    postModifiedGmt: {
      field: 'post_modified_gmt',
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    postContentFiltered: {
      field: 'post_content_filtered',
      type: Sequelize.TEXT('long'),
      allowNull: false
    },
    postParent: {
      field: 'post_parent',
      type: Sequelize.BIGINT(20).UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    guid: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    menuOrder: {
      field: 'menu_order',
      type: Sequelize.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    postType: {
      field: 'post_type',
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'post'
    },
    postMimeType: {
      field: 'post_mime_type',
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    commentCount: {
      field: 'comment_count',
      type: Sequelize.BIGINT(20),
      allowNull: false,
      defaultValue: 0
    }
  })

  return Post
}
