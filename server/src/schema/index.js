const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

// Define your types here.
const typeDefs = `
  type Link {
    id: ID!
    url: String!
    description: String!
    postedBy: User
    votes: [Vote!]!
  }

  type Mutation {
    createLink(url: String!, description: String!): Link
    createVote(linkId: ID!): Vote
    createUser(name: String!, authProvider: AuthProviderSignupData!): SigninPayload
    signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
  }

  type SigninPayload {
    token: String
    user: User
  }

  type Query {
    allLinks(filter: LinkFilter, skip: Int, first: Int): [Link!]!
  }

  type User {
    id: ID!
    name: String!
    email: String
    password: String
    votes: [Vote!]!
  }

  type Vote {
    id: ID!
    user: User!
    link: Link!
  }

  input LinkFilter {
    OR: [LinkFilter!]
    description_contains: String
    url_contains: String
  }

  input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }

  type Subscription {
    Link(filter: LinkSubscriptionFilter): LinkSubscriptionPayload
    Vote(filter: VoteSubscriptionFilter): VoteSubscriptionPayload 
  }

  input LinkSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type LinkSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Link
  }

  input VoteSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type VoteSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Vote
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }
`;

// Generate the schema object from your types definition.
module.exports = makeExecutableSchema({typeDefs});
module.exports = makeExecutableSchema({typeDefs, resolvers});
