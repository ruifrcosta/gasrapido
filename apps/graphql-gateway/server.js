const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');

async function startGateway() {
  // Create the gateway
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: 'web', url: 'http://web:3000/graphql' },
        { name: 'mobile', url: 'http://mobile:19006/graphql' },
        // Add more subgraphs as needed
      ],
    }),
  });

  // Create the server
  const server = new ApolloServer({
    gateway,
    // Disable subscriptions (not supported in Apollo Federation v2)
    subscriptions: false,
  });

  // Start the server
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
    listen: { port: 4000 },
  });

  console.log(`🚀 GraphQL Gateway ready at ${url}`);
}

startGateway().catch(console.error);