module.exports = ({ getPost, getPosts }) => ({
  Query: {
    testString (_, args) {
      return 'It works!'
    },
    post (_, args) {
      return args.id
        ? [ getPost(args.type, args.id) ]
        : getPosts(args.type)
    }
  }
})
