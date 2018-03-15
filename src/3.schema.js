const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const PostList = require('./data/posts');

// 使用 GraphQL Schema Language 创建一个 schema
const schema = buildSchema(`
  # 一篇文章
  type Post {
    id: Int,
    title: String!,
    category: String,
    content: String,
  }
  
  type Query {
    hello(message: String!): String,
    # 获取文章
    getPost(id: Int): [Post],
  }
`);

// root 提供所有 API 入口端点相应的解析器函数
const root = {
  hello: ({message}) => {
    return `Hello ${message}!`;
  },
  getPost: ({id}) => {
    return id ? [PostList.find(item => item.id === id)] : PostList;
  }
};

const app = express();

app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  pretty: true,
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path
  }),
})).listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

/*
1. 查询多条

{
  post1: getPost(id: 1) {
    id
    title
  },
  post2: getPost(id: 2) {
    id
    title
  }
}

2. fragment

fragment PostFields on Post {
  id, title
}

{
  post1: getPost(id: 1) {
    ...PostFields
  },
  post2: getPost(id: 2) {
    ...PostFields
  }
}

3. 参数
# 默认变量，覆盖参数变量

fragment PostFields on Post {
  id, title
}

query($id:Int){
  post1: getPost(id: 1) {
    ...PostFields
  },
  post2: getPost(id: $id) {
    ...PostFields
  }
}

{"id": 2}

4. 指令
内置两个核心指令，@skip 和 @include

query($noContent: Boolean = true){
  posts1: getPost(id: 1) {
    title
    content @skip(if: $noContent)
    id
  }
}
===========================
fragment postFields on Post {
  id, title, category
}


query($noContent: Boolean = true){
  posts1: getPost(id: 1) {
    ...postFields @skip(if: $noContent)
  }
}

{
  "noContent": false
}
*/
