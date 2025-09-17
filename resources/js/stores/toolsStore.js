import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    ClipboardDocumentListIcon,
    CogIcon,
} from "@heroicons/vue/24/outline";

export const useToolsStore = defineStore("tools", () => {
    // State
    const tools = ref([
        {
            id: "notes",
            name: "Notes",
            icon: "DocumentTextIcon",
            color: "#3B82F6",
            route: "/note",
            isActive: true,
            order: 1,
            category: "productivity",
            tags: ["ghi chú", "tài liệu", "productivity"],
        },
        {
            id: "todo",
            name: "Todo App",
            icon: "ClipboardDocumentListIcon",
            color: "#F59E0B",
            route: "/todo",
            isActive: true,
            order: 3,
            category: "productivity",
            tags: ["todo", "công việc", "nhiệm vụ"],
        },
        {
            id: "chatbot",
            name: "Yes/No Bot",
            icon: "ChatBubbleLeftRightIcon",
            color: "#10B981",
            route: "/chatbot",
            isActive: true,
            order: 2,
            category: "decision",
            tags: ["ai", "chatbot", "trợ lý"],
        },
    ]);

    const searchQuery = ref("");

    // Icon components mapping
    const iconComponents = {
        DocumentTextIcon,
        ChatBubbleLeftRightIcon,
        ClipboardDocumentListIcon,
        CogIcon,
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

    const groupedTools = computed(() => {
        const groups = {};

        activeTools.value.forEach((tool) => {
            const category = tool.category || "other";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(tool);
        });

        // Sort tools within each group by order
        Object.keys(groups).forEach((category) => {
            groups[category].sort((a, b) => a.order - b.order);
        });

        return groups;
    });

    const categoryLabels = {
        productivity: "Productivity",
        decision: "Decision",
        utility: "Utilities",
        other: "Other",
    };

    // Actions
    const addTool = (tool) => {
        const newTool = {
            id: tool.id || `tool_${Date.now()}`,
            name: tool.name,
            icon: tool.icon || "CogIcon",
            color: tool.color || "#6B7280",
            route: tool.route || "/",
            isActive: tool.isActive !== false,
            order: tool.order || tools.value.length + 1,
            category: tool.category || "other",
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
        categoryLabels,

        // Getters
        activeTools,
        filteredTools,
        groupedTools,
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
