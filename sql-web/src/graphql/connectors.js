const Sequelize = require('sequelize')

module.exports = ({ Post, PostMeta }) => {
  const debug = (thing) => {
    console.log(thing)
    return thing
  }

  // Transform helpers
  const metaListToObject = (list) =>
    list.reduce((obj, { metaKey, metaValue }) => {
      obj[metaKey] = metaValue
      return obj
    }, {})

  const undottify = (obj) => Object.keys(obj).reduce((_obj, key) => {
    const value = obj[key]
    const pieces = key.split('.')
    const firstPart = pieces.slice(0, 1).join('.')
    const secondPart = pieces.slice(1, 2).join('.')
    if (secondPart === '') {
      _obj[firstPart] = value
      return _obj
    } else {
      const theRest = pieces.slice(1).join('.')
      const innerObj = {}
      innerObj[theRest] = value
      _obj[firstPart] = _obj[firstPart] || {}
      _obj[firstPart][secondPart] = (theRest.indexOf('.') === -1)
        ? value
        : undottify(innerObj)[secondPart]
      return _obj
    }
  }, {})

  const transformPost = (post) => undottify(
    metaListToObject([
      { metaKey: 'id', metaValue: post.id },
      { metaKey: 'slug', metaValue: post.postName },
      { metaKey: 'title', metaValue: post.postTitle },
      ...(post['wp_postmeta'] ? post['wp_postmeta'] : [])
    ])
  )

  const transformPosts = posts =>
    posts.map(transformPost)

  const ignoreTheseFields =
    { exclude: [ 'createdAt', 'updatedAt', 'wpPostmetumMetaId', 'guid' ] }

  const postMetaInclude = [{
    model: PostMeta,
    where: { 'ID': Sequelize.col('post_id'), 'metaKey': { $notLike: `\\_%` } },
    attributes: ignoreTheseFields
  }]

  const combineObject = (obj1, obj2) =>
    Object.keys(obj2).reduce((obj, key) => {
      obj[key] = obj2[key]
      return obj
    }, obj1)

  const customInclude = (obj) => [{
    model: PostMeta,
    where: combineObject({
      'ID': Sequelize.col('post_id'),
      'metaKey': { $notLike: `\\_%` }
    }, obj),
    attributes: ignoreTheseFields
  }]

  // Generic queries
  const getTypes = () =>
    Post.aggregate('post_type', 'DISTINCT', { plain: false })
      .then(types => types.map(obj => obj.DISTINCT))

  const getPosts = (postType, fetchMeta) =>
    Post.findAll({
      where: { 'post_type': (postType) },
      attributes: ignoreTheseFields,
      include: fetchMeta ? postMetaInclude : []
    })

  const getPost = (postType, postId, fetchMeta) =>
    Post.findOne({
      where: { 'post_type': (postType), 'id': postId },
      attributes: ignoreTheseFields,
      include: fetchMeta ? postMetaInclude : []
    })

  const sqlValue = (value) =>
    (typeof value === 'string') ? `'${value}'`
    : (typeof value === 'number') ? value
    : (typeof value === 'boolean') ? (value ? '1' : '0')
    : value

  const selectDistinct = (key, value) => [
    '(SELECT DISTINCT post_id FROM',
    PostMeta.getTableName(),
    'WHERE',
    `meta_key = '${key}' AND meta_value = ${sqlValue(value)})`
  ].join(' ')

  const getDistinctQueries = (where) =>
    Object.keys(where)
      .map(key => ({
        $in: Sequelize.literal(selectDistinct(key, where[key]))
      }))

  const getPostsWhere = (postType, where) =>
    Post.findAll({
      where: { 'post_type': postType },
      attributes: ignoreTheseFields,
      include: customInclude({ 'post_id': { $and: getDistinctQueries(where) } })
    })

  // Custom queries
  const getProfessionals = () =>
    getPosts('professional', true)
      .then(transformPosts)

  const getProfessional = (id) =>
    getPost('professional', id, true)
      .then(transformPost)

  const getJobTitle = (id) =>
    getPost('job_title', id, false)
      .then(transformPost)

  const getFruits = () =>
    getPosts('fruit', true)
      .then(transformPosts)

  const getFruit = (id) =>
    getPost('fruit', id, true)
      .then(transformPost)

  const getFruitsWithFavoriteColor = (favoriteColor) =>
    getPostsWhere('fruit', { favoriteColor })
      .then(transformPosts)

  const getFruitsWithFirstName = (firstName) =>
    getPostsWhere('fruit', { 'name.first': firstName })
      .then(transformPosts)

  const getFruitsWithFirstNameAndColor = (favoriteColor, firstName) =>
    getPostsWhere('fruit', { favoriteColor, 'name.first': firstName })
      .then(transformPosts)

  return {
    getTypes,
    getPosts,
    getPost,
    getProfessional,
    getProfessionals,
    getJobTitle,
    getFruit,
    getFruits,
    getFruitsWithFavoriteColor,
    getFruitsWithFirstName,
    getFruitsWithFirstNameAndColor
  }
}
