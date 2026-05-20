const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Dashboard {
    totalSpent: Float!
    currency: String!
    remaining: Float!
  }

  type Expense {
    id: ID!
    amount: Float!
    currency: String!
  }

  input CreateExpenseInput {
    amount: Float!
    currency: String!
  }

  type Query {
    dashboard: Dashboard!
  }

  type Mutation {
    createExpense(input: CreateExpenseInput!): Expense!
  }
`;

const resolvers = {
    Query: {
        dashboard: () => ({
            totalSpent: 420,
            currency: "EUR",
            remaining: 580,
        }),
    },
    Mutation: {
        createExpense: (_, { input }) => ({
            id: String(Date.now()),
            amount: input.amount,
            currency: input.currency,
        }),
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 8080 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});