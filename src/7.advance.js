const express = require('express');
const graphqlHTTP = require('express-graphql');
const { Kind } = require('graphql/language');
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLNonNull
} = require('graphql');

const UsersList = require('./data/usersWithDate');

const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  // value from the client, for input
  parseValue(value) {
    return new Date(value);
  },
  // value sent to the client, for response
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
});


// 自定义类型如何传参
// https://segmentfault.com/a/1190000012600641#articleHeader7

const User = new GraphQLObjectType({
  name: 'User',
  description: '查询用户',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    // 虚字段
    firstName: {
      type: GraphQLString,
      resolve(obj) {
        return obj.name.split(' ')[0]
      }
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: '用户名',
    },
    create_at: {
      type: DateType,
      description: '创建日期',
      // resolve: (source, args)=>{
      //   return '11';
      // }
    },
  })
});

const Query = new GraphQLObjectType({
  name: 'BlogSchema',
  description: 'Root of the Blog Schema',
  fields: () => ({
    users: {
      // 定义返回类型
      type: new GraphQLList(User),
      // 定义参数列表及类型
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (source, {id}, requestObj) => {
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
