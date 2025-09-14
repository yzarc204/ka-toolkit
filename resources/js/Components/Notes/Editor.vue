<template>
  <div class="flex-1 bg-light-bg dark:bg-dark-bg overflow-y-auto h-full">
    <div v-if="note" class="p-3 sm:p-4 md:p-6">
      <!-- Title Input -->
      <div class="mb-4 sm:mb-6">
        <input type="text" :value="note.title" @input="$emit('update:title', $event.target.value)" :disabled="!canEdit"
          class="w-full text-lg sm:text-xl md:text-2xl font-bold border-0 border-b border-light-border dark:border-dark-border pb-2 focus:ring-0 focus:outline-none focus:border-primary-500 bg-transparent text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400"
          :class="{ 'opacity-50 cursor-not-allowed': !canEdit }" placeholder="Untitled Note" />
      </div>

      <!-- Formatting Toolbar -->
      <div v-if="canEdit"
        class="mb-3 sm:mb-4 flex flex-wrap gap-1 p-2 sm:p-3 bg-light-hover dark:bg-dark-hover rounded-lg sm:rounded-xl border border-light-border dark:border-dark-border">
        <!-- Text Formatting -->
        <div class="flex gap-1">
          <button @click="formatText('bold')"
            class="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-light-card dark:hover:bg-dark-card transition-colors"
            :class="{ 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300': formattingState.bold }"
            title="Bold (Ctrl+B)">
            <BoldIcon class="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button @click="formatText('italic')"
            class="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-light-card dark:hover:bg-dark-card transition-colors"
            :class="{ 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300': formattingState.italic }"
            title="Italic (Ctrl+I)">
            <ItalicIcon class="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button @click="showLinkModal"
            class="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-light-card dark:hover:bg-dark-card transition-colors"
            :class="{ 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300': formattingState.link }"
            title="Insert Link (Ctrl+K)">
            <LinkIcon class="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>

        <div class="border-l border-light-border dark:border-dark-border mx-2"></div>

        <!-- Text Alignment -->
        <div class="flex gap-1">
          <button @click="formatText('justifyLeft')"
            class="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-light-card dark:hover:bg-dark-card transition-colors"
            :class="{ 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300': formattingState.justifyLeft }"
            title="Align Left">
            <Bars3BottomLeftIcon class="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button @click="formatText('justifyCenter')"
            class="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-light-card dark:hover:bg-dark-card transition-colors"
            :class="{ 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300': formattingState.justifyCenter }"
            title="Align Center">
            <Bars3Icon class="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button @click="formatText('justifyRight')"
            class="p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-light-card dark:hover:bg-dark-card transition-colors"
            :class="{ 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300': formattingState.justifyRight }"
            title="Align Right">
            <Bars3BottomRightIcon class="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>

        <div class="border-l border-light-border dark:border-dark-border mx-2"></div>

      </div>

      <!-- Content Editor -->
      <div class="mb-4 sm:mb-6">
        <div ref="contentEditable" :contenteditable="canEdit" @input="handleContentInput" @keydown="handleKeydown"
          @focus="updateFormattingState" @mouseup="updateFormattingState" @paste="handlePaste"
          @click="handleEditorClick" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave"
          class="w-full min-h-[300px] sm:min-h-[400px] border-0 focus:ring-0 resize-none bg-transparent text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 prose prose-sm max-w-none dark:prose-invert"
          :class="{ 'cursor-text': !canEdit }" data-placeholder="Start writing your note..."></div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div class="flex flex-wrap items-center gap-2 sm:gap-4">
          <!-- Public/Private status - only show for owners -->
          <button v-if="note.is_owner" @click="$emit('toggle-public-status')"
            class="flex items-center text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity">
            <div v-if="note.is_public" class="flex items-center">
              <GlobeAltIcon class="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span class="hidden sm:inline">Public</span>
            </div>
            <div v-else class="flex items-center">
              <LockClosedIcon class="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span class="hidden sm:inline">Private</span>
            </div>
          </button>

          <!-- Show read-only status for shared users -->
          <div v-if="note.is_shared_with_me" class="flex items-center text-xs sm:text-sm opacity-70">
            <LockClosedIcon class="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span class="hidden sm:inline">Read Only</span>
          </div>

          <button @click="copyNoteLink"
            class="flex items-center text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity">
            <LinkIcon class="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span class="hidden sm:inline">Copy Link</span>
          </button>

          <!-- Share button - only for owners -->
          <button v-if="note.is_owner" @click="$emit('show-share-modal')"
            class="flex items-center text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity">
            <UserGroupIcon class="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span class="hidden sm:inline">Share</span>
          </button>
        </div>

        <!-- Delete button - only for owners -->
        <button v-if="note.is_owner" @click="$emit('delete-note')"
          class="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
          <span class="hidden sm:inline">Delete Note</span>
          <span class="sm:hidden">Delete</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex items-center justify-center h-full opacity-50 p-4">
      <div class="text-center">
        <DocumentTextIcon class="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
        <p class="text-sm sm:text-lg text-gray-600 dark:text-gray-400">Select a note to view or create a new one</p>
      </div>
    </div>

    <!-- Link Modal -->
    <div v-if="showLinkDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeLinkModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]" @click.stop>
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {{ savedRange && savedRange.isEditing ? 'Edit Link' : 'Insert Link' }}
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link Text</label>
            <input v-model="linkText" type="text" placeholder="Enter link text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <p v-if="selectedTextForDisplay" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Using selected text: "{{ selectedTextForDisplay }}"
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL</label>
            <input v-model="linkUrl" type="url" placeholder="https://example.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button @click="closeLinkModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button @click="insertLink"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
            {{ savedRange && savedRange.isEditing ? 'Update Link' : 'Insert Link' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure links are clickable and have proper cursor */
.prose a {
  text-decoration: underline !important;
  pointer-events: auto !important;
  position: relative;
  z-index: 1;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.prose a:hover {
  text-decoration: underline !important;
  opacity: 0.8;
}

/* Ensure text cursor for readonly mode */
.cursor-text {
  cursor: text !important;
}

.cursor-text * {
  cursor: text !important;
}

/* Ensure consistent hover behavior for all users */
[contenteditable] {
  cursor: text;
}

[contenteditable="false"] {
  cursor: text;
}

/* Override any conflicting cursor styles */
.prose a {
  cursor: text;
}

/* Change cursor to default when Ctrl is held over links */
.prose a:active {
  cursor: default;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import {
  BoldIcon,
  ItalicIcon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  GlobeAltIcon,
  LockClosedIcon,
  UserGroupIcon,
  DocumentTextIcon,
  LinkIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  note: {
    type: Object,
    default: null
  },
  formattingState: {
    type: Object,
    required: true
  }
});

// Computed property to check if user can edit
const canEdit = computed(() => {
  return props.note?.can_edit !== false;
});

const emit = defineEmits([
  'update:title',
  'update:content',
  'format-text',
  'update-formatting-state',
  'toggle-public-status',
  'show-share-modal',
  'delete-note',
  'copy-link-success'
]);

const contentEditable = ref(null);

// Link modal state
const showLinkDialog = ref(false);
const linkText = ref('');
const linkUrl = ref('');
const selectedTextForDisplay = ref('');
const savedRange = ref(null);

// Set content when note changes
watch(() => props.note, (newNote) => {
  if (newNote && contentEditable.value) {
    nextTick(() => {
      // Always update content when note changes
      const newContent = newNote.content || '';

      // Set flag to prevent input handler from firing
      isUpdatingFromNote = true;

      // Only update if content is actually different
      const currentContent = contentEditable.value.innerHTML;
      if (currentContent !== newContent) {
        // Save cursor position before updating
        const selection = window.getSelection();
        let savedRange = null;

        if (selection.rangeCount > 0) {
          savedRange = selection.getRangeAt(0).cloneRange();
        }

        contentEditable.value.innerHTML = newContent;

        // Restore cursor position after a short delay
        setTimeout(() => {
          if (savedRange) {
            try {
              selection.removeAllRanges();
              selection.addRange(savedRange);
            } catch (e) {
              // If range is invalid, place cursor at end
              const newRange = document.createRange();
              newRange.selectNodeContents(contentEditable.value);
              newRange.collapse(false);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }

          // Reset flag after cursor is restored
          setTimeout(() => {
            isUpdatingFromNote = false;
          }, 50);
        }, 10);
      } else {
        // Reset flag immediately if no update needed
        isUpdatingFromNote = false;
      }

      updateFormattingState();
    });
  }
}, { immediate: true, deep: true });

// Watch for contentEditable ref to be ready
watch(contentEditable, (newElement) => {
  if (newElement && props.note) {
    nextTick(() => {
      const newContent = props.note.content || '';
      newElement.innerHTML = newContent;
      updateFormattingState();

      // Reset flag after initial load
      isUpdatingFromNote = false;
    });
  }
});

// Handle content input with debounce
let contentUpdateTimeout = null;
let lastEmittedContent = '';
let isUpdatingFromNote = false;

const handleContentInput = () => {
  if (!props.note || !contentEditable.value || isUpdatingFromNote || !canEdit.value) return;

  const currentContent = contentEditable.value.innerHTML;

  // Only emit if content actually changed
  if (currentContent !== lastEmittedContent) {
    lastEmittedContent = currentContent;

    // Clear previous timeout
    if (contentUpdateTimeout) {
      clearTimeout(contentUpdateTimeout);
    }

    // Debounce content update
    contentUpdateTimeout = setTimeout(() => {
      emit('update:content', currentContent);
    }, 300);
  }
};

// Handle keyboard shortcuts
const handleKeydown = (event) => {
  // Don't allow formatting shortcuts if user can't edit
  if (!canEdit.value) return;

  // Bold: Ctrl+B
  if (event.ctrlKey && event.key === 'b') {
    event.preventDefault();
    formatText('bold');
    return;
  }

  // Italic: Ctrl+I
  if (event.ctrlKey && event.key === 'i') {
    event.preventDefault();
    formatText('italic');
    return;
  }

  // Link: Ctrl+K
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault();
    showLinkModal();
    return;
  }

  // Handle Enter key for lists
  if (event.key === 'Enter') {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let element = range.startContainer;

      if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
      }

      const li = element.closest('li');
      if (li) {
        if (li.textContent.trim() === '') {
          event.preventDefault();
          const p = document.createElement('p');
          p.innerHTML = '<br>';
          li.closest('ul, ol').after(p);

          const newRange = document.createRange();
          newRange.setStart(p, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);

          li.remove();
          handleContentInput();
        }
      }
    }
  }
};

// Handle paste events - only paste plain text
const handlePaste = (event) => {
  if (!canEdit.value) {
    event.preventDefault();
    return;
  }

  event.preventDefault();

  const clipboardData = event.clipboardData || window.clipboardData;
  const plainText = clipboardData.getData('text/plain');

  if (plainText) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();

      // Create a text node with plain text content
      const textNode = document.createTextNode(plainText);
      range.insertNode(textNode);

      // Move cursor to end of inserted text
      range.setStartAfter(textNode);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);

      handleContentInput();
    }
  }
};

