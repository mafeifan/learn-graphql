const express = require('express');
const cors = require('cors')

//  GraphQL服务端
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const app = express();
// https://github.com/graphql/express-graphql
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  graphiql: true,
  pretty: true,
  // 显示更多的错误调试信息
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path
  })
}));

app.listen(12580);
console.log("please open http://localhost:12580/graphql")
