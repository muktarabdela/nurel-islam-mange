"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminFromSession, logout } from "@/lib/auth";

export default function TopNavBar() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Get admin data from cookie
    const admin = getAdminFromSession();
    if (admin) {
      setAdminName(admin.full_name || "Admin");
    }
  }, []);

  const handleLogout = () => {
    // Clear admin data from cookie
    logout();
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-container-highest bg-surface-container-lowest/80 backdrop-blur-md text-primary font-body-sm flex justify-between items-center h-16 px-8 md:px-8 pl-20 md:pl-8">
      
      {/* Left side: Search */}
      <div className="flex items-center gap-4 w-1/3">
       
      </div>

      <div className="hidden">Admin Portal</div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-6">       
      
        <div className="flex items-center gap-3 border-l border-surface-container-highest pl-6 ml-2">
          <span className="text-on-surface-variant font-medium hidden sm:block">
            {adminName}
          </span>
          <button
            onClick={handleLogout}
            className="text-on-surface-variant hover:text-error transition-all focus:ring-2 focus:ring-error/20 rounded-full p-1"
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
          <img
            alt="Admin User Avatar"
            className="w-8 h-8 rounded-full border border-outline-variant object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu9dlF0G-izlsnXbpwcXPiiGIV17sJt4mhNeJFdV7ICadDF193vjuI0hqWflimsr7DehnXld1bOZIJIJ_eIPTcI1Sr-tSaczDKqDI3lvym4r51PFj4b_opKWRGfyeh00IiDexgQhr3kPqX5uEh1NtCNkGskp47t_JamzK8aSbu07Ju50xHJ5rjbRjfoqb0HDLiouWT1za4EXy0AMJ0lpMV-5ujiNdiqs_UAlkLjgHV-YIo9X8KpSEvhfveD5HFaNWGP8t4nM-DNE0"
          />
        </div>
      </div>
    </header>
  );
}