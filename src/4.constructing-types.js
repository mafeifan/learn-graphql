const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull
} = require('graphql');

const PostsList = require('./data/posts');

// 不使用 GraphQL Schema Language，使用 GraphQLSchema 构造函数创建schema

const Post = new GraphQLObjectType({
  name: 'Post',
  description: '文章',
  fields:()=>({
    id:{
      type: new GraphQLNonNull(GraphQLString),
      description: '一篇文章的的ID'
    },
    title:{
      type: new GraphQLNonNull(GraphQLString),
      description: '文章的标题'
    },
    category:{
      type: GraphQLString
    },
    content:{
      type: GraphQLString
    },
  })
});

const Query = new GraphQLObjectType({
  name: 'BlogSchema',
  description: 'Root of the Blog Schema',
  fields: () => ({
    hello: {
      type: GraphQLString,
      description: '回应你输入的内容',
      args: {
        message: {
          type: GraphQLString,
          description: '输入的回应内容',
        }
      },
      resolve: function(source, {message}) {
        return `hello: ${message}`;
      }
    },
    getPost:{
      type: new GraphQLList(Post),
      description: '默认获取所有文章，可传入参数id获取单个文章',
      args: {
        id: {
          type: GraphQLInt,
          description: '文章id',
        }
      },
      resolve: (source, args)=>{
        return args.id ? [PostsList.find(item => item.id === args.id)] : PostsList;
      }
    },
  })
});


const app = express();
app.use('/graphql', graphqlHTTP({
  schema: new GraphQLSchema({query: Query}),
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
