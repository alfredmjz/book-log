import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { EDIT_AUTHOR, GET_AUTHORS } from "../query";

const SetBirthyear = ({ authors }) => {
	const [name, setName] = useState(authors[0].name);
	const [born, setBorn] = useState("");
	const [updateAuthor, result] = useMutation(
		EDIT_AUTHOR,
		{ refetchQueries: [{ query: GET_AUTHORS }] },
		{
			onError: (error) => {
				console.error(error.graphQLErrors[0].message);
			},
		}
	);

	useEffect(() => {
		if (result.data && result.data.editAuthor === null) {
			console.log("author not found");
		}
	}, [result.data]);

	const handleSubmit = (event) => {
		event.preventDefault();
		updateAuthor({
			variables: {
				name,
				setBornTo: parseInt(born),
			},
		});
		setBorn("");
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<select
						onChange={({ target }) => {
							setName(target.value);
						}}
					>
						{authors.map((author) => (
							<option key={author.name} value={author.name}>
								{author.name}
							</option>
						))}
					</select>
				</div>
				<div>
					born
					<input value={born} onChange={({ target }) => setBorn(target.value)} />
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	);
};

export default SetBirthyear;
