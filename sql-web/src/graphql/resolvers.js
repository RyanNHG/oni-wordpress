module.exports = ({
  getTypes,
  getPost,
  getPosts,
  getProfessional,
  getProfessionals,
  getJobTitle
}) => ({
  Query: {
    postTypes (_, args) {
      return getTypes()
    },
    posts (_, args) {
      return args.id ? [ getPost(args.type, args.id) ] : getPosts(args.type)
    },
    professionals (_, args) {
      return args.id ? [ getProfessional(args.id) ] : getProfessionals(args.type)
    }
  },
  Professional: {
    friend (professional) {
      return getProfessional(professional.friend)
    },
    jobTitle (professional) {
      return getJobTitle(professional.jobTitle)
    }
  }
})
