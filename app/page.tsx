import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";

export default function Dashboard() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper (Pushed to the right by the width of the sidebar) */}
      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Sticky Top Nav */}
        <TopNavBar />

        {/* Dashboard Canvas */}
        <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="font-h2 text-h2 text-on-background mb-1">
                Dashboard Overview
              </h2>
              <p className="font-body-sm text-body-sm text-secondary">
                Assalamu alaikum, here is the summary for today.
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low font-button text-button py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Student
              </button>
              <button className="bg-primary text-on-primary hover:bg-primary-container font-button text-button py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-ambient">
                <span className="material-symbols-outlined text-sm">fact_check</span>
                Take Attendance
              </button>
            </div>
          </div>

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-ambient border border-surface-container-highest flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined filled">school</span>
                </div>
                <span className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-1 rounded">
                  ACTIVE
                </span>
              </div>
              <div>
                <p className="font-body-sm text-body-sm text-secondary mb-1">Total Students</p>
                <h3 className="font-h1 text-h1 text-on-background">120</h3>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-ambient border border-surface-container-highest flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-bl-full -z-10"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined filled">person_book</span>
                </div>
              </div>
              <div>
                <p className="font-body-sm text-body-sm text-secondary mb-1">Total Ustaz</p>
                <h3 className="font-h1 text-h1 text-on-background">15</h3>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-ambient border border-surface-container-highest flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/20 rounded-bl-full -z-10"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined filled">how_to_reg</span>
                </div>
                <span className="font-label-caps text-label-caps text-primary-container bg-primary-fixed/30 px-2 py-1 rounded">
                  +2%
                </span>
              </div>
              <div>
                <p className="font-body-sm text-body-sm text-secondary mb-1">Today Attendance</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-h1 text-h1 text-on-background">95</h3>
                  <span className="font-body-md text-body-md text-secondary">/ 120</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-surface-container h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "79%" }}></div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-ambient border border-surface-container-highest flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/30 rounded-bl-full -z-10"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined filled">class</span>
                </div>
              </div>
              <div>
                <p className="font-body-sm text-body-sm text-secondary mb-1">Active Classes</p>
                <h3 className="font-h1 text-h1 text-on-background">8</h3>
              </div>
            </div>
          </div>

          {/* Bento Layout Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            
            {/* Main Table Section (Span 2) */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-container-highest overflow-hidden flex flex-col">
              <div className="p-md lg:p-lg border-b border-surface-container-highest flex justify-between items-center bg-surface-bright">
                <h3 className="font-h3 text-h3 text-on-background">Recent Attendance</h3>
                <button className="font-button text-button text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low font-label-caps text-label-caps text-secondary border-b border-surface-container-highest">
                      <th className="py-4 px-6 font-semibold">Student Name</th>
                      <th className="py-4 px-6 font-semibold">Class</th>
                      <th className="py-4 px-6 font-semibold">Time</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm">
                    {/* Row 1 */}
                    <tr className="border-b border-surface-container-highest hover:bg-surface transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                          ZA
                        </div>
                        <span className="font-medium text-on-background">Zaid Abdullah</span>
                      </td>
                      <td className="py-4 px-6 text-secondary">Tajweed 101</td>
                      <td className="py-4 px-6 text-secondary">08:00 AM</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold bg-primary-fixed/20 text-primary-container">
                          PRESENT
                        </span>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="border-b border-surface-container-highest hover:bg-surface transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                          FR
                        </div>
                        <span className="font-medium text-on-background">Fatima Rahman</span>
                      </td>
                      <td className="py-4 px-6 text-secondary">Fiqh Foundations</td>
                      <td className="py-4 px-6 text-secondary">08:15 AM</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold bg-secondary-container/50 text-secondary">
                          LATE
                        </span>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="border-b border-surface-container-highest hover:bg-surface transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                          OI
                        </div>
                        <span className="font-medium text-on-background">Omar Ibrahim</span>
                      </td>
                      <td className="py-4 px-6 text-secondary">Hifz Class A</td>
                      <td className="py-4 px-6 text-secondary">--:--</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold bg-error-container text-on-error-container">
                          ABSENT
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Info Widget */}
            <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-container-highest p-lg flex flex-col gap-6">
              <div>
                <h3 className="font-h3 text-h3 text-on-background mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-body-sm text-body-sm text-secondary">Present</span>
                    </div>
                    <span className="font-body-md text-body-md font-medium text-on-background">79%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="font-body-sm text-body-sm text-secondary">Late</span>
                    </div>
                    <span className="font-body-md text-body-md font-medium text-on-background">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-error"></div>
                      <span className="font-body-sm text-body-sm text-secondary">Absent</span>
                    </div>
                    <span className="font-body-md text-body-md font-medium text-on-background">9%</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto bg-surface-container-low rounded-lg p-md border border-surface-container-highest relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl">mosque</span>
                </div>
                <h4 className="font-h3 text-h3 text-on-background mb-2 text-sm relative z-10">Today's Reminder</h4>
                <p className="font-body-sm text-body-sm text-secondary relative z-10 italic">
                  "Seeking knowledge is an obligation upon every Muslim."
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}