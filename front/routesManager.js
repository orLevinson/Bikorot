import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Table from "@material-ui/icons/TableChart";
import Speed from "@material-ui/icons/Speed";
import Note from "@material-ui/icons/Note";
import Add from "@material-ui/icons/Add";
import Numbers from "@material-ui/icons/FormatListNumbered";
import Backup from "@material-ui/icons/Backup";

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
  {
    path: "/",
    name: "Managers",
    rtlName: "חיפוש מבקרים",
    icon: Table,
    layout: "/managers",
  },
  {
    path: "/",
    name: "Reviewers",
    rtlName: "עריכת ביקורות",
    icon: Note,
    layout: "/reviewers",
  },
  {
    path: "/",
    name: "newReview",
    rtlName: "ביקורת חדשה",
    icon: Add,
    layout: "/newReview",
  },
  {
    path: "/",
    name: "changeValues",
    rtlName: "שנה אחוזים",
    icon: Numbers,
    layout: "/changeValues",
  },
  {
    path: "/",
    name: "changeFiles",
    rtlName: "שנה קבצים",
    icon: Backup,
    layout: "/changeFiles",
  },
];

export default dashboardRoutes;
