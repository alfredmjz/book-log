import SetBirthyear from "./SetBirthyear";

const Authors = (props) => {
	if (!props.show) {
		return null;
	}

	if (props.authors.loading) return <p>Loading...</p>;
	if (props.authors.error) return <p>Error...</p>;
	const authors = props.authors.data.allAuthors;

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				<h2>Set Birthyear</h2>
				<SetBirthyear authors={authors} />
			</div>
		</div>
	);
};

export default Authors;
