// src/App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";
import { router } from "./app/router";
import { AuthProvider } from "./app/AuthContext";  // 👈 nuevo import
import "./styles/globals.scss";

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>     {/* 👈 aquí envolvemos todo */}
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
