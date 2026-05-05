"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the navigation links in an array so it's easy to manage
const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { name: "Students", path: "/students", icon: "school" },
  { name: "Ustaz", path: "/ustaz", icon: "person_book" },
  { name: "Classes", path: "/classes", icon: "class" },
  { name: "Attendance", path: "/attendance", icon: "how_to_reg" },
  { name: "Reports", path: "/reports", icon: "assessment" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] border-r border-surface-container-highest bg-surface-container-lowest shadow-ambient z-50 hidden md:flex flex-col antialiased">
      <div className="flex flex-col gap-2 p-6 h-full">
        
        {/* Branding / Logo */}
        <div className="mb-8 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined filled">mosque</span>
          </div>
          <div>
            <h1 className="font-h3 text-3 tracking-tight text-primary">
             nurel islam student management
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => {
            // Check if the current route matches the link path
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-primary font-semibold bg-surface-container-low scale-[0.98]"
                    : "text-on-surface-variant font-button hover:text-primary hover:bg-surface-container-low"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${
                    isActive ? "filled" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
      </div>
    </aside>
  );
}