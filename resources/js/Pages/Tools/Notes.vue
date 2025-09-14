<template>
  <!-- Notes Container -->
  <div
    class="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
    <!-- Mobile Header -->
    <div class="md:hidden p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Notes</h2>
        <button @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row h-full overflow-hidden">
      <Sidebar :notes="filteredNotes" :selected-note="selectedNote" :search-query="searchQuery"
        :is-mobile-open="isSidebarOpen" @select-note="selectNote" @update:searchQuery="searchQuery = $event"
        @create-note="createNewNote" @close="closeSidebar" />

      <Editor :note="selectedNote" :formatting-state="formattingState" @update:title="handleTitleUpdate"
        @update:content="handleContentUpdate" @format-text="formatText" @update-formatting-state="updateFormattingState"
        @toggle-public-status="togglePublicStatus" @show-share-modal="showShareModal = true" @delete-note="deleteNote"
        @copy-link-success="handleCopyLinkSuccess" />

      <ShareModal v-if="showShareModal" :share-email="shareEmail" :shared-users="selectedNote?.shared_with || []"
        :is-public="selectedNote?.is_public || false" :is-sharing="isSharing" @update:share-email="shareEmail = $event"
        @share="shareNote" @unshare="unshareNote" @toggle-public="togglePublicStatus" @close="showShareModal = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Sidebar from '@/Components/Notes/Sidebar.vue';
import Editor from '@/Components/Notes/Editor.vue';
import ShareModal from '@/Components/Notes/ShareModal.vue';
import api from '@/services/api';
import { useAuth } from '@/Composables/useAuth';
import { useToast } from '@/Composables/useToast';
import { globalConfirm } from '@/Composables/useConfirm';

// Props for direct note access
const props = defineProps({
  id: {
    type: String,
    default: null
  }
});

// Debounce helper
const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const { user, logout: authLogout } = useAuth();
const router = useRouter();
const route = useRoute();
const notes = ref([]);
const selectedNote = ref(null);
const searchQuery = ref('');
const showShareModal = ref(false);
const shareEmail = ref('');
const isSharing = ref(false);

// Mobile sidebar state
const isSidebarOpen = ref(false);

const { success, error, warning } = useToast();

// Formatting state
const formattingState = reactive({
  bold: false,
  italic: false,
  link: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false
});

// Notes API
const fetchNotes = async () => {
  try {
    notes.value = await api.getNotes();
  } catch (e) {
    console.error('Error fetching notes:', e);
  }
};

const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value;
  const query = searchQuery.value.toLowerCase();
  return notes.value.filter((note) =>
    note.title.toLowerCase().includes(query) || stripHtml(note.content).toLowerCase().includes(query)
  );
});

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const selectNote = (note) => {
  selectedNote.value = { ...note };

  // Update URL without redirecting
  if (note && note.id) {
    router.push({ name: 'note.view', params: { id: note.id } });
  }

  // Close sidebar on mobile after selecting a note
  isSidebarOpen.value = false;
};

// Mobile sidebar methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const createNewNote = async () => {
  try {
    const newNote = { title: 'Untitled Note', content: '', is_public: false };
    const response = await api.createNote(newNote);
    notes.value.unshift(response);
    selectedNote.value = { ...response };

    // Navigate to new note URL
    router.push({ name: 'note.view', params: { id: response.id } });

    success('New note created successfully!');
  } catch (err) {
    console.error('Error creating note:', err);
    error('Failed to create note. Please try again.');
  }
};

const handleTitleUpdate = (title) => {
  if (!selectedNote.value) return;
  selectedNote.value.title = title;
  debouncedUpdateNote();
};

const handleContentUpdate = (content) => {
  if (!selectedNote.value) return;
  selectedNote.value.content = content;
  debouncedUpdateNote();
};

const debouncedUpdateNote = debounce(async () => {
  if (!selectedNote.value) return;
  try {
    const updateData = {
      title: selectedNote.value.title || '',
      content: selectedNote.value.content || '',
      is_public: Boolean(selectedNote.value.is_public),
    };

    await api.updateNote(selectedNote.value.id, updateData);
    const index = notes.value.findIndex((n) => n.id === selectedNote.value.id);
    if (index !== -1) notes.value[index] = { ...selectedNote.value };
  } catch (err) {
    console.error('Error updating note:', err);
    error('Failed to update note. Please try again.');
  }
}, 500);

