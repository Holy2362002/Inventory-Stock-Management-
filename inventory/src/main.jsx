import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AppProvider from "./AppProvider.jsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import DashBoard from "./pages/DashBoard.jsx";
import Pos from "./pages/Pos.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Inventory from "./pages/Inventory.jsx";
import History from "./pages/History.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <DashBoard />,
      },
      {
        path: "/pos",
        element: <Pos />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/inventory",
        element: <Inventory />,
      },
      {
        path: "/history",
        element: <History />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);
