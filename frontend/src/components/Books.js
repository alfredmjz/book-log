import FilterGenre from "./FilterGenre";

const Books = (props) => {
	if (!props.show) {
		return null;
	}

	if (props.books.loading) return <p>Loading...</p>;
	if (props.books.error) return <p>Error...</p>;
	const books = props.books.data.allBooks;

	return (
		<div>
			<h2>books</h2>

			<table>
				<tbody>
					<tr>
						<th>title</th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((a) => (
						<tr key={a.id}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			<FilterGenre setFilter={props.setFilter} />
		</div>
	);
};

export default Books;
