import AppDrawer from "./components/AppDrawer";
import Header from "./components/Header";
import DashBoard from "./pages/DashBoard";
import Product from "./components/Products";
import Search from "./components/Search";
import Pos from "./pages/Pos";
import { Outlet } from "react-router";
import { Box } from "@mui/material";

export default function App() {
  return (
    <div>
      <Header />
      <AppDrawer />
      <Box>
        <Outlet />
      </Box>
    </div>
  );
}
