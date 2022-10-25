import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useApolloClient, useQuery } from "@apollo/client";
import { GET_AUTHORS, GET_BOOKS } from "./query";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

const App = () => {
	const [page, setPage] = useState("authors");
	const [token, setToken] = useState(null);
	const [filter, setFilter] = useState("all genre");

	const client = useApolloClient();
	console.log(token, localStorage.getItem("booklog-user-token"));

	const authors = useQuery(GET_AUTHORS);
	const books = useQuery(GET_BOOKS, {
		onError: (error) => {
			console.error(error.graphQLErrors[0].message);
		},
		variables: { genre: filter === "all genre" ? null : filter },
		update: (cache, response) => {
			cache.updateQuery({ query: GET_BOOKS }, () => {
				return {
					allBooks: response.data.allBooks,
				};
			});
		},
	});

	const logout = () => {
		setToken(null);
		setPage("authors");
		localStorage.clear();
		client.resetStore();
	};

	const loginView = () => {
		if (token) {
			return (
				<>
					<button onClick={() => setPage("add")}>add book</button>

					<button onClick={() => setPage("recommend")}>recommendations</button>

					<button onClick={logout}>logout</button>
					<NewBook show={page === "add"} />
					<Recommendations show={page === "recommend"} />
				</>
			);
		}
		return (
			<>
				<button onClick={() => setPage("login")}>login</button>
				<LoginForm show={page === "login"} setToken={setToken} setPage={setPage} />
			</>
		);
	};

	return (
		<div>
			<div>
				<button onClick={() => setPage("authors")}>authors</button>
				<button onClick={() => setPage("books")}>books</button>
				{loginView()}
			</div>

			<Authors show={page === "authors"} authors={authors} />

			<Books show={page === "books"} books={books} setFilter={setFilter} />
		</div>
	);
};

export default App;
