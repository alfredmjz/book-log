import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useQuery } from "@apollo/client";
import { GET_AUTHORS, GET_BOOKS } from "./query";

const App = () => {
	const [page, setPage] = useState("authors");
	const authors = useQuery(GET_AUTHORS);
	const books = useQuery(GET_BOOKS);
	console.log(books);

	return (
		<div>
			<div>
				<button onClick={() => setPage("authors")}>authors</button>
				<button onClick={() => setPage("books")}>books</button>
				<button onClick={() => setPage("add")}>add book</button>
			</div>

			<Authors show={page === "authors"} authors={authors} />

			<Books show={page === "books"} books={books} />

			<NewBook show={page === "add"} />
		</div>
	);
};

export default App;
