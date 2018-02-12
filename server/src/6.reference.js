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

const PostsList = require('../data/posts');
const UsersList = require('../data/users');
// 不使用 GraphQL Schema Language，使用 GraphQLSchema 构造函数创建schema

const Post = new GraphQLObjectType({
  name: 'Post',
  description: '文章',
  fields:()=>({
    id:{
      type: new GraphQLNonNull(GraphQLInt),
      description: '一篇文章的的主键ID'
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

/**
 * 关联查询
 *
 {
  users(id: 1) {
    id,
    name,
    post {
      id,
      title
    }
  }
}
 */

const User = new GraphQLObjectType({
  name: 'User',
  description: '查询用户',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: '用户名',
    },
    post: {
      type: new GraphQLList(Post),
      description: '用户的文章',
      // args: {
      //   id: {type: GraphQLInt}
      // },
      resolve: (source, args)=>{
        return source.id ? PostsList.filter(item => item.uid === source.id) : null;
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'BlogSchema',
  description: 'Root of the Blog Schema',
  fields: () => ({
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
    users: {
      // 定义返回类型
      type: new GraphQLList(User),
      // 定义参数列表及类型
      args: {
        id: {type: GraphQLInt}
      },
      // 根据参数的返回逻辑
      resolve: (source, {id}, requestObj) => {
        console.log(source)
        return [
          UsersList.find(item => item.id === id)
        ]
      }
    }
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
