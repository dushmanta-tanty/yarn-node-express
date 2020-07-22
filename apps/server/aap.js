const logger = require('middleware1');
const req_validator = require('middleware2');
const express = require('express');
const todo_app = express();

todo_app.use(express.json());
const BASE_URL = '/todo/App/api';
// base url 
todo_app.get('/', (request, response) => {
    response.send('active');
});

// api for app health URL: `/todo/App/api/health`
todo_app.get(BASE_URL+'/health', (request, response) => {
    
    const res = {
        'status': 'active',
        'timestamp': Date.now()
    };
    logger(request, response);
    req_validator(request);
    response.send(res);
});

const todos = [
    {
        'id': 1,
        'title': 'Walk'
    },
    {
        'id': 2,
        'title': 'Draw a scene'
    }
];

// api to get todo list
todo_app.get(BASE_URL+'/todos', (request, response) => {
    const isValid = req_validator(request);
    if(isValid) 
        response.send(todos);
    else
        response.status(401).send('un-authorized request');
});

// api to get a specific todo
todo_app.get(BASE_URL+'/todo/:id', (request, response) => {
    const isValid = req_validator(request);
    if(isValid) {
        const todo = todos.find(td => td.id === parseInt(request.params.id));
        if(!todo) response.status(404).send('todo item not found with id : '+request.params.id);
        response.send(todo);
    } else {
        response.status(401).send('un-authorized request');
    }    
});

// api to add a todo
todo_app.post(BASE_URL+'/todo', (request, response) => {
    const isValid = req_validator(request);
    if(isValid) {
        const { error } = validateTodo(request.body);
        if(error) {
            response.status(400).send(error.message);
            return;
        }
        const todo = {
            id: todos.length + 1,
            title: request.body.title
        }
        todos.push(todo);
        
        const res = {
            'message': 'todo list is added with ' + request.body.title,
            'timestamp': Date.now()
        }
        response.send(res);
    } else {
        response.status(401).send('un-authorized request');
    }
});

// api to update a todo
todo_app.patch(BASE_URL+'/todo/:id', (request, response) => {
    const isValid = req_validator(request);
    if(isValid) {
        const todo = todos.find(td => td.id === parseInt(request.params.id));
        if(!todo) response.status(404).send('todo item not found with id : '+request.params.id);

        const { error } = validateTodo(request.body);
        if(error) {
            response.status(400).send(error.message);
            return;
        }
        todo.title = request.body.title;
        const res = {
            'message': 'todo list is updated the record with id ' + request.params.id,
            'timestamp': Date.now()
        }
        response.send(res);
    } else {
        response.status(401).send('un-authorized request');
    }
});


// api to delete a todo
todo_app.delete(BASE_URL+'/todo/:id', (request, response) => {
    const isValid = req_validator(request);
    if(isValid) {
        const todo = todos.find(td => td.id === parseInt(request.params.id));
        if(!todo) response.status(404).send('todo item not found with id : '+request.params.id);
        const index = todos.indexOf();
        todos.splice(index, 1);
        const res = {
            'todo': todo,
            'message': 'todo item is removed from list',
            'timestamp': Date.now()
        };
        response.send(res);
    } else {
        response.status(401).send('un-authorized request');
    }
});

// making port dynamic as per environment
const PORT = process.env.PORT || 81;
todo_app.listen(PORT, () => {
    console.log(`listening to port: ${PORT}`);
});

function validateTodo(todo) {
    if(todo.title.length > 3) 
        return {
            error: null,
            data: todo
        };
    else
        return {
            error: {
                message: 'Invalid title, should have proper value!'
            }
        };
}
