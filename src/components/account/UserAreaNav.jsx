// src/components/account/UserAreaNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../app/AuthContext";
import "../../styles/components/account/_userAreaNav.scss";

export default function UserAreaNav() {
  const { user } = useAuth();

  const isAdmin = ["admin", "superadmin", "root"].includes(
    String(user?.role || "").toLowerCase()
  );

  const links = [
    {
      key: "account",
      label: "Mi cuenta",
      to: "/account",
      exact: true,
    },
    {
      key: "favorites",
      label: "Favoritos",
      to: "/favorites",
    },
    {
      key: "saved",
      label: "Vistas guardadas",
      to: "/saved-views",
    },
    {
      key: "backend",
      label: "Backend",
      to: "/backend",
      adminOnly: true,
    },
  ];

  const visibleLinks = links.filter(
    (link) => !link.adminOnly || (link.adminOnly && isAdmin)
  );

  return (
    <nav className="user-nav">
      <div className="user-nav__track">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.key}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              "user-nav__item" +
              (isActive ? " user-nav__item--active" : "")
            }
          >
            <span className="user-nav__label">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
