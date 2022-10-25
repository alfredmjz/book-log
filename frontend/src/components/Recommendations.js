import { useQuery } from "@apollo/client";
import React from "react";
import { GET_BOOKS, ME } from "../query";

const Recommendations = (props) => {
	const user = useQuery(ME);
	const books = useQuery(GET_BOOKS, {
		onError: (error) => {
			console.error(error.graphQLErrors[0].message);
		},
		variables: { genre: user.data === undefined ? null : user.data.me.favouriteGenre },
	});

	if (!props.show) {
		return null;
	}

	if (user.loading) return <p>Loading...</p>;
	if (user.error) return <p>Error...</p>;

	console.log(user.data, books.data);
	return (
		<div>
			<h1>Recommendations</h1>
			<p>
				Books in your favorite genre <strong>{user.data.me.favouriteGenre}</strong>
			</p>
			<table>
				<tbody>
					<tr>
						<th>title</th>
						<th>autdor</th>
						<th>published</th>
					</tr>

					{books.data.allBooks.map((book) => {
						return (
							<tr key={book.id}>
								<td>{book.title}</td>
								<td>{book.author.name}</td>
								<td>{book.published}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Recommendations;
