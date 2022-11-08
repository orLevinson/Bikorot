import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Lock from "@material-ui/icons/Lock";
import Shield from "@material-ui/icons/VerifiedUser";

const dashboardRoutes = [
  {
    path: "",
    name: "Dashboard",
    rtlName: "דף הבית",
    icon: Dashboard,

    llayout: "/dashboard",
  },
  {
    path: "/auth",
    name: "Authentication",
    rtlName: "התחברות והרשמה",
    icon: Person,

    layout: "/dashboard",
  },
];

export default dashboardRoutes;
