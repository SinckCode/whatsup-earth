import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Stats from "../pages/Stats";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/stats/:disasterKey", element: <Stats /> },
  { path: "*", element: <NotFound /> },
]);
