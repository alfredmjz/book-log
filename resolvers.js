const { UserInputError, AuthenticationError } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const jwt = require("jsonwebtoken");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const JWT_SECRET = "NEED_HERE_A_SECRET_KEY";

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
		me: (root, args, context) => {
			return context.currentUser;
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
		addBook: async (root, args, context) => {
			const currentUser = context.currentUser;
			if (!currentUser) {
				throw new AuthenticationError("not authenticated");
			}

			if (args.author.length <= 3) {
				throw new UserInputError("Author name must be more than 3 characters", {
					invalidArgs: args.author,
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
				pubsub.publish("BOOK_ADDED", { bookAdded: newBook });
				return newBook;
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
		},
		editAuthor: async (root, args, context) => {
			const currentUser = context.currentUser;
			if (!currentUser) {
				throw new AuthenticationError("not authenticated");
			}

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
		createUser: async (root, args) => {
			const user = new User({ ...args });

			return user.save().catch((error) => {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			});
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });
			console.log(user);
			if (!user || args.password !== "secret") {
				throw new UserInputError("wrong credentials");
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, JWT_SECRET) };
		},
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
		},
	},
};

module.exports = resolvers;
