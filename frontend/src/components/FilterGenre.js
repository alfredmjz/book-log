import React from "react";

const FilterGenre = ({ setFilter }) => {
	const options = ["refactoring", "agile", "patterns", "design", "crime", "classic", "all genre"];

	return (
		<>
			{options.map((option) => (
				<button
					key={option}
					onClick={() => {
						setFilter(option);
					}}
				>
					{option}
				</button>
			))}
		</>
	);
};

export default FilterGenre;
