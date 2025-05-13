<script>
  import { navigate } from '../stores/router.js';
  import axios from 'axios';

  let name = '';  // changed from email to name
  let password = '';
  let error = null;
  let loading = false;

  const handleLogin = async () => {
    loading = true;
    error = null;
    
    try {
      const response = await axios.post('https://notes-backend-akbar-13926268988.us-central1.run.app/login', {
        name,     // changed from email to name
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/notes');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      error = err.response?.data?.message || 'Login failed. Please check your credentials.';
    } finally {
      loading = false;
    }
  };
</script>

<main class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
    <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin} class="space-y-4">
      <div>
        <label for="name" class="block text-gray-700">Username</label>
        <input
          id="name"
          type="text"
          bind:value={name}
          class="w-full p-2 border rounded-md"
          required
          disabled={loading}
          placeholder="Enter your username"
          autocomplete="username"
        />
      </div>

      <div>
        <label for="password" class="block text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          class="w-full p-2 border rounded-md"
          required
          disabled={loading}
          placeholder="Enter your password"
          autocomplete="current-password"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <p class="mt-4 text-center">
      Don't have an account? 
      <a 
        href="/register" 
        on:click|preventDefault={() => navigate('/register')}
        class="text-blue-500 hover:text-blue-700"
      >
        Register
      </a>
    </p>
  </div>
</main>