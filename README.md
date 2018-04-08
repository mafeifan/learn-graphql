# learn-graphql

> 本教材一开始fork自 [zhouyuexie/learn-graphql](https://github.com/zhouyuexie/learn-graphql)，后来根据自己的理解。加入了很多自己的代码。
所有的例子都在src目录中。
目前官方只提供了Node版本的GraphQL实现。所有例子都是基于这个类库实现。
简单一些总结。不足之处还望批评指正。

## 具体实例文件介绍
* 1.command-hello.js
最简单的hello world例子，运行后在命令行中看到"hello world"。

* 2.express-graphql.js
使用express-graphql启动一个GraphQL HTTP 服务器，运行后浏览器打开`http://localhost:4000/graphql`，会看到官方提供的graphiql，一个基于浏览器端的编写GraphQL及查看结果的工具。
graphiql主要分为四部分, 如图：

![image.png](https://upload-images.jianshu.io/upload_images/71414-9649c0eb1d547fd6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* 3.schema.js
使用GraphQL Schema Language 编写schema
你可以复制在该文件下面的注释内容，然后在浏览器运行，如图
![image.png](https://upload-images.jianshu.io/upload_images/71414-73c87b5c31ab0ea1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在这里你可以学到frament，参数，指令等功能的使用。

* 4.constructing-types.js
使用 GraphQLSchema 构造函数创建schema
跟 3.schema.js 功能效果一样。

* 5.mutation.js
使用mutation类型更新删除记录。注意这个例子为了真实，不像前面的假数据，数据是存在mongoDB中。你本地需要运行mongoDB。

* 6.reference.js
运行此文件，模拟关联查询
```
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
```

* 7.advance.js
高级部分，简单介绍了如何自定义类型及自定义类型如何传参

* 8.page.md
介绍如何使用GraphQL进行分页，分页本质是定义一个Edges 类型，它包含 node 和 cursor 字段。其中 Node 用来保存查询列表内容， Cursor 用来记录分页信息。

## 开始

1. 克隆库:

```shell
git clone https://github.com/mafeifan/learn-graphql
```

2. 安装依赖:

```shell
npm install
```

3. 运行各个例子:

```shell
node src/1.command-hello.js
...
node src/2.express-graphql.js
```


## 资源

* https://medium.com/@bensigo/building-a-graphql-app-form-zero-to-hero-using-node-js-and-vue-js-part-1-99be42690b08
* https://www.learnapollo.com
* https://segmentfault.com/a/1190000008828678