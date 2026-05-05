import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";

export default function ClassesPage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Page Content */}
        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 overflow-y-auto">
          
          {/* Page Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-h2 text-h2 text-on-surface">Classes Overview</h1>
              <p className="font-body-md text-secondary mt-1">
                Manage your institution's classes, students, and assigned Ustaz.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-1 px-4 py-2 border border-outline-variant text-secondary font-button rounded-full hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Assign Students
              </button>
              <button className="flex items-center gap-1 px-4 py-2 border border-outline-variant text-secondary font-button rounded-full hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[18px]">assignment_ind</span>
                Assign Ustaz
              </button>
              <button className="flex items-center gap-1 px-4 py-2 bg-primary text-on-primary font-button rounded-full hover:bg-surface-tint shadow-ambient transition-all">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Class
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-variant overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-surface-variant">
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary uppercase tracking-wider">Class Name</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary uppercase tracking-wider">Schedule</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary uppercase tracking-wider">Students</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary uppercase tracking-wider">Assigned Ustaz</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-secondary uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  
                  {/* Row 1 */}
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-body-md font-semibold text-on-surface">Foundation Arabic</div>
                      <div className="font-body-sm text-secondary">Level 1</div>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-secondary">Mon, Wed • 09:00 AM</td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps">
                        24 Students
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold text-secondary">
                          AH
                        </div>
                        <span className="font-body-sm text-on-surface">Ustaz Ahmad</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-secondary hover:text-primary transition-colors p-2">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-body-md font-semibold text-on-surface">Tajweed Essentials</div>
                      <div className="font-body-sm text-secondary">Level 2</div>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-secondary">Tue, Thu • 10:30 AM</td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps">
                        18 Students
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold text-secondary">
                          MY
                        </div>
                        <span className="font-body-sm text-on-surface">Ustaza Maryam</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-secondary hover:text-primary transition-colors p-2">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-body-md font-semibold text-on-surface">Advanced Fiqh</div>
                      <div className="font-body-sm text-secondary">Level 4</div>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-secondary">Sat • 08:00 AM</td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps">
                        32 Students
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold text-secondary">
                          OM
                        </div>
                        <span className="font-body-sm text-on-surface">Ustaz Omar</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-secondary hover:text-primary transition-colors p-2">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-body-md font-semibold text-on-surface">Seerah Studies</div>
                      <div className="font-body-sm text-secondary">Level 1</div>
                    </td>
                    <td className="py-4 px-6 font-body-sm text-secondary">Sun • 02:00 PM</td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps">
                        45 Students
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold text-secondary">
                          ZA
                        </div>
                        <span className="font-body-sm text-on-surface">Ustaza Zainab</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-secondary hover:text-primary transition-colors p-2">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="p-4 border-t border-surface-variant flex items-center justify-between text-secondary">
              <span className="font-body-sm">Showing 1 to 4 of 24 entries</span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-surface-variant disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded bg-primary text-on-primary font-button">1</button>
                <button className="w-8 h-8 rounded hover:bg-surface-variant font-button text-on-surface">2</button>
                <button className="w-8 h-8 rounded hover:bg-surface-variant font-button text-on-surface">3</button>
                <button className="p-1 rounded hover:bg-surface-variant">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}