module.exports = `

  type Query {
    postTypes: [String]
    posts(type: String!, id: Int, fetchMeta: Boolean): [Post!]
    professionals(id: Int): [Professional!]
    fruits(id: Int, favoriteColor: String, firstName: String): [Fruit!]
  }

  type Post {
    id: Int!
    postName: String!
    wp_postmeta: [PostMeta]
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

  type Fruit implements Item {
    id: Int!
    slug: String!
    title: String!
    favoriteColor: String
    name: Name
  }

  type Professional implements Item {
    id: Int!
    slug: String!
    title: String!
    name: Name!
    biography: Biography!
    friend: Professional
    jobTitle: JobTitle!
    favoriteColor: String
  }

  type Name {
    first: String
    middle: String
    last: String
    full: String
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
