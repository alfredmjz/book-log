const { ApolloServer, UserInputError, gql } = require("apollo-server");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");

let authors = [
	{
		name: "Robert Martin",
		id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
		born: 1952,
	},
	{
		name: "Martin Fowler",
		id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
		born: 1963,
	},
	{
		name: "Fyodor Dostoevsky",
		id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
		born: 1821,
	},
	{
		name: "Joshua Kerievsky", // birthyear not known
		id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
	},
	{
		name: "Sandi Metz", // birthyear not known
		id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
	},
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

let books = [
	{
		title: "Clean Code",
		published: 2008,
		author: "Robert Martin",
		id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
		genres: ["refactoring"],
	},
	{
		title: "Agile software development",
		published: 2002,
		author: "Robert Martin",
		id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
		genres: ["agile", "patterns", "design"],
	},
	{
		title: "Refactoring, edition 2",
		published: 2018,
		author: "Martin Fowler",
		id: "afa5de00-344d-11e9-a414-719c6709cf3e",
		genres: ["refactoring"],
	},
	{
		title: "Refactoring to patterns",
		published: 2008,
		author: "Joshua Kerievsky",
		id: "afa5de01-344d-11e9-a414-719c6709cf3e",
		genres: ["refactoring", "patterns"],
	},
	{
		title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
		published: 2012,
		author: "Sandi Metz",
		id: "afa5de02-344d-11e9-a414-719c6709cf3e",
		genres: ["refactoring", "design"],
	},
	{
		title: "Crime and punishment",
		published: 1866,
		author: "Fyodor Dostoevsky",
		id: "afa5de03-344d-11e9-a414-719c6709cf3e",
		genres: ["classic", "crime"],
	},
	{
		title: "The Demon ",
		published: 1872,
		author: "Fyodor Dostoevsky",
		id: "afa5de04-344d-11e9-a414-719c6709cf3e",
		genres: ["classic", "revolution"],
	},
];

const MONGODB_URI = "mongodb+srv://alfredmjz:ff7sIzPvgL1dyJhe@cluster0.fx7bp.mongodb.net/?retryWrites=true&w=majority";

console.log("connecting to", MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connection to MongoDB:", error.message);
	});

const typeDefs = gql`
	type Author {
		name: String!
		id: ID!
		born: Int
		bookCount: Int!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}

	type Mutation {
		addBook(title: String!, published: Int!, author: String!, genres: [String!]!): Book!
		editAuthor(name: String!, setBornTo: Int!): Author
	}

	type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book!]
		allAuthors: [Author!]!
	}
`;

const resolvers = {
	Query: {
		bookCount: async () => {
			const returnedBooks = await Book.find({});
			return returnedBooks.length;
		},
		authorCount: async () => {
			const returnedAuthors = await Author.find({});
			return returnedAuthors.length;
		},
		allBooks: async (root, args) => {
			if (!args.author && !args.genre) {
				const returnedBooks = await Book.find({});
				return returnedBooks;
			}

			const returnedAuthor = await Author.findOne({ name: args.author });
			if (args.author && args.genre) {
				const returnedBooks = await Book.find({ author: returnedAuthor._id, genres: { $in: [args.genre] } });
				return returnedBooks;
			}
			if (args.author) {
				const returnedBooks = await Book.find({ author: returnedAuthor._id });
				return returnedBooks;
			}
			if (args.genre) {
				const returnedBooks = await Book.find({ genres: { $in: [args.genre] } });
				return returnedBooks;
			}
			return null;
		},
		allAuthors: async () => {
			const response = await Author.find({});
			return response;
		},
	},
	Author: {
		bookCount: async (root) => {
			const returnedBooks = await Book.find({ author: root._id });
			return returnedBooks.length;
		},
	},
	Book: {
		author: async (root) => {
			const returnedAuthor = await Author.findById(root.author._id);
			return returnedAuthor;
		},
	},
	Mutation: {
		addBook: async (root, args) => {
			if (args.name.length <= 3) {
				throw new UserInputError("Author name must be more than 3 characters", {
					invalidArgs: args.name,
				});
			} else if (args.published / 1000 < 1 || args.setBornTo / 1000 > 9) {
				throw new UserInputError("Published year must be exactly 4 digits", {
					invalidArgs: args.setBornTo,
				});
			}
			const exist = await Author.findOne({ name: args.author });
			try {
				if (!exist) {
					const newAuthor = { name: args.author, born: null };
					const authorResponse = new Author(newAuthor);
					await authorResponse.save();
				}

				const returnedAuthor = await Author.findOne({ name: args.author });
				const newBook = new Book({ ...args, author: returnedAuthor._id });
				await newBook.save();
				return newBook;
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
		},
		editAuthor: async (root, args) => {
			if (args.name.length <= 3) {
				throw new UserInputError("Author name must be more than 3 characters", {
					invalidArgs: args.name,
				});
			} else if (args.setBornTo / 1000 < 1 || args.setBornTo / 1000 > 9) {
				throw new UserInputError("Born date must be exactly 4 digits", {
					invalidArgs: args.setBornTo,
				});
			}

			try {
				const updateAuthor = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo });
				if (!updateAuthor) {
					return null;
				}
				await updateAuthor.save();
				const returnedAuthor = await Author.findOne({ name: args.name });
				return returnedAuthor;
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
