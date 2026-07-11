"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Users, BookOpen, GraduationCap, UserCheck, BarChart3, Building, X, Menu, CheckSquare, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useState, useEffect } from "react";

// Define the navigation links in an array so it's easy to manage
const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Ustaz", path: "/ustaz", icon: BookOpen },
  { name: "Classes", path: "/classes", icon: GraduationCap },
  { name: "Attendance", path: "/attendance", icon: UserCheck },
  {name :"Assessment",path: "/assessment", icon:CheckSquare },
  { name: "Assessment Details", path: "/assessment-details", icon: FileText },
  // { name: "Todos", path: "/todos", icon: CheckSquare },
  // { name: "Reports", path: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

        {/* Desktop Sidebar */}
        <aside className={`fixed left-0 top-0 h-full border-r border-border bg-background shadow-lg z-50 hidden md:flex flex-col antialiased transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
          <div className="flex flex-col gap-2 p-6 h-full">
            
            {/* Branding / Logo and Collapse Toggle */}
            <div className="mb-8 px-4 flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/10 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Building className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-primary">
                    Nurel Islam Management
                  </h1>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="ml-auto h-8 w-8"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 flex-grow">
              {navItems.map((item) => {
                // Check if current route matches the link path
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 ${
                      isActive ? "bg-secondary -foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Link href={item.path} className="flex items-center gap-3 w-full">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </Button>
                );
              })}
            </nav>

            
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`fixed left-0 top-0 h-full w-[280px] border-r border-border bg-background shadow-lg z-50 md:hidden flex flex-col antialiased transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col gap-2 p-6 h-full">
            
            {/* Mobile Header with Close Button */}
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Building className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-primary">
                    Nurel Islam Management
                  </h1>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2 flex-grow">
              {navItems.map((item) => {
                // Check if current route matches the link path
                const isActive = pathname === item.path;
                const Icon = item.icon;

                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 ${
                      isActive ? "bg-secondary -foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={item.path} className="flex items-center gap-3 w-full">
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </nav>
            
          </div>
        </aside>
    </>
  );
}