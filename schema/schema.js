const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLID } = graphql;

const books = [
    { id: "1", name: 'book 1', genre: 'gener 1', authorId: '1' },
    { id: "2", name: 'book 2', genre: 'gener 2', authorId: '2' },
    { id: "3", name: 'book 3', genre: 'gener 3', authorId: '3' },
    { id: "4", name: 'book 4', genre: 'gener 2', authorId: '2' },
    { id: "5", name: 'book 5', genre: 'gener 2', authorId: '2' },
]

const authors = [
    { id: '1', name: 'Ashok', age: '31' },
    { id: '2', name: 'Ramesh', age: '33' },
    { id: '3', name: 'Anand', age: '35' }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: ({ type: GraphQLID }),
        name: ({ type: GraphQLString }),
        genre: ({ type: GraphQLString }),
        authorId: ({ type: GraphQLString }),
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return _.find(authors, { id: parent.authorId })
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: ({ type: GraphQLInt }),
        name: ({ type: GraphQLString }),
        age: ({ type: GraphQLString }),
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return _.filter(books, { authorId: parent.id })
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from dd/others source
                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from dd/ others source
                return _.find(authors, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
});