// Handle editor click events
const handleEditorClick = (event) => {
  // Check if clicked element is a link
  const link = event.target.closest('a');
  if (link) {
    // Only handle Ctrl+Click (or Cmd+Click on Mac)
    if (event.ctrlKey || event.metaKey) {
      // Prevent default and manually open in new tab
      event.preventDefault();
      event.stopPropagation();
      window.open(link.href, '_blank', 'noopener,noreferrer');
    } else {
      // For normal clicks, prevent default behavior (don't navigate)
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // In readonly mode, allow text selection but prevent any editing
  if (!canEdit.value) {
    // Allow text selection by not preventing default
    return;
  }
};

// Handle mouse move events to change cursor when Ctrl is held
const handleMouseMove = (event) => {
  const link = event.target.closest('a');
  if (link) {
    if (event.ctrlKey || event.metaKey) {
      // Change cursor to default when Ctrl is held over link
      link.style.cursor = 'default';
      link.style.setProperty('cursor', 'default', 'important');
    } else {
      // Change cursor to text when Ctrl is not held
      link.style.cursor = 'text';
      link.style.setProperty('cursor', 'text', 'important');
    }
  }

  // Ensure text cursor for content editor (but not for links when Ctrl is held)
  if (event.target.closest('[contenteditable]') && !link) {
    event.target.style.cursor = 'text';
  }
};

// Handle mouse leave events to reset cursor
const handleMouseLeave = (event) => {
  const link = event.target.closest('a');
  if (link) {
    // Reset cursor to text when leaving link
    link.style.cursor = 'text';
  }
};

// Handle keydown to detect Ctrl key
const handleKeyDown = (event) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    // Update cursor for all links when Ctrl is pressed
    updateLinkCursors(true);
  }
};

