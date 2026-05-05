import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";

export default function UstazPage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
            
            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="font-h1 text-h1 text-on-background mb-2">Ustaz Management</h1>
                <p className="font-body-md text-on-surface-variant">
                  Manage teaching staff, assignments, and status.
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 rounded-lg border border-outline text-on-surface font-button text-button hover:bg-surface-container-low transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined">filter_list</span>
                  Filter
                </button>
                <button className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-button text-button hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2">
                  <span className="material-symbols-outlined">add</span>
                  Add Ustaz
                </button>
              </div>
            </div>

            {/* Bento Data Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Total Ustaz</span>
                  <span className="material-symbols-outlined text-primary">group</span>
                </div>
                <span className="font-h2 text-h2 text-on-background">42</span>
                <div className="mt-auto pt-2 border-t border-slate-50 flex items-center gap-1 text-sm text-primary">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  <span className="font-body-sm font-medium">3 added this month</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Active Classes</span>
                  <span className="material-symbols-outlined text-primary">class</span>
                </div>
                <span className="font-h2 text-h2 text-on-background">128</span>
                <div className="mt-auto pt-2 border-t border-slate-50 flex items-center gap-1 font-body-sm text-on-surface-variant">
                  <span>Across 4 departments</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Leave Requests</span>
                  <span className="material-symbols-outlined text-error">event_busy</span>
                </div>
                <span className="font-h2 text-h2 text-on-background">2</span>
                <div className="mt-auto pt-2 border-t border-slate-50 flex items-center gap-1 text-sm text-error">
                  <span className="font-body-sm font-medium">Pending approval</span>
                </div>
              </div>
            </div>

            {/* Main Data Table */}
            <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-white gap-4">
                <h3 className="font-h3 text-h3 text-on-surface">Ustaz Directory</h3>
                <div className="relative w-full md:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-variant rounded-lg font-body-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                    placeholder="Search by name or phone..."
                    type="text"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant">Full Name</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant">Contact</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant">Assigned Classes</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant">Status</th>
                      <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    
                    {/* Row 1 */}
                    <tr className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-button font-bold">
                            AH
                          </div>
                          <div>
                            <div className="font-body-md font-medium text-on-surface">Ahmad Hassan</div>
                            <div className="font-body-sm text-on-surface-variant">Head of Fiqh</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-body-sm text-on-surface-variant">
                        <div>+60 12-345 6789</div>
                        <div className="text-xs text-outline">ahmad.h@al-ilm.edu</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-body-sm text-xs">Fiqh 101</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-body-sm text-xs">Usul Fiqh</span>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-container text-on-surface-variant font-body-sm text-xs">+2</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary font-body-sm text-xs font-medium border border-primary-container/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-tertiary hover:text-primary hover:bg-surface-container rounded-md transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button className="p-1.5 text-tertiary hover:text-error hover:bg-error-container/50 rounded-md transition-colors" title="Delete">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-button font-bold">
                            MZ
                          </div>
                          <div>
                            <div className="font-body-md font-medium text-on-surface">Muhammad Zulkifli</div>
                            <div className="font-body-sm text-on-surface-variant">Quranic Studies</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-body-sm text-on-surface-variant">
                        <div>+60 19-876 5432</div>
                        <div className="text-xs text-outline">m.zulkifli@al-ilm.edu</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-body-sm text-xs">Tajweed</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-body-sm text-xs">Hifz Adv</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary font-body-sm text-xs font-medium border border-primary-container/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-tertiary hover:text-primary hover:bg-surface-container rounded-md transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button className="p-1.5 text-tertiary hover:text-error hover:bg-error-container/50 rounded-md transition-colors" title="Delete">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-button font-bold">
                            SA
                          </div>
                          <div>
                            <div className="font-body-md font-medium text-on-surface">Syed Abdullah</div>
                            <div className="font-body-sm text-on-surface-variant">Islamic History</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-body-sm text-on-surface-variant">
                        <div>+60 11-222 3333</div>
                        <div className="text-xs text-outline">s.abdullah@al-ilm.edu</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-body-sm text-xs">Seerah Y1</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-body-sm text-xs font-medium border border-outline-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                          On Leave
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-tertiary hover:text-primary hover:bg-surface-container rounded-md transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button className="p-1.5 text-tertiary hover:text-error hover:bg-error-container/50 rounded-md transition-colors" title="Delete">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                <span className="font-body-sm text-on-surface-variant">Showing 1 to 3 of 42 entries</span>
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-tertiary hover:bg-surface-container disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary-container text-on-primary-container font-button text-sm">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface hover:bg-surface-container font-button text-sm">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface hover:bg-surface-container font-button text-sm">3</button>
                  <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md text-tertiary hover:bg-surface-container">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}