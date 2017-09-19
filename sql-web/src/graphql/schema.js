module.exports = `

  type Query {
    postTypes: [String]
    posts(type: String!, id: Int, fetchMeta: Boolean): [Post!]
    professionals(id: Int): [Professional!]
  }

  type Post {
    id: Int!
    postName: String
    wp_postmeta: [PostMeta!]
  }

  type PostMeta {
    metaKey: String
    metaValue: String
  }

  interface Item {
    id: Int!
    slug: String!
    title: String!
  }

  type Professional implements Item {
    id: Int!
    slug: String!
    title: String!
    name: Name!
    biography: Biography!
    friend: Professional
    jobTitle: JobTitle!
  }

  type Name {
    first: String!
    middle: String
    last: String!
  }

  type Biography {
    main: String!
    showAdditional: Boolean!
    additional: String
  }

  type JobTitle implements Item {
    id: Int!
    slug: String!
    title: String!
  }

  schema {
    query: Query
  }
`
