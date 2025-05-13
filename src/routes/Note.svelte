<!-- src/routes/Note.svelte -->
<script>
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { navigate } from '../stores/router.js';

  let notes = [];
  let newNote = { judul: '', deskripsi: '', kategori: '' };
  let isEditing = false;
  let editingId = null;
  let error = null;
  let loading = false;

  const API_URL = "https://akbar-tugas6-13926268988.us-central1.run.app/notes";

  // Fetch all notes
  async function fetchNotes() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    loading = true;
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notes = response.data;
    } catch (error) {
      handleError(error);
    } finally {
      loading = false;
    }
  }

  // Add new note
  async function addNote() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post(API_URL, newNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notes = [...notes, response.data];
      newNote = { judul: '', deskripsi: '', kategori: '' };
    } catch (error) {
      handleError(error);
    }
  }

  // Update note
  async function updateNote(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.put(`${API_URL}/${id}`, newNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notes = notes.map(note => note.id === id ? response.data : note);
      isEditing = false;
      editingId = null;
      newNote = { judul: '', deskripsi: '', kategori: '' };
    } catch (error) {
      handleError(error);
    }
  }

  // Delete note
  async function deleteNote(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notes = notes.filter(note => note.id !== id);
    } catch (error) {
      handleError(error);
    }
  }

  function handleError(error) {
    error = error.response?.data?.message || 'An error occurred';
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  function startEdit(note) {
    isEditing = true;
    editingId = note.id;
    newNote = { ...note };
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  onMount(fetchNotes);
</script>

<main class="min-h-screen bg-gray-100 p-6">
  <div class="max-w-4xl mx-auto">
    <div class="bg-white p-6 rounded-xl shadow-md mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">📒 Notes App</h1>
        <button
          on:click={handleLogout}
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <!-- Note Form -->
      <form on:submit|preventDefault={isEditing ? () => updateNote(editingId) : addNote} class="space-y-4 mb-6">
        <div>
          <input
            type="text"
            bind:value={newNote.judul}
            placeholder="Title"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <textarea
            bind:value={newNote.deskripsi}
            placeholder="Description"
            class="w-full p-2 border rounded-md"
            required
          ></textarea>
        </div>
        <div>
          <input
            type="text"
            bind:value={newNote.kategori}
            placeholder="Category"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
        >
          {isEditing ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      {/if}

      <!-- Notes List -->
      {#if loading}
        <div class="text-center py-4">Loading...</div>
      {:else}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each notes as note (note.id)}
            <div class="bg-white p-4 rounded-xl shadow-md">
              <h2 class="text-lg font-bold">{note.judul}</h2>
              <p class="text-gray-600">{note.deskripsi}</p>
              <span class="inline-flex self-start bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm">
                {note.kategori}
              </span>
              <div class="flex justify-between items-center mt-4 text-gray-500">
                <div class="text-sm">
                  <div>🕒 {new Date(note.tanggal_dibuat).toLocaleDateString()}</div>
                  <div>🆕 {new Date(note.tanggal_diperbarui).toLocaleDateString()}</div>
                </div>
                <div class="flex gap-2">
                  <button
                    on:click={() => startEdit(note)}
                    class="text-blue-500 hover:text-blue-700"
                  >
                    ✏️
                  </button>
                  <button
                    on:click={() => deleteNote(note.id)}
                    class="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>
