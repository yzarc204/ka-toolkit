import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    ClipboardDocumentListIcon,
    CogIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/vue/24/outline";

export const useToolsStore = defineStore("tools", () => {
    // State
    const tools = ref([
        {
            id: "notes",
            name: "Notes",
            description: "Ghi chú và quản lý tài liệu",
            icon: "DocumentTextIcon",
            color: "#3B82F6",
            route: "/note",
            isActive: true,
            order: 1,
            tags: ["ghi chú", "tài liệu", "productivity"],
        },
        {
            id: "chatbot",
            name: "Yes/No Bot",
            description: "Trợ lý AI trả lời câu hỏi yes/no",
            icon: "ChatBubbleLeftRightIcon",
            color: "#10B981",
            route: "/chatbot",
            isActive: true,
            order: 2,
            tags: ["ai", "chatbot", "trợ lý"],
        },
        {
            id: "todo",
            name: "Todo App",
            description: "Quản lý công việc và nhiệm vụ",
            icon: "ClipboardDocumentListIcon",
            color: "#F59E0B",
            route: "/todo",
            isActive: true,
            order: 3,
            tags: ["todo", "công việc", "nhiệm vụ"],
        },
        {
            id: "confirm-test",
            name: "Confirm Test",
            description: "Test confirm modal functionality",
            icon: "QuestionMarkCircleIcon",
            color: "#8B5CF6",
            route: "/confirm-test",
            isActive: true,
            order: 4,
            tags: ["test", "modal", "development"],
        },
    ]);

    const searchQuery = ref("");

    // Icon components mapping
    const iconComponents = {
        DocumentTextIcon,
        ChatBubbleLeftRightIcon,
        ClipboardDocumentListIcon,
        CogIcon,
        QuestionMarkCircleIcon,
    };

    // Getters
    const activeTools = computed(() =>
        tools.value.filter((tool) => tool.isActive)
    );

    const filteredTools = computed(() => {
        let filtered = activeTools.value;

        // Filter by search query
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            filtered = filtered.filter(
                (tool) =>
                    tool.name.toLowerCase().includes(query) ||
                    tool.description.toLowerCase().includes(query) ||
                    tool.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        // Sort by order
        return filtered.sort((a, b) => a.order - b.order);
    });

    // Actions
    const addTool = (tool) => {
        const newTool = {
            id: tool.id || `tool_${Date.now()}`,
            name: tool.name,
            description: tool.description || "",
            icon: tool.icon || "CogIcon",
            color: tool.color || "#6B7280",
            route: tool.route || "/",
            isActive: tool.isActive !== false,
            order: tool.order || tools.value.length + 1,
            tags: tool.tags || [],
        };

        tools.value.push(newTool);
        return newTool;
    };

    const updateTool = (id, updates) => {
        const index = tools.value.findIndex((tool) => tool.id === id);
        if (index !== -1) {
            tools.value[index] = { ...tools.value[index], ...updates };
            return tools.value[index];
        }
        return null;
    };

    const removeTool = (id) => {
        const index = tools.value.findIndex((tool) => tool.id === id);
        if (index !== -1) {
            tools.value.splice(index, 1);
            return true;
        }
        return false;
    };

    const toggleTool = (id) => {
        const tool = tools.value.find((tool) => tool.id === id);
        if (tool) {
            tool.isActive = !tool.isActive;
            return tool;
        }
        return null;
    };

    const reorderTools = (newOrder) => {
        newOrder.forEach((id, index) => {
            const tool = tools.value.find((tool) => tool.id === id);
            if (tool) {
                tool.order = index + 1;
            }
        });
    };

    const setSearchQuery = (query) => {
        searchQuery.value = query;
    };

    const clearFilters = () => {
        searchQuery.value = "";
    };

    // Utility functions
    const getToolById = (id) => {
        return tools.value.find((tool) => tool.id === id);
    };

    // Statistics
    const stats = computed(() => ({
        total: tools.value.length,
        active: activeTools.value.length,
        inactive: tools.value.length - activeTools.value.length,
    }));

    return {
        // State
        tools,
        searchQuery,
        iconComponents,

        // Getters
        activeTools,
        filteredTools,
        stats,

        // Actions
        addTool,
        updateTool,
        removeTool,
        toggleTool,
        reorderTools,
        setSearchQuery,
        clearFilters,

        // Utility functions
        getToolById,
    };
});
