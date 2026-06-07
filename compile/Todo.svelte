<script>
  let theme = 'light';
  let items = [{ id: 1, name: 'Item 1' }];

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
  }

  function addItem(name) {
    items = [...items, { id: Date.now(), name }];
  }

  function removeItem(id) {
    items = items.filter((item) => item.id !== id);
  }
</script>

<button class="theme-toggle" on:click={toggleTheme}>
  {theme === 'dark' ? '🌙' : '☀️'}
</button>

<form class="todo-form" on:submit|preventDefault={handleSubmit}>
  <input id="todo-input" class="todo-input" type="text" placeholder="Add a new task..." required />
  <button class="todo-submit" type="submit">+</button>
</form>

<div class="todo-list">
  {#each items as item (item.id)}
    <div class="todo-item">
      <span>{item.name}</span>
      <button class="todo-delete" on:click={() => removeItem(item.id)}>×</button>
    </div>
  {/each}
</div>
