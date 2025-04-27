class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.setupEventListeners();
        this.render();
        this.loadTheme();
    }

    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addButton = document.getElementById('addTodo');
        this.todoList = document.getElementById('todoList');
        this.todoCount = document.getElementById('todoCount');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.themeToggle = document.getElementById('themeToggle');
        this.todoTemplate = document.getElementById('todoItemTemplate');
    }

    setupEventListeners() {
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTodos());
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text,
            completed: false
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompletedTodos() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    createTodoElement(todo) {
        const clone = this.todoTemplate.content.cloneNode(true);
        const todoItem = clone.querySelector('.todo-item');
        const checkbox = clone.querySelector('.todo-checkbox');
        const text = clone.querySelector('.todo-text');
        const deleteBtn = clone.querySelector('.delete-todo');

        todoItem.dataset.id = todo.id;
        if (todo.completed) todoItem.classList.add('completed');
        checkbox.checked = todo.completed;
        text.textContent = todo.text;

        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        return clone;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            this.todoList.appendChild(this.createTodoElement(todo));
        });

        const activeTodos = this.todos.filter(t => !t.completed).length;
        this.todoCount.textContent = `${activeTodos} item${activeTodos !== 1 ? 's' : ''} left`;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.body.dataset.theme = theme;
        this.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    toggleTheme() {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        this.themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
}); 