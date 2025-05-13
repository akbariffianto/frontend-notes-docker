<script>
  import { currentRoute } from './stores/router.js';
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';
  import Note from './routes/Note.svelte';
</script>

<main>
  {#if $currentRoute === '/login' || $currentRoute === '/'}
    <Login />
  {:else if $currentRoute === '/register'}
    <Register />
  {:else if $currentRoute === '/notes'}
    <Note />
  {:else}
    <Login />
  {/if}
</main>