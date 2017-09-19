module.exports = `
  type Query {
    testString: String
    post(type: String!, id: String): [Post]
  }

  type Post {
    id: Int,
    slug: String,
    wp_postmeta: [PostMeta]
  }

  type PostMeta {
    metaKey: String,
    metaValue: String
  }

  schema {
    query: Query
  }
`
