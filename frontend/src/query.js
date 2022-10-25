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
	query getBooks($author: String, $genre: String) {
		allBooks(author: $author, genre: $genre) {
			id
			title
			published
			genres
			author {
				name
			}
		}
	}
`;

export const ADD_BOOK = gql`
	mutation newBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
		addBook(title: $title, published: $published, author: $author, genres: $genres) {
			title
			published
			author {
				name
			}
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

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

export const ME = gql`
	query {
		me {
			username
			favouriteGenre
		}
	}
`;
