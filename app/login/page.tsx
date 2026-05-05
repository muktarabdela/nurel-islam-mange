import Link from "next/link";

export default function LoginPage() {
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

          {/* Login Form */}
          <form className="flex flex-col gap-6" action="/dashboard">
            
            {/* Email Input Group */}
            <div className="flex flex-col gap-2">
              <label 
                className="font-label-caps text-label-caps text-on-surface-variant uppercase" 
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                </div>
                <input 
                  className="block w-full pl-[40px] pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none" 
                  id="email" 
                  name="email" 
                  placeholder="admin@al-ilm.edu" 
                  required 
                  type="email"
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
                <Link 
                  className="font-body-sm text-body-sm text-primary hover:text-primary-fixed-dim transition-colors" 
                  href="#"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                </div>
                <input 
                  className="block w-full pl-[40px] pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <button 
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary hover:bg-surface-tint text-on-primary font-button text-button rounded-lg transition-colors duration-200 shadow-sm" 
                type="submit"
              >
                <span>Sign In</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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