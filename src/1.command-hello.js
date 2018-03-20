// http://graphql.cn/graphql-js/

const { graphql, buildSchema } = require('graphql');

// 使用 GraphQL schema language 构建一个 schema
// 描述数据的结构
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);



const root = { hello: () => 'Hello world!' };

graphql(
  schema,
  '{ hello }',
  root // root 提供所有 API 入口端点相应的解析器函数
).then((response) => {
  console.log(response);
});