// Handle keyup to detect Ctrl key release
const handleKeyUp = (event) => {
  if (event.key === 'Control' || event.key === 'Meta') {
    // Update cursor for all links when Ctrl is released
    updateLinkCursors(false);
  }
};

// Update cursor for all links based on Ctrl state
const updateLinkCursors = (ctrlPressed) => {
  if (!contentEditable.value) return;

  const links = contentEditable.value.querySelectorAll('a');
  links.forEach(link => {
    if (ctrlPressed) {
      link.style.cursor = 'default';
      link.style.setProperty('cursor', 'default', 'important');
    } else {
      link.style.cursor = 'text';
      link.style.setProperty('cursor', 'text', 'important');
    }
  });

  // Ensure content editor has text cursor
  if (contentEditable.value) {
    contentEditable.value.style.cursor = 'text';
  }
};

// Format text
const formatText = (command) => {
  if (!contentEditable.value || !canEdit.value) return;

  contentEditable.value.focus();

  // Save cursor position before formatting
  const selection = window.getSelection();
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  document.execCommand(command, false, null);

  // Restore cursor position
  if (range && selection.rangeCount === 0) {
    try {
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // Range is invalid, ignore
    }
  }

  updateFormattingState();
  handleContentInput();
};

// Link functions
const showLinkModal = () => {
  if (!canEdit.value) return;

  // Ensure contentEditable is focused
  if (contentEditable.value) {
    contentEditable.value.focus();
  }

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  // Save the current range if there's a selection
  if (selection.rangeCount > 0) {
    savedRange.value = selection.getRangeAt(0).cloneRange();
  } else {
    savedRange.value = null;
  }

  // Check if cursor is inside a link
  let currentLink = null;
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    currentLink = container.nodeType === Node.TEXT_NODE
      ? container.parentElement.closest('a')
      : container.closest('a');
  }

  // If cursor is inside a link, populate modal with link info
  if (currentLink) {
    linkText.value = currentLink.textContent || '';
    linkUrl.value = currentLink.href || '';
    selectedTextForDisplay.value = '';

    // Save reference to the current link for editing
    savedRange.value = {
      linkElement: currentLink,
      isEditing: true
    };
  } else {
    // Store the selected text for display
    selectedTextForDisplay.value = selectedText;

    if (selectedText) {
      linkText.value = selectedText;
    } else {
      linkText.value = '';
    }

    linkUrl.value = '';
    savedRange.value = {
      linkElement: null,
      isEditing: false
    };
  }

  showLinkDialog.value = true;
};

