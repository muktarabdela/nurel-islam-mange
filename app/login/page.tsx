"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminService } from "@/lib/servies/adminService";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phone_number: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await adminService.login(formData);
      
      if (response.success) {
        // Store admin data in cookie for middleware authentication
        document.cookie = `admin=${JSON.stringify(response.admin)}; path=/; max-age=86400; SameSite=Strict`;
        router.push('/dashboard');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-8 antialiased text-on-background relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-container/10 to-transparent -z-10 pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-fixed rounded-full blur-[120px] opacity-20 -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-tertiary-fixed rounded-full blur-[120px] opacity-20 -z-10 pointer-events-none"></div>

      {/* Login Card Container */}
      <main className="w-full max-w-[440px]">
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-container-high p-8 sm:p-10 relative z-10">
          
          {/* Branding Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined filled text-[32px] text-on-primary-container">
                school
              </span>
            </div>
            <h1 className="font-h2 text-h2 text-on-surface mb-2">Nurel Islam Student Management</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Islamic Excellence Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-body-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            
            {/* Phone Number Input Group */}
            <div className="flex flex-col gap-2">
              <label 
                className="font-label-caps text-label-caps text-on-surface-variant uppercase" 
                htmlFor="phone_number"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">phone</span>
                </div>
                <input 
                  className="block w-full pl-[40px] pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none" 
                  id="phone_number" 
                  name="phone_number" 
                  placeholder="09########" 
                  required 
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input Group */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label 
                  className="font-label-caps text-label-caps text-on-surface-variant uppercase" 
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                </div>
                <input 
                  className="block w-full pl-[40px] pr-12 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-auto text-outline hover:text-on-surface transition-colors"
                  disabled={isLoading}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <button 
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-surface-tint text-on-primary font-button text-button rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                <span className="material-symbols-outlined text-[18px]">
                  {isLoading ? 'hourglass_empty' : 'arrow_forward'}
                </span>
              </button>
            </div>
          </form>

          {/* Footer info */}
          <div className="mt-8 text-center">
            <p className="font-body-sm text-body-sm text-outline">
              Secure access for authorized personnel only.
            </p>
          </div>

        </div>
      </main>

    </div>
  );
}