import { attachView } from './index.js';

const themeToggle = document.getElementById('theme-toggle');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

const callbacks = {
  themeToggle: null,
  addItem: null,
  removeItem: null
};

themeToggle.addEventListener('click', () => callbacks.themeToggle?.());
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  callbacks.addItem?.(todoInput.value);
});

window.removeItem = (id) => callbacks.removeItem?.(id);

const view = {
  onThemeToggle(handler) {
    callbacks.themeToggle = handler;
  },
  onAddItem(handler) {
    callbacks.addItem = handler;
  },
  onRemoveItem(handler) {
    callbacks.removeItem = handler;
  },
  clearInput() {
    todoInput.value = '';
  },
  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      themeToggle.innerHTML = '🌙';
    } else {
      document.documentElement.classList.remove('dark');
      themeToggle.innerHTML = '☀️';
    }
  },
  setItems(items) {
    let todoItems = '';

    items.forEach((item) => {
      todoItems += `
        <div class="todo-item">
          <span>${item.name}</span>
          <button class="todo-delete" onclick="removeItem(${item.id})">
            <svg xmlns="http://www.w3.org/2000/svg" class="todo-delete-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>`;
    });

    todoList.innerHTML = `<div class="todo-items">${todoItems}</div>`;
  }
};

attachView(view);
