import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";

export default function Header() {
  const { setOpenDrawer, user, setUser } = useApp();
  const { mode, setMode } = useApp();
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1, position: "sticky", top: 0, zIndex: 1100 }}>
      <AppBar position="relative">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            INVENTORY
          </Typography>
          {mode == "dark" ? (
            <IconButton onClick={() => setMode("light")}>
              <LightModeIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => setMode("dark")}>
              <DarkModeIcon />
            </IconButton>
          )}
          {user ? (
            <Button
              color="inherit"
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  setUser(undefined);
                  localStorage.removeItem("token");
                }
              }}
            >
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
