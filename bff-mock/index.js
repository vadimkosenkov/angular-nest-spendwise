const {ApolloServer, gql} = require('apollo-server');

const MONTHLY_BUDGET = 2000;
const expenses = [];

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

// TODO: support multi-currency aggregation
const resolvers = {
  Query: {
    dashboard: () => {
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        totalSpent,
        currency: "USD",
        remaining: MONTHLY_BUDGET - totalSpent,
      };
    },
  },
  Mutation: {
    createExpense: (_, {input}) => {
      const expense = {
        id: String(Date.now()),
        amount: input.amount,
        currency: input.currency,
      };
      expenses.push(expense);
      return expense;
    },
  },
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen({port: 8080}).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});