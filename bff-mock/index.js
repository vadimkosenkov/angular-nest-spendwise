const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const crypto = require('node:crypto');

const MONTHLY_BUDGET = 2000;
const MAX_EXPENSE_AMOUNT = 1_000_000;
const ALLOWED_CURRENCIES = ['USD', 'EUR', 'TRY'];
const ALLOWED_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:4200';

const expenses = [];

const typeDefs = `#graphql
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
    createExpense: (_, { input }) => {
      if (typeof input.amount !== 'number' || !Number.isFinite(input.amount)) {
        throw new Error('Amount must be a finite number');
      }
      if (input.amount <= 0) {
        throw new Error('Amount must be a positive number');
      }
      if (input.amount > MAX_EXPENSE_AMOUNT) {
        throw new Error(`Amount must not exceed ${MAX_EXPENSE_AMOUNT}`);
      }
      if (!ALLOWED_CURRENCIES.includes(input.currency)) {
        throw new Error(`Currency must be one of: ${ALLOWED_CURRENCIES.join(', ')}`);
      }

      const expense = {
        id: crypto.randomUUID(),
        amount: input.amount,
        currency: input.currency,
      };
      expenses.push(expense);
      return expense;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: false,
});

startStandaloneServer(server, {
  listen: { port: 8080 },
  context: async ({ req, res }) => {
    const origin = req.headers.origin;
    if (origin === ALLOWED_ORIGIN) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return {};
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
