"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Users, BookOpen, GraduationCap, UserCheck, BarChart3, Building } from "lucide-react";

// Define the navigation links in an array so it's easy to manage
const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Ustaz", path: "/ustaz", icon: BookOpen },
  { name: "Classes", path: "/classes", icon: GraduationCap },
  { name: "Attendance", path: "/attendance", icon: UserCheck },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-0 h-full w-[280px] border-r border-border bg-background shadow-lg z-50 hidden md:flex flex-col antialiased">
        <div className="flex flex-col gap-2 p-6 h-full">
          
          {/* Branding / Logo */}
          <div className="mb-8 px-4 flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Building className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-primary">
                Nurel Islam Management
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 flex-grow">
            {navItems.map((item) => {
              // Check if current route matches the link path
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start gap-3 h-12 ${
                        isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Link href={item.path} className="flex items-center gap-3 w-full">
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
          
        </div>
      </aside>
    </TooltipProvider>
  );
}