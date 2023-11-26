import { createRouter, createWebHashHistory } from 'vue-router'
import StartPage from "@/components/StartPage.vue";
import AdminPage from "@/components/AdminPage.vue";

const routes = [
    { path: '/', redirect: '/login'},
    { path: '/login', name: 'StartPage', component: StartPage },
    { path: '/broker/:name', name: 'UserPage', component: () => import('../src/components/UserPage.vue') },
    { path: '/admin', name: 'AdminPage', component: AdminPage }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router