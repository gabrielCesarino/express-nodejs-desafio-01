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
		id: uuidv4(),
		name,
		username,
		todos: []
	};

	users.push(newUser);

	return res.send(newUser);

});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  const { username } = req;

	const user = users.find((user) => user.username === username);

	return res.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  const { title, deadline } = req.body;
	const { username } = req;

	const user = users.find((user) => user.username === username);

	const newTodo = {
		id: uuidv4(),
		title,
		done: false,
		deadline: new Date(deadline),
		created_at: new Date(),
	}

	user.todos.push(newTodo);

	res.status(201).send(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  const { username } = req;
	const { title, deadline } = req.body;
	const { id } = req.params;

	const user = users.find((user) => user.username === username);
	const todo = user.todos.some((todo) => todo.id === id );
	let todoIndex;

	if(!todo) {
		return res.status(404).json({
			error: "Todo não encontrado!"
		})
	}

	const updatedTodos = user.todos.map((todo, i) => {
		if(todo.id === id) {
			todoIndex = i;
			return {
				...todo,
				title,
				deadline
			}
		}else {
			return todo
		}
	})

	user.todos = updatedTodos;
	return res.status(200).json(user.todos[todoIndex]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
	const { username } = req;
	const { id } = req.params;
	let todoIndex;

	const user = users.find((user) => user.username === username);
	const todo = user.todos.some((todo) => todo.id === id );

	if(!todo) {
		return res.status(404).json({
			error: "Todo não encontrado!"
		})
	}

	const updatedTodos = user.todos.map((todo, i) => {
		if(todo.id === id) {
			todoIndex = i;
			return {
				...todo,
				done: true,
			}
		}else {
			return todo
		}
	})

	user.todos = updatedTodos;

	return res.status(200).json(user.todos[todoIndex]);
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  const { username } = req;
	const { id } = req.params;

	const user = users.find((user) => user.username === username);
	const todo = user.todos.find((todo) => todo.id === id);

	if(!todo) {
		res.status(404).json({
			error: "Todo não encontrado!"
		})
	}

	user.todos.splice(todo, 1);
	res.status(204).json(user.todos);
});

module.exports = app;