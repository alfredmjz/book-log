import { gql } from "@apollo/client";

export const GET_AUTHORS = gql`
	query getAuthors {
		allAuthors {
			name
			born
			bookCount
		}
	}
`;

export const GET_BOOKS = gql`
	query getBooks {
		allBooks {
			title
			published
			author {
				name
			}
		}
	}
`;

export const ADD_BOOK = gql`
	mutation newBook($title: String!, $published: Int!, $author: String!, $genres: [String!]) {
		addBook(title: $title, published: $published, author: $author, genres: $genres) {
			title
			author
			published
			genres
		}
	}
`;

export const EDIT_AUTHOR = gql`
	mutation changeInfo($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			name
			born
		}
	}
`;