const closeLinkModal = () => {
  showLinkDialog.value = false;
  linkText.value = '';
  linkUrl.value = '';
  selectedTextForDisplay.value = '';
  savedRange.value = null;
};

const insertLink = () => {
  if (!linkUrl.value.trim()) {
    alert('Please enter a URL');
    return;
  }

  if (!linkText.value.trim()) {
    alert('Please enter link text');
    return;
  }

  // Ensure contentEditable is focused
  if (contentEditable.value) {
    contentEditable.value.focus();
  }

  // Check if we're editing an existing link
  if (savedRange.value && savedRange.value.isEditing && savedRange.value.linkElement) {
    // Update existing link
    const existingLink = savedRange.value.linkElement;
    existingLink.href = linkUrl.value;
    existingLink.textContent = linkText.value;

    // Move cursor after the updated link
    const selection = window.getSelection();
    const newRange = document.createRange();
    newRange.setStartAfter(existingLink);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    handleContentInput();
    updateFormattingState();
    closeLinkModal();
    return;
  }

  // Create new link element
  const link = document.createElement('a');
  link.href = linkUrl.value;
  link.textContent = linkText.value;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 underline';
  link.style.cursor = 'text';

  // Use saved range if available, otherwise use current selection
  let range;
  const selection = window.getSelection();

  if (savedRange.value && !savedRange.value.isEditing) {
    // Restore the saved range
    selection.removeAllRanges();
    selection.addRange(savedRange.value);
    range = savedRange.value;
  } else if (selection.rangeCount > 0) {
    range = selection.getRangeAt(0);
  } else {
    // No selection, insert at the end
    if (contentEditable.value) {
      contentEditable.value.appendChild(link);

      // Move cursor after the link
      const newRange = document.createRange();
      newRange.setStartAfter(link);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      handleContentInput();
      updateFormattingState();
      closeLinkModal();
      return;
    }
  }

  if (range) {
    const hasSelectedText = selectedTextForDisplay.value;

    if (hasSelectedText) {
      // Replace selected text with link
      range.deleteContents();
    }

    // Insert the link
    range.insertNode(link);

    // Move cursor after the link
    range.setStartAfter(link);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    // Trigger content update
    handleContentInput();

    // Update formatting state
    updateFormattingState();
  }

  closeLinkModal();
};

