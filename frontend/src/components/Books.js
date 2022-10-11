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
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Books;