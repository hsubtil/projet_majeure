import Dashboard from '../views/Dashboard/Dashboard';
import UserProfile from '../views/UserProfile/UserProfile';
import TableList from '../views/TableList/TableList';
import Typography from '../views/Typography/Typography';
//import Icons from '../views/Icons/Icons';
//import Notifications from '../views/Notifications/Notifications';

const appRoutes = [
    { path: "/admin/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/admin/user", name: "User Profile", icon: "pe-7s-user", component: UserProfile },
    { path: "/admin/table", name: "Table List", icon: "pe-7s-note2", component: TableList },
    { path: "/admin/log", name: "Log", icon: "pe-7s-news-paper", component: Typography },
   /* { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons },*/
    /*{ path: "/notifications", name: "Notifications", icon: "pe-7s-bell", component: Notifications },*/
    { redirect: true, path:"/admin", to:"/admin/dashboard", name: "Dashboard" }
];

export default appRoutes;
