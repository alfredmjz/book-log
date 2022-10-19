import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useApolloClient, useQuery } from "@apollo/client";
import { GET_AUTHORS, GET_BOOKS } from "./query";
import LoginForm from "./components/LoginForm";

const App = () => {
	const [page, setPage] = useState("authors");
	const [token, setToken] = useState(null);
	const authors = useQuery(GET_AUTHORS);
	const books = useQuery(GET_BOOKS);
	const client = useApolloClient();

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	const loginView = () => {
		if (token) {
			return (
				<>
					<button onClick={() => setPage("add")}>add book</button>
					<button onClick={logout}>logout</button>
				</>
			);
		}
		return <button onClick={() => setPage("login")}>login</button>;
	};

	return (
		<div>
			<div>
				<button onClick={() => setPage("authors")}>authors</button>
				<button onClick={() => setPage("books")}>books</button>
				{loginView()}
			</div>

			<Authors show={page === "authors"} authors={authors} />

			<Books show={page === "books"} books={books} />

			<NewBook show={page === "add"} />

			<LoginForm show={page === "login"} setToken={setToken} setPage={setPage} />
		</div>
	);
};

export default App;