// Update formatting state
const updateFormattingState = () => {
  if (!contentEditable.value) return;

  const selection = window.getSelection();
  let isLink = false;

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const linkElement = container.nodeType === Node.TEXT_NODE
      ? container.parentElement.closest('a')
      : container.closest('a');
    isLink = !!linkElement;
  }

  const state = {
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    link: isLink,
    justifyLeft: document.queryCommandState('justifyLeft'),
    justifyCenter: document.queryCommandState('justifyCenter'),
    justifyRight: document.queryCommandState('justifyRight')
  };

  emit('update-formatting-state', state);
};

// Initialize formatting state on mount
onMounted(() => {
  if (contentEditable.value) {
    updateFormattingState();
  }

  // Add global key event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
});

// Cleanup on unmount
onUnmounted(() => {
  // Remove global key event listeners
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
});

// Cleanup timeout on unmount
// Copy note link function
const copyNoteLink = async () => {
  if (!props.note) return;

  const noteUrl = `${window.location.origin}/note/${props.note.id}`;

  try {
    await navigator.clipboard.writeText(noteUrl);
    // Emit success event to parent
    emit('copy-link-success', 'Note link copied to clipboard!');
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = noteUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    emit('copy-link-success', 'Note link copied to clipboard!');
  }
};

onUnmounted(() => {
  if (contentUpdateTimeout) {
    clearTimeout(contentUpdateTimeout);
  }
});
</script>

<style scoped>
/* Placeholder styling */
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.dark [contenteditable]:empty:before {
  color: #6b7280;
}

/* List styling */
[contenteditable] ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

[contenteditable] ol {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

[contenteditable] li {
  margin-bottom: 0.25rem;
}

/* Focus styling */
[contenteditable]:focus {
  outline: none;
}

/* Prose styling for better typography */
.prose {
  line-height: 1.7;
}

.prose p {
  margin-bottom: 1rem;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.prose h1 {
  font-size: 1.875rem;
}

.prose h2 {
  font-size: 1.5rem;
}

.prose h3 {
  font-size: 1.25rem;
}
</style>