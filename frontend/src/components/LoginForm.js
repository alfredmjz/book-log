import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../query";

const LoginForm = (props) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [login] = useMutation(LOGIN, {
		onError: (error) => {
			console.error(error.graphQLErrors[0].message);
		},
		onCompleted: ({ login }) => {
			const token = login.value;
			localStorage.setItem("booklog-user-token", token);
			props.setToken(token);
		},
	});

	if (!props.show) {
		return null;
	}
	const submit = async (event) => {
		event.preventDefault();
		login({
			variables: {
				username: username.length > 0 ? username : undefined,
				password: password.length > 0 ? password : undefined,
			},
		});
		props.setPage("authors");
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					username <input value={username} onChange={({ target }) => setUsername(target.value)} />
				</div>
				<div>
					password <input value={password} onChange={({ target }) => setPassword(target.value)} />
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default LoginForm;
