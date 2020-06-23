import HomePage from "../components/home/HomePage";
import ActivityPage from "../components/activity/ActivityPage";
import LoginPage from "../components/auth/LoginPage";
import CategoryPage from "../components/home/CategoryPage";
import SharePage from "../components/share/SharePage";
import ShareViewPage from "../components/share/ShareViewPage";

const routes = [
    {path: '/login', component: LoginPage},
    // {path: 'signup', components: NotFoundPage},
    // {path: 'password-reset', components: NotFoundPage},


    {path: '/', component: HomePage},
    {path: '/activity', component: ActivityPage},
    {path: '/share', component: SharePage},

    {path: '/category/*', component: CategoryPage},
    {path: '/trash', component: HomePage},

    {path: '/s/:sid', component: ShareViewPage},

];

export default routes;

export function getSharedLink(id) {
    return `http://maid.singlar.org/s/${id}`
}
