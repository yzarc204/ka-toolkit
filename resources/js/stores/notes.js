import { defineStore } from "pinia";
import api from "@/services/api";

export const useNotesStore = defineStore("notes", {
    state: () => ({
        notes: [],
        selectedNote: null,
        searchQuery: "",
        isLoading: false,
        error: null,
    }),

    getters: {
        filteredNotes: (state) => {
            if (!state.searchQuery) return state.notes;

            const query = state.searchQuery.toLowerCase();
            return state.notes.filter(
                (note) =>
                    note.title.toLowerCase().includes(query) ||
                    note.content.toLowerCase().includes(query)
            );
        },

        hasNotes: (state) => state.notes.length > 0,

        selectedNoteId: (state) => state.selectedNote?.id || null,
    },

    actions: {
        async fetchNotes() {
            this.isLoading = true;
            this.error = null;

            try {
                this.notes = await api.getNotes();
            } catch (error) {
                this.error =
                    error.response?.data?.message || "Failed to fetch notes";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async createNote(noteData) {
            this.isLoading = true;
            this.error = null;

            try {
                const newNote = await api.createNote(noteData);
                this.notes.unshift(newNote);
                this.selectedNote = newNote;
                return newNote;
            } catch (error) {
                this.error =
                    error.response?.data?.message || "Failed to create note";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async updateNote(noteId, noteData) {
            this.isLoading = true;
            this.error = null;

            try {
                const updatedNote = await api.updateNote(noteId, noteData);

                const index = this.notes.findIndex(
                    (note) => note.id === noteId
                );
                if (index !== -1) {
                    this.notes[index] = updatedNote;
                }

                if (this.selectedNote?.id === noteId) {
                    this.selectedNote = updatedNote;
                }

                return updatedNote;
            } catch (error) {
                this.error =
                    error.response?.data?.message || "Failed to update note";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteNote(noteId) {
            this.isLoading = true;
            this.error = null;

            try {
                await api.deleteNote(noteId);

                this.notes = this.notes.filter((note) => note.id !== noteId);

                if (this.selectedNote?.id === noteId) {
                    this.selectedNote = null;
                }
            } catch (error) {
                this.error =
                    error.response?.data?.message || "Failed to delete note";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async shareNote(noteId, userId) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.shareNote(noteId, userId);

                // Update the note with new shared users
                const note = this.notes.find((n) => n.id === noteId);
                if (note) {
                    note.shared_with = response.shared_with;
                }

                if (this.selectedNote?.id === noteId) {
                    this.selectedNote.shared_with = response.shared_with;
                }

                return response;
            } catch (error) {
                this.error =
                    error.response?.data?.message || "Failed to share note";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async unshareNote(noteId, userId) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.unshareNote(noteId, userId);

                // Update the note with new shared users
                const note = this.notes.find((n) => n.id === noteId);
                if (note) {
                    note.shared_with = response.shared_with;
                }

                if (this.selectedNote?.id === noteId) {
                    this.selectedNote.shared_with = response.shared_with;
                }

                return response;
            } catch (error) {
                this.error =
                    error.response?.data?.message || "Failed to unshare note";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        selectNote(note) {
            this.selectedNote = note;
        },

        setSearchQuery(query) {
            this.searchQuery = query;
        },

        clearError() {
            this.error = null;
        },

        reset() {
            this.notes = [];
            this.selectedNote = null;
            this.searchQuery = "";
            this.error = null;
        },
    },
});
