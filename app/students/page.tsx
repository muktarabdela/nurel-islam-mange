import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";

export default function StudentsPage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Main Content Area */}
        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full overflow-y-auto">
          
          {/* Page Header & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="font-h2 text-h2 text-on-surface mb-1">Students Management</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Manage enrollments, assign classes, and monitor student status.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-button hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-button hover:bg-surface-tint transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Student
              </button>
            </div>
          </div>

          {/* Data Table Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-surface-container-highest overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest">
                    <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Full Name</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Parent Phone</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Class</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-on-surface">
                  
                  {/* Row 1 */}
                  <tr className="border-b border-surface-container-highest hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold font-body-sm">
                          Y
                        </div>
                        <div>
                          <p className="font-medium">Yusuf Rahman</p>
                          <p className="text-on-surface-variant font-body-sm text-sm">ID: STU-2023-001</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">+1 (555) 123-4567</td>
                    <td className="py-4 px-6">Tajweed Advanced</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-container/20 text-primary">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="text-on-surface-variant hover:text-error transition-colors p-1 ml-2">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="border-b border-surface-container-highest hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold font-body-sm">
                          A
                        </div>
                        <div>
                          <p className="font-medium">Aisha Malik</p>
                          <p className="text-on-surface-variant font-body-sm text-sm">ID: STU-2023-042</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">+1 (555) 987-6543</td>
                    <td className="py-4 px-6">Hifz Level 1</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-container/20 text-primary">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="text-on-surface-variant hover:text-error transition-colors p-1 ml-2">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="border-b border-surface-container-highest hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold font-body-sm">
                          O
                        </div>
                        <div>
                          <p className="font-medium text-on-surface-variant">Omar Farooq</p>
                          <p className="text-on-surface-variant font-body-sm text-sm">ID: STU-2022-118</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">+1 (555) 333-2222</td>
                    <td className="py-4 px-6 text-on-surface-variant">Seerah Basics</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant">
                        Inactive
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors p-1">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="text-on-surface-variant hover:text-error transition-colors p-1 ml-2">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-surface-container-highest flex items-center justify-between">
              <p className="font-body-sm text-on-surface-variant">Showing 1 to 3 of 156 students</p>
              <div className="flex gap-2">
                <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}