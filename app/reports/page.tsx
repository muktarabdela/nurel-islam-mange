import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";

export default function ReportsPage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Main Canvas */}
        <main className="flex-1 p-8 lg:p-xl overflow-y-auto w-full max-w-[1440px] mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="font-h2 text-h2 text-on-surface">Reports and Analytics</h2>
              <p className="font-body-md text-body-md text-secondary mt-1">
                View comprehensive attendance data and trends.
              </p>
            </div>
            
            {/* Date Range Picker */}
            <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-1 shadow-ambient overflow-x-auto max-w-full">
              <button className="px-4 py-2 rounded font-button text-button text-on-surface hover:bg-surface-container transition-colors whitespace-nowrap">
                This Week
              </button>
              <button className="px-4 py-2 rounded font-button text-button text-on-surface bg-surface-container transition-colors whitespace-nowrap">
                This Month
              </button>
              <button className="px-4 py-2 rounded font-button text-button text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2 whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Custom Date
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b border-outline-variant flex gap-6 overflow-x-auto">
            <button className="pb-2 border-b-2 border-primary font-button text-button text-primary whitespace-nowrap">
              Student Attendance
            </button>
            <button className="pb-2 border-b-2 border-transparent font-button text-button text-secondary hover:text-on-surface transition-colors whitespace-nowrap">
              Ustaz Attendance
            </button>
            <button className="pb-2 border-b-2 border-transparent font-button text-button text-secondary hover:text-on-surface transition-colors whitespace-nowrap">
              Summary
            </button>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Chart Card */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 lg:p-lg shadow-ambient border border-slate-100">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-2">
                <h3 className="font-h3 text-h3 text-on-surface">Daily Attendance Trends</h3>
                <button className="text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              
              <div className="h-64 flex items-end gap-2 sm:gap-4 pt-8">
                {/* Mock Bar Chart */}
                <div className="flex-1 bg-surface-container rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "60%" }}>
                  <div className="w-full bg-primary-fixed opacity-60 rounded-t-md group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 font-label-caps text-label-caps text-secondary">Mon</span>
                </div>
                <div className="flex-1 bg-surface-container rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "75%" }}>
                  <div className="w-full bg-primary-fixed opacity-60 rounded-t-md group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 font-label-caps text-label-caps text-secondary">Tue</span>
                </div>
                <div className="flex-1 bg-surface-container rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "85%" }}>
                  <div className="w-full bg-primary rounded-t-md"></div>
                  <span className="absolute -bottom-6 font-label-caps text-label-caps text-on-surface">Wed</span>
                </div>
                <div className="flex-1 bg-surface-container rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "65%" }}>
                  <div className="w-full bg-primary-fixed opacity-60 rounded-t-md group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 font-label-caps text-label-caps text-secondary">Thu</span>
                </div>
                <div className="flex-1 bg-surface-container rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "90%" }}>
                  <div className="w-full bg-primary-fixed opacity-60 rounded-t-md group-hover:opacity-80 transition-opacity"></div>
                  <span className="absolute -bottom-6 font-label-caps text-label-caps text-secondary">Fri</span>
                </div>
                <div className="flex-1 bg-surface-container rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "40%" }}>
                  <div className="w-full bg-tertiary opacity-40 rounded-t-md group-hover:opacity-60 transition-opacity"></div>
                  <span className="absolute -bottom-6 font-label-caps text-label-caps text-secondary">Sat</span>
                </div>
                <div className="flex-1 bg-surface-container rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "30%" }}>
                  <div className="w-full bg-tertiary opacity-40 rounded-t-md group-hover:opacity-60 transition-opacity"></div>
                  <span className="absolute -bottom-6 font-label-caps text-label-caps text-secondary">Sun</span>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="flex flex-col gap-6">
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border border-slate-100 flex-1 flex flex-col justify-center">
                <p className="font-label-caps text-label-caps text-secondary mb-2">Average Attendance Rate</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="font-h1 text-h1 text-on-surface">87%</h2>
                  <span className="font-body-sm text-body-sm text-primary flex items-center">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span> 2.4%
                  </span>
                </div>
              </div>
              
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border border-slate-100 flex-1 flex flex-col justify-center">
                <p className="font-label-caps text-label-caps text-secondary mb-2">Total Absences (This Month)</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="font-h1 text-h1 text-on-surface">142</h2>
                  <span className="font-body-sm text-body-sm text-error flex items-center">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span> 5.1%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-surface-bright">
              <h3 className="font-h3 text-h3 text-on-surface">Class Attendance Summary</h3>
              <button className="flex items-center gap-1 px-4 py-2 border border-primary text-primary font-button text-button rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-label-caps text-label-caps text-secondary border-b border-slate-100">
                    <th className="py-4 px-6 font-semibold">Class Name</th>
                    <th className="py-4 px-6 font-semibold">Ustaz</th>
                    <th className="py-4 px-6 font-semibold">Total Students</th>
                    <th className="py-4 px-6 font-semibold">Attendance Rate</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm text-on-surface">
                  <tr className="border-b border-slate-100 hover:bg-surface-bright transition-colors">
                    <td className="py-4 px-6 font-medium">Tajweed Fundamentals</td>
                    <td className="py-4 px-6">Ust. Ahmad Ali</td>
                    <td className="py-4 px-6">24</td>
                    <td className="py-4 px-6">92%</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed-dim/20 text-primary-container font-label-caps text-[10px]">
                        Excellent
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-surface-bright transition-colors">
                    <td className="py-4 px-6 font-medium">Fiqh for Beginners</td>
                    <td className="py-4 px-6">Ust. Zainab Noor</td>
                    <td className="py-4 px-6">18</td>
                    <td className="py-4 px-6">85%</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed-dim/30 text-secondary font-label-caps text-[10px]">
                        Good
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-surface-bright transition-colors">
                    <td className="py-4 px-6 font-medium">Advanced Seerah</td>
                    <td className="py-4 px-6">Ust. Omar Farooq</td>
                    <td className="py-4 px-6">30</td>
                    <td className="py-4 px-6">78%</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-caps text-[10px]">
                        Needs Attention
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}