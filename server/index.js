const express = require('express');
//  GraphQL服务端
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const bodyParser = require('body-parser');
const cors = require('cors');
// support parse application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
let startTime = Date.now();
// 具体选项含义见文档
// https://github.com/graphql/express-graphql
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  graphiql: false,
  pretty: true,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path
  }),
  extensions({ document, variables, operationName, result }) {
    return { runTime: Date.now() - startTime };
  }
}));

app.listen(12580);
console.log("please open http://localhost:12580/graphql")
// 请打开 http://localhost:12580/graphql