import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Table from "@material-ui/icons/TableChart";
import Speed from "@material-ui/icons/Speed";
import Shield from "@material-ui/icons/VerifiedUser";

const dashboardRoutes = [
  {
    path: "/",
    name: "Search",
    rtlName: "מנוע חיפוש ביקורות",
    icon: Dashboard,
    llyout: "/search",
  },
  {
    path: "/",
    name: "Authentication",
    rtlName: "התחברות והרשמה",
    icon: Person,
    lyout: "/auth",
  },
  {
    path: "/",
    name: "Dashboard",
    rtlName: "דאשבורד מפקדים",
    icon: Speed,
    layout: "/dashboard",
  },
  {
    path: "/",
    name: "Reviewers",
    rtlName: "מנוע חיפוש מבקרים",
    icon: Table,
    layout: "/reviewers",
  },
];

export default dashboardRoutes;
