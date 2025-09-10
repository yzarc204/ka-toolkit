import { createRouter, createWebHistory } from "vue-router";
import NotesPage from "@/Pages/Tools/Notes.vue";
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
    } else if (to.matched.some((record) => record.meta.guest) && token) {
        next("/");
    } else {
        next();
    }
});

export default router;
