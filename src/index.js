const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { request } = require('express');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;

	const accountAlreadyExist = users.some((user) => user.username === username);


	if(!accountAlreadyExist) {
		return res.status(400).json({
			error: 'User not found!'
		})
	}

	request.username = username;

	return next();
}

app.post('/users', (req, res) => {
  const { name, username } = req.body;

	const accountAlreadyExist = users.some((user) => user.username === username);

	if(accountAlreadyExist) {
		return res.status(400).json({
			error: 'Usuário já existe'
		})
	}

	const newUser = {
		id: uuidv4,
		name,
		username,
		todos: []
	};

	users.push(newUser);

	return res.status(201).json(newUser);

});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  const { title, deadline } = req.body;
	const { username } = req;

	const user = users.find((user) => user.username === username);

	const newTodo = {
		id: uuidv4,
		title,
		done: false,
		deadline: new Date(deadline),
		created_at: new Date(),
	}

	user.todos.push(newTodo);

	res.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

module.exports = app;