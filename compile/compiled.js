// pseudo-compiled from Todo.svelte

const themeToggle = document.getElementById('theme-toggle');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Todo.svelte:2
let theme = 'light';

// Todo.svelte:3
let items = [{ id: 1, name: 'Item 1' }];

// Todo.svelte:18 — {theme === 'dark' ? '🌙' : '☀️'}
const updateThemeLabel = () => {
  themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

// Todo.svelte:28-34 — {#each items as item (item.id)}
const updateItems = () => {
  let html = '';

  items.forEach((item) => {
    html += `
      <div class="todo-item">
        <span>${item.name}</span>
        <button class="todo-delete" onclick="removeItem(${item.id})">×</button>
      </div>`;
  });

  todoList.innerHTML = `<div class="todo-items">${html}</div>`;
};

// compiler rewrites `theme = next` → setTheme(next)
const setTheme = (next) => {
  theme = next;
  updateThemeLabel();
};

// compiler rewrites `items = next` → setItems(next)
const setItems = (next) => {
  items = next;
  updateItems();
};

// Todo.svelte:5-7
const toggleTheme = () => {
  setTheme(theme === 'light' ? 'dark' : 'light');
};

// Todo.svelte:9-11
const addItem = (name) => {
  setItems([...items, { id: Date.now(), name }]);
};

// Todo.svelte:13-15
const removeItem = (id) => {
  setItems(items.filter((item) => item.id !== id));
};

export const mount = () => {
  // Todo.svelte:17 — on:click={toggleTheme}
  themeToggle.addEventListener('click', toggleTheme);

  // Todo.svelte:22 — on:submit|preventDefault={handleSubmit}
  todoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = todoInput.value.trim();
    if (text) addItem(text);
    todoInput.value = '';
  });

  window.removeItem = removeItem;

  updateThemeLabel();
  updateItems();
};
