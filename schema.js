import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import Db from './db';

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Blog post',
  fields: () => {
    return {
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      person: {
        type: Person,
        resolve: post => {
          return post.getPerson();
        }
      }
    };
  }
});

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'This represents a Person',
  fields: () => {
    return {
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        posts: {
          type: new GraphQLList(Post),
          resolve: person => {
            return person.getPosts();
          }
        }
      };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: {
      people: {
        type: new GraphQLList(Person),
        args: {
            id: { type: GraphQLInt },
            email: { type: GraphQLString }
          },
        resolve: (root, args) => {
          return Db.models.person.findAll({ where: args });
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve: (root, args) => {
          return Db.models.post.findAll({ where: args });
        }
      }
    }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields: {
      addPerson: {
        type: Person,
        args: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (source, args) => {
          return Db.models.person.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase()
          });
        }
      }
    }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
