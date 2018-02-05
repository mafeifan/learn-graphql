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
const AuthorsList = require('./data/authors');
const {CommentList, ReplyList} = require('./data/comments');
const AddressList = require('./data/address');
const UsersList = require('./data/users');

const Post = new GraphQLObjectType({
  name: 'Post',
  description: '一个文章',
  fields:()=>({
    _id:{
      type: new GraphQLNonNull(GraphQLString)
    },
    title:{
      type: new GraphQLNonNull(GraphQLString)
    },
    category:{
      type: GraphQLString
    },
    layout:{
      type: GraphQLString
    },
    content:{
      type: GraphQLString
    },
  })
});

const AddressContent = new GraphQLObjectType({
  name: "AddressContent",
  description: "地址子信息",
  fields:()=>({
    Id:{
      type: GraphQLInt
    },
    Code:{
      type: GraphQLString
    },
    Name:{
      type: GraphQLString
    },
    FirstStr:{
      type: GraphQLString
    },
  })
});

// GraphQL 对象类型描述
const User = new GraphQLObjectType({
   // 不能是中文，只能数字字母
   name: "User",
   description: "查询用户",
   fields: () => ({
     _id: {
       type: new GraphQLNonNull(GraphQLInt)
     },
     name: {
       type: new GraphQLNonNull(GraphQLString)
     }
   })
});

const Address = new GraphQLObjectType({
  name: "Address",
  description: "地址信息",
  fields: ()=>({
    ShortKey:{
      type: GraphQLString
    },
    Content:{
      type: new GraphQLList(AddressContent),
      args: {
        limit:{type:GraphQLInt}
      },
      resolve: (source, {limit})=>{
        // console.log(source);
        if(limit){
          return _.first(source.Content,limit);
        }
        else{
          return source.Content;
        }
      }
    },
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
      resolve: function(source, {message}) {
        return `hello: ${message}`;
      }
    },
    posts:{
      type: new GraphQLList(Post),
      args: {
        index: {type:GraphQLInt}
      },
      resolve: (source,args)=>{
        return [PostsList[args.index]]
      }
    },
    postsnoargs:{
      type: new GraphQLList(Post),
      resolve:(source)=>{
        return PostsList
      }
    },
    address:{
      type:new GraphQLList(Address),
      args:{
        nameKey:{type:GraphQLString}
      },
      resolve:(source, {nameKey})=>{
        return [
            _.find(AddressList, item=>item.ShortKey === nameKey.toUpperCase())
        ]
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
      // TODO 打断点
      resolve: (source, {id}, requestObj) => {
        console.log(id)
        console.log(requestObj)
        return [
          UsersList.find(item => item.id === id)
        ]
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name:"Mutation",
  description:"增删改数据",
  fields:()=>({
    createAddress:{
      type:AddressContent,
      args:{
        Id:{
          type:new GraphQLNonNull(GraphQLInt)
        },
        Code:{
          type:new GraphQLNonNull(GraphQLString)
        },
        Name:{
          type:new GraphQLNonNull(GraphQLString)
        },
        FirstStr:{
          type:new GraphQLNonNull(GraphQLString)
        }
      },
      resolve:(source,args)=>{
        let address = Object.assign({},args);//获取数据
        
        //改为大写
        address.FirstStr = address.FirstStr.toUpperCase();

        let queryData = _.find(AddressList,item=>item.ShortKey===address.FirstStr);//查找的数据
        
        //检测是否存在FirstStr开头的
        if(queryData){
          // 有这个数据
          //存储数据
          queryData.Content.push(address);
          // console.log(address)
          return address;//返回新存储的数据
        }
        else{
          return null;
        }
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation:Mutation
});

module.exports = Schema;