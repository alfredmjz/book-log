import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_BOOK, GET_AUTHORS, GET_BOOKS } from "../query";

const NewBook = (props) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [published, setPublished] = useState("");
	const [genre, setGenre] = useState("");
	const [genres, setGenres] = useState([]);
	const [createBook, result] = useMutation(
		ADD_BOOK,
		{ refetchQueries: [{ query: GET_AUTHORS }, { query: GET_BOOKS }] },
		{
			onError: (error) => {
				console.error(error.graphQLErrors[0].message);
			},
		}
	);
	console.log(result);
	useEffect(() => {
		if (result.data && result.data.addBook === null) {
			console.log("Book not added");
		}
	}, [result.data]);

	if (!props.show) {
		return null;
	}

	const submit = async (event) => {
		event.preventDefault();

		createBook({ variables: { title, author, published: parseInt(published), genres } });
		setTitle("");
		setPublished("");
		setAuthor("");
		setGenres([]);
		setGenre("");
	};

	const addGenre = () => {
		setGenres(genres.concat(genre));
		setGenre("");
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					title
					<input value={title} onChange={({ target }) => setTitle(target.value)} />
				</div>
				<div>
					author
					<input value={author} onChange={({ target }) => setAuthor(target.value)} />
				</div>
				<div>
					published
					<input type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
				</div>
				<div>
					<input value={genre} onChange={({ target }) => setGenre(target.value)} />
					<button onClick={addGenre} type="button">
						add genre
					</button>
				</div>
				<div>genres: {genres.join(" ")}</div>
				<button type="submit">create book</button>
			</form>
		</div>
	);
};

export default NewBook;