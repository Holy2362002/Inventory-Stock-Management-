import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Dashboard as DashBoardIcon,
  Inventory2 as InventoryIcon,
  ProductionQuantityLimits as ProductIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as RegisterIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useApp } from "../AppProvider";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router";
import Profile from "./Profile";
export default function AppDrawer() {
  const { openDrawer, setOpenDrawer, user, setUser } = useApp();
  const navigate = useNavigate();
  return (
    <Drawer
      open={openDrawer}
      onClick={() => setOpenDrawer(false)}
      onClose={() => setOpenDrawer(false)}
    >
      {user && (
        <Box
          sx={{
            height: 64,

            display: "flex",
            alignItems: "center",
          }}
        >
          <Profile />
        </Box>
      )}
      <Box sx={{ width: 225, background: "grey" }} role="presentation">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <DashBoardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/Pos")}>
              <ListItemIcon>
                <ProductIcon />
              </ListItemIcon>
              <ListItemText primary="POS" />
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/inventory")}>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Inventory" />
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/history")}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />

        {user && (
          <>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setUser(undefined);
                    localStorage.removeItem("token");
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
        {!user && (
          <>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/login")}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            </List>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/register")}>
                  <ListItemIcon>
                    <RegisterIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );
}
