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

const _ = require('underscore');
const PostsList = require('./data/posts');
const UsersList = require('./data/users');

// GraphQL 对象类型描述
const Post = new GraphQLObjectType({
  name: 'Post',
  description: '一篇文章',
  fields:()=>({
    id:{
      type: new GraphQLNonNull(GraphQLString),
    },
    title:{
      type: new GraphQLNonNull(GraphQLString)
    },
    category:{
      type: GraphQLString
    },
    content:{
      type: GraphQLString
    },
  })
});

const User = new GraphQLObjectType({
   name: 'User',
   description: '查询用户',
   fields: () => ({
     id: {
       type: new GraphQLNonNull(GraphQLInt)
     },
     name: {
       type: GraphQLString
     }
   })
});

const Query = new GraphQLObjectType({
  name: 'BlogSchema',
  description: 'Root of the Blog Schema',
  fields: () => ({
    echo: {
      type: GraphQLString,
      description: '回应你输入的内容',
      args: {
        message: {type: GraphQLString}
      },
      // The resolve function can return a value, a promise, or an array of promises.
      resolve: function(source, {message}) {
        return `hello: ${message}`;
      }
    },
    posts:{
      // 定义返回类型
      // List类型表示此字段返回Post类型的数组集合
      type: new GraphQLList(Post),
      // 定义参数列表及类型
      args: {
        index: { type: GraphQLInt }
      },
      resolve: (source,args)=>{
        if (args && args.index) {
          return [PostsList[args.index]]
        }else {
          return PostsList
        }
      }
    },
    users: {
      // 定义返回类型
      type: new GraphQLList(User),
      // 定义参数列表及类型
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (source, {id}, requestObj) => [
        UsersList.find(item => item.id === id)
      ]
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query,
});

module.exports = Schema;
