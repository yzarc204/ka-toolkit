import { createRouter, createWebHistory } from "vue-router";
import NotesPage from "@/Pages/Tools/Notes.vue";
import ChatBotPage from "@/Pages/Tools/ChatBot.vue";
import TodoAppPage from "@/Pages/Tools/TodoApp.vue";
import ConfirmTestPage from "@/Pages/Tools/ConfirmTest.vue";
import ToolsStoreTestPage from "@/Pages/Tools/ToolsStoreTest.vue";
import TopbarSearchDemoPage from "@/Pages/Tools/TopbarSearchDemo.vue";
import Error404 from "@/Pages/Errors/404.vue";
import Error500 from "@/Pages/Errors/500.vue";
import ToolkitLayout from "@/Layouts/ToolkitLayout.vue";
import Home from "@/Pages/Home.vue";
import Login from "@/Pages/Auth/Login.vue";
import Register from "@/Pages/Auth/Register.vue";

const routes = [
    {
        path: "/",
        component: ToolkitLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: "",
                name: "home",
                component: Home,
            },
            {
                path: "note",
                name: "note",
                component: NotesPage,
            },
            {
                path: "note/:id",
                name: "note.view",
                component: NotesPage,
                props: true,
            },
            {
                path: "chatbot",
                name: "chatbot",
                component: ChatBotPage,
            },
            {
                path: "todo",
                name: "todo",
                component: TodoAppPage,
            },
            {
                path: "confirm-test",
                name: "confirm-test",
                component: ConfirmTestPage,
            },
            {
                path: "tools-store-test",
                name: "tools-store-test",
                component: ToolsStoreTestPage,
            },
            {
                path: "topbar-search-demo",
                name: "topbar-search-demo",
                component: TopbarSearchDemoPage,
            },
        ],
    },
    {
        path: "/login",
        name: "login",
        component: Login,
        meta: { guest: true },
    },
    {
        path: "/register",
        name: "register",
        component: Register,
        meta: { guest: true },
    },
    {
        path: "/404",
        name: "404",
        component: Error404,
    },
    {
        path: "/500",
        name: "500",
        component: Error500,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: Error404,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!token) {
            next("/login");
        } else {
            next();
        }
    } else if (to.matched.some((record) => record.meta.guest)) {
        // For guest routes, we need to be more careful
        if (token) {
            // Don't redirect if we're on login page and coming from login (failed login)
            if (to.path === "/login" && from.path === "/login") {
                next();
            } else {
                next("/");
            }
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