const formatText = (command) => {
  if (!selectedNote.value) return;
  const contentEditable = document.querySelector('[contenteditable="true"]');
  if (!contentEditable) return;
  contentEditable.focus();
  document.execCommand(command, false, null);
  selectedNote.value.content = contentEditable.innerHTML;
  debouncedUpdateNote();
};

const updateFormattingState = (state) => {
  Object.assign(formattingState, state);
};

const togglePublicStatus = async () => {
  if (!selectedNote.value) return;
  selectedNote.value.is_public = !selectedNote.value.is_public;
  try {
    const updateData = {
      title: selectedNote.value.title || '',
      content: selectedNote.value.content || '',
      is_public: Boolean(selectedNote.value.is_public),
    };

    await api.updateNote(selectedNote.value.id, updateData);
    const index = notes.value.findIndex((n) => n.id === selectedNote.value.id);
    if (index !== -1) notes.value[index] = { ...selectedNote.value };
    success(selectedNote.value.is_public ? 'Note is now public' : 'Note is now private');
  } catch (err) {
    console.error('Error updating note:', err);
    error('Failed to update note. Please try again.');
    // Revert the change
    selectedNote.value.is_public = !selectedNote.value.is_public;
  }
};

const deleteNote = async () => {
  if (!selectedNote.value) return;

  try {
    const confirmed = await globalConfirm.confirmDanger(
      'Are you sure you want to delete this note?',
      {
        title: 'Delete Note',
        description: 'This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    );

    if (!confirmed) return;

    globalConfirm.setLoading(true, 'Deleting note...');

    await api.deleteNote(selectedNote.value.id);
    notes.value = notes.value.filter((n) => n.id !== selectedNote.value.id);
    selectedNote.value = null;
    success('Note deleted successfully!');
  } catch (err) {
    console.error('Error deleting note:', err);
    error('Failed to delete note. Please try again.');
  } finally {
    globalConfirm.setLoading(false);
  }
};

const shareNote = async (email) => {
  if (!selectedNote.value || !email) return;
  try {
    isSharing.value = true;
    const user = await api.getUserByEmail(email);
    await api.shareNote(selectedNote.value.id, user.id);

    // Refresh the note to get updated shared_with data
    const updatedNote = await api.getNotes();
    const note = updatedNote.find(n => n.id === selectedNote.value.id);
    if (note) {
      selectedNote.value = note;
      const index = notes.value.findIndex((n) => n.id === note.id);
      if (index !== -1) notes.value[index] = note;
    }

    shareEmail.value = '';
    success(`Note shared with ${email} successfully!`);
  } catch (err) {
    console.error('Error sharing note:', err);
    if (err.response?.status === 404) {
      error('User not found. Please check the email address.');
    } else {
      error('Failed to share note. Please try again.');
    }
  } finally {
    isSharing.value = false;
  }
};

const unshareNote = async (userId) => {
  if (!selectedNote.value) return;
  try {
    await api.unshareNote(selectedNote.value.id, userId);

    // Refresh the note to get updated shared_with data
    const updatedNote = await api.getNotes();
    const note = updatedNote.find(n => n.id === selectedNote.value.id);
    if (note) {
      selectedNote.value = note;
      const index = notes.value.findIndex((n) => n.id === note.id);
      if (index !== -1) notes.value[index] = note;
    }

    success('User removed from shared access');
  } catch (err) {
    console.error('Error unsharing note:', err);
    error('Failed to remove user access. Please try again.');
  }
};

// Handle copy link success
const handleCopyLinkSuccess = (message) => {
  success(message);
};

// Initialize
onMounted(async () => {
  await fetchNotes();

  // Check if there's a note ID from props (direct link) or query parameter
  const noteId = props.id || route.query.note;
  if (noteId) {
    const note = notes.value.find(n => n.id == noteId);
    if (note) {
      selectedNote.value = note;
      // If we came from query parameter, update URL to direct link format
      if (route.query.note && !props.id) {
        router.replace({ name: 'note.view', params: { id: noteId } });
      }
    } else {
      // If note not found, show error
      error(`Note with ID ${noteId} not found`);
    }
  }
});
</script>
