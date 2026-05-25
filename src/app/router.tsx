// src/app/router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Stats from "../pages/Stats";
import NotFound from "../pages/NotFound";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Account from "../pages/Account";
import SavedViews from "../pages/SavedViews";
import Favorites from "../pages/Favorites";
import Alerts from "../pages/Alerts";
import Regions from "../pages/Regions";
import Notifications from "../pages/Notifications";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  // Públicas
  { path: "/", element: <Home /> },
  { path: "/stats/:disasterKey", element: <Stats /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }, // 👈 nueva ruta pública

  // Protegidas (requieren estar logueado)
  {
    path: "/account",
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
  },
  {
    path: "/saved-views",
    element: (
      <ProtectedRoute>
        <SavedViews />
      </ProtectedRoute>
    ),
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <Favorites />
      </ProtectedRoute>
    ),
  },
  {
    path: "/alerts",
    element: (
      <ProtectedRoute>
        <Alerts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/regions",
    element: (
      <ProtectedRoute>
        <Regions />
      </ProtectedRoute>
    ),
  },

  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },

  // 404
  { path: "*", element: <NotFound /> },
]);
