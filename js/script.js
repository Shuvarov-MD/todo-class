'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    //Добавление в localStorage
    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    //Отрисовка элементов
    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    //Создание элемента
    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
      `);
        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    //Добавление дела
    addTodo(event) {
        event.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        } else {
            alert('Пустое дело добавить нельзя!');
        }
    }

    //Генерация ключей
    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    //Удаление дела
    deleteItem(targetItem) {
        const targetKey = targetItem.key;
        for (const key of this.todoData.keys()) {
            if (targetKey === key) {
                this.todoData.delete(targetKey);
            }
        }
        this.render();
    }

    //Выполнение дела
    completedItem(targetItem) {
        const targetKey = targetItem.key;
        for (const [key, value] of this.todoData) {
            if (targetKey === key && value.completed === false) {
                value.completed = true;
            } else if (targetKey === key && value.completed === true) {
                value.completed = false;
            }
        }
        this.render();
    }

    //Редактирование дела
    editItem(targetItem) {
        const targetKey = targetItem.key;
        targetItem.contentEditable = 'true';
        targetItem.addEventListener('blur', () => {
            for (const [key, value] of this.todoData) {
                if (targetKey === key) {
                    value.value = targetItem.textContent.trim();
                    this.addToStorage();
                }
            }
            targetItem.contentEditable = 'false';
        });
    }

    //Анимация удаления дела
    animationDeleteItem(targetItem) {
        targetItem.style.transitionProperty = 'opacity';
        targetItem.style.transitionDuration = '0.5s';
        targetItem.style.opacity = 0;
    }

    //Анимация переноса дела из списка в список
    animateCompleteItem(targetItem) {
        targetItem.style.transitionProperty = 'all';
        targetItem.style.transitionDuration = '0.5s';
        targetItem.style.opacity = 0;
        targetItem.style.transform = 'translateY(50%)';
    }

    //Обработчики событий
    handler() {
        document.querySelector('.todo-container').addEventListener('click', event => {
            event.preventDefault();
            const target = event.target;
            if (target.matches('.todo-complete')) {
                const targetItem = target.closest('.todo-item');
                this.animateCompleteItem(targetItem);
                setTimeout(() => {
                    this.completedItem(targetItem);
                }, 500);
            } else if (target.matches('.todo-remove')) {
                const targetItem = target.closest('.todo-item');
                this.animationDeleteItem(targetItem);
                setTimeout(() => {
                    this.deleteItem(targetItem);
                }, 500);
            } else if (target.matches('.todo-edit')) {
                const targetItem = target.closest('.todo-item');
                this.editItem(targetItem);
            }
        });
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
    }
}


const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
todo.handler();
