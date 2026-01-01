import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const AppContext = createContext();

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useAsyncError } from "react-router";

const queryClient = new QueryClient();

export default function AppProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [user, setUser] = useState();
  const [open, setOpen] = useState(false);
  const [priceType, setPriceType] = useState("RetailPrice");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const api = "https://inventory-api-b0va.onrender.com/users/verify";
    const token = localStorage.getItem("token");
    fetch(api, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    });
  }, []);

  const theme = useMemo(() => {
    console.log("running create theme function");
    return createTheme({
      palette: {
        mode,
      },
    });
  }, [mode]);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        openDrawer,
        setOpenDrawer,
        user,
        setUser,
        open,
        setOpen,
        priceType,
        setPriceType,
        cart,
        setCart,
      }}
    >
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {children}
          <CssBaseline />
        </QueryClientProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
