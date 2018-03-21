const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { connect } = require('./helper');
const MessageModel = require('./models/Message');

connect()
  .on('error', () => console.error('connection error:'))
  .on('disconnected', () => console.log('MongoDB disconnected'))
  .once('open', listen);

// 使用 GraphQL schema language 构建 schema
// http://graphql.cn/learn/schema/#input-types
// Input 类型传递整个对象作为新建对象, 在变更（mutation）中特别有用
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);


const root = {
  getMessage: async ({id}) => {
    return await MessageModel.findById(id);
  },
  createMessage: async ({input}) => {
    const model = new MessageModel(input);
    return await model.save();
  },
  updateMessage: async ({id, input}) => {
    return await MessageModel.findByIdAndUpdate(id, input);
  },
};


function listen() {
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }));

  app.listen(4000);
  console.log('Running a GraphQL API server at localhost:4000/graphql');
}




/*
mutation {
  createMessage(input: {
    author: "andy",
    content: "hope is a good thing",
  }) {
    id
  }
}

mutation {
  updateMessage(
    id: "5ab12a9a4d836e040c9d57a0",
    input: {content: "bar", author: "jack"}) {
     id
    }
}

{
  getMessage(id: "51511cd274f244a9ca25") {
    id
    content
    author
  }
}

* */
