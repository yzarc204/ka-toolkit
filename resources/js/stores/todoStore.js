import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useTodoStore = defineStore("todo", () => {
    // State
    const todos = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // Getters
    const inProgressCount = computed(
        () => todos.value.filter((todo) => todo.status === "in_progress").length
    );

    const completedCount = computed(
        () => todos.value.filter((todo) => todo.status === "completed").length
    );

    const todoCount = computed(
        () => todos.value.filter((todo) => todo.status === "todo").length
    );

    const todosByStatus = computed(() => ({
        todo: todos.value.filter((todo) => todo.status === "todo"),
        in_progress: todos.value.filter(
            (todo) => todo.status === "in_progress"
        ),
        completed: todos.value.filter((todo) => todo.status === "completed"),
    }));

    // Actions
    const fetchTodos = async () => {
        try {
            loading.value = true;
            error.value = null;
            const response = await axios.get("/api/todos");
            todos.value = response.data;
        } catch (err) {
            error.value =
                err.response?.data?.message ||
                "Có lỗi xảy ra khi tải danh sách todo";
            console.error("Error fetching todos:", err);
        } finally {
            loading.value = false;
        }
    };

    const createTodo = async (todoData) => {
        try {
            loading.value = true;
            error.value = null;
            const response = await axios.post("/api/todos", todoData);
            todos.value.push(response.data);
            return response.data;
        } catch (err) {
            error.value =
                err.response?.data?.message || "Có lỗi xảy ra khi tạo todo";
            console.error("Error creating todo:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateTodo = async (id, todoData) => {
        try {
            loading.value = true;
            error.value = null;
            const response = await axios.put(`/api/todos/${id}`, todoData);
            const index = todos.value.findIndex((todo) => todo.id === id);
            if (index !== -1) {
                todos.value[index] = response.data;
            }
            return response.data;
        } catch (err) {
            error.value =
                err.response?.data?.message ||
                "Có lỗi xảy ra khi cập nhật todo";
            console.error("Error updating todo:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteTodo = async (id) => {
        try {
            loading.value = true;
            error.value = null;
            await axios.delete(`/api/todos/${id}`);
            todos.value = todos.value.filter((todo) => todo.id !== id);
        } catch (err) {
            error.value =
                err.response?.data?.message || "Có lỗi xảy ra khi xóa todo";
            console.error("Error deleting todo:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const toggleTodoStatus = async (todo) => {
        const newStatus = todo.status === "completed" ? "todo" : "completed";
        return await updateTodo(todo.id, { status: newStatus });
    };

    const updateTodoOrder = async (todosData) => {
        try {
            loading.value = true;
            error.value = null;
            await axios.post("/api/todos/update-order", { todos: todosData });

            // Update local state
            todosData.forEach((todoData) => {
                const todo = todos.value.find((t) => t.id === todoData.id);
                if (todo) {
                    todo.order = todoData.order;
                }
            });

            // Sort todos by order
            todos.value.sort((a, b) => a.order - b.order);
        } catch (err) {
            error.value =
                err.response?.data?.message ||
                "Có lỗi xảy ra khi cập nhật thứ tự";
            console.error("Error updating order:", err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const clearError = () => {
        error.value = null;
    };

    return {
        // State
        todos,
        loading,
        error,

        // Getters
        inProgressCount,
        completedCount,
        todoCount,
        todosByStatus,

        // Actions
        fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        toggleTodoStatus,
        updateTodoOrder,
        clearError,
    };
});
