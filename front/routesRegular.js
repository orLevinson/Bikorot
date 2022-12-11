import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Table from "@material-ui/icons/TableChart";
import Speed from "@material-ui/icons/Speed";
import Note from "@material-ui/icons/Note";
import Add from "@material-ui/icons/Add";

const dashboardRoutes = [
  {
    path: "/",
    name: "Search",
    rtlName: "מנוע חיפוש ביקורות",
    icon: Dashboard,
    layout: "/search",
  },
  {
    path: "/",
    name: "Dashboard",
    rtlName: "דאשבורד מפקדים",
    icon: Speed,
    layout: "/dashboard",
  },
];

export default dashboardRoutes;
