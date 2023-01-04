# Graphql-Challenge

## Starting the project
Start the project with the next command

````
npm run ci && npm run mock-data && npm run start
````

or just run `npm run start`

## Start Querying

Get Posts with pagination.
Parameters: 
- limit
- offset

TODO: implement cursor based pagination since is better if there are object shifting

````
query {
  posts(limit:2, offset: 3) { 
   title
    body
    comments {
      name
      email
      body
    }
  }
}

````

## Create New Posts

````
createPost(input: {title: "title 1", body: "body 1"}) {
  _id
  title
  body
  comments {
    name
    email
    body
  }
}
````

## Create New Comments

Save the ID from the post creation or search in a mongoDB client for a valid ID

````
mutation {
  createComment(input: {name: "comment 1", email: "", body: "body1", postId: "VALID-OBJECT-ID"}) {
    name
    email
    body
    post {
      title
      body
      comments {
        name
        email
        body
      }
    }
  }
}
````

## Possible Improvements

1. Move Schemas & Resolvers to it own directories to improve order and readability
2. Create error codes for Resolver errors. eg. missing data in request, post not found, etc
3. Maybe use a more robust graphQL library such as `ApolloServer` instead of `graphqlHTTP`