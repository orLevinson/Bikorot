import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Lock from "@material-ui/icons/Lock";
import Shield from "@material-ui/icons/VerifiedUser";

const dashboardRoutes = [
  {
    path: "/",
    name: "Search",
    rtlName: "מנוע חיפוש ביקורות",
    icon: Dashboard,

    llayout: "/search",
  },
  {
    path: "/",
    name: "Authentication",
    rtlName: "התחברות והרשמה",
    icon: Person,

    layout: "/auth",
  },
];

export default dashboardRoutes;
