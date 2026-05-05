import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";

export default function AttendancePage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden relative">
        
        <TopNavBar />

        {/* Page Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-12">
          
          {/* Page Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="font-h1 text-h1 text-on-background mb-2">Take Attendance</h2>
              <p className="font-body-md text-body-md text-secondary">
                Record daily attendance for students.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Date Picker */}
              <div className="flex flex-col gap-1 flex-1 sm:min-w-[200px]">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="attendance-date">
                  Date
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-sm text-body-sm text-on-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    id="attendance-date"
                    type="date"
                    defaultValue="2023-10-25"
                  />
                </div>
              </div>
              
              {/* Class Selector */}
              <div className="flex flex-col gap-1 flex-1 sm:min-w-[200px]">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="class-select">
                  Class
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-sm text-body-sm text-on-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
                    id="class-select"
                  >
                    <option>Quranic Studies - Level 1</option>
                    <option>Arabic Language - Level 2</option>
                    <option>Fiqh - Advanced</option>
                    <option>Seerah - Fundamentals</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student List Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
              <h3 className="font-h3 text-h3 text-on-background">Student List</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                <span className="font-body-sm text-body-sm text-secondary mr-4">Present</span>
                
                <span className="w-3 h-3 rounded-full bg-error inline-block"></span>
                <span className="font-body-sm text-body-sm text-secondary mr-4">Absent</span>
                
                <span className="w-3 h-3 rounded-full bg-tertiary inline-block"></span>
                <span className="font-body-sm text-body-sm text-secondary">Late</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary uppercase tracking-wider w-[40%]">Student Name</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary uppercase tracking-wider w-[20%]">ID Number</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  
                  {/* Student Row 1 */}
                  <tr className="hover:bg-surface-bright transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-button text-button">
                          AA
                        </div>
                        <span className="font-body-md text-body-md text-on-background font-medium">Ahmad Abdullah</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-body-sm text-secondary">STU-1042</td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden bg-surface-container-lowest">
                        <button className="px-4 py-2 bg-primary/10 text-primary font-button text-button hover:bg-primary/20 transition-colors border-r border-outline-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Present
                        </button>
                        <button className="px-4 py-2 text-secondary font-button text-button hover:bg-surface-container-highest transition-colors border-r border-outline-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Absent
                        </button>
                        <button className="px-4 py-2 text-secondary font-button text-button hover:bg-surface-container-highest transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">schedule</span> Late
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Student Row 2 */}
                  <tr className="hover:bg-surface-bright transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-button text-button">
                          FZ
                        </div>
                        <span className="font-body-md text-body-md text-on-background font-medium">Fatima Zahra</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-body-sm text-secondary">STU-1045</td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden bg-surface-container-lowest">
                        <button className="px-4 py-2 bg-primary/10 text-primary font-button text-button hover:bg-primary/20 transition-colors border-r border-outline-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Present
                        </button>
                        <button className="px-4 py-2 text-secondary font-button text-button hover:bg-surface-container-highest transition-colors border-r border-outline-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Absent
                        </button>
                        <button className="px-4 py-2 text-secondary font-button text-button hover:bg-surface-container-highest transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">schedule</span> Late
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Student Row 3 */}
                  <tr className="hover:bg-surface-bright transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-button text-button">
                          OK
                        </div>
                        <span className="font-body-md text-body-md text-on-background font-medium">Omar Khalid</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-body-sm text-secondary">STU-1051</td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden bg-surface-container-lowest">
                        <button className="px-4 py-2 text-secondary font-button text-button hover:bg-surface-container-highest transition-colors border-r border-outline-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Present
                        </button>
                        <button className="px-4 py-2 bg-error/10 text-error font-button text-button hover:bg-error/20 transition-colors border-r border-outline-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Absent
                        </button>
                        <button className="px-4 py-2 text-secondary font-button text-button hover:bg-surface-container-highest transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">schedule</span> Late
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Student Row 4 */}
                  <tr className="hover:bg-surface-bright transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-button text-button">
                          ZB
                        </div>
                        <span className="font-body-md text-body-md text-on-background font-medium">Zainab Bilal</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-body-sm text-secondary">STU-1062</td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex rounded-lg border border-outline-variant overflow-hidden bg-surface-container-lowest">
                        <button className="px-4 py-2 text-secondary font-button text-button hover:bg-surface-container-highest transition-colors border-r border-outline-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Present
                        </button>
                        <button className="px-4 py-2 text-secondary font-button text-button hover:bg-surface-container-highest transition-colors border-r border-outline-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">cancel</span> Absent
                        </button>
                        <button className="px-4 py-2 bg-tertiary/10 text-tertiary-container font-button text-button hover:bg-tertiary/20 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">schedule</span> Late
                        </button>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-end mt-auto pt-6 border-t border-outline-variant">
            <button className="bg-primary hover:bg-primary-container text-on-primary font-button text-button py-3 px-8 rounded-lg shadow-ambient transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">save</span>
              Save Attendance
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}