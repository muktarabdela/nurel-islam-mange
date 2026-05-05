import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";

export default function StudentProfilePage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-[1440px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                alt="Student Avatar"
                className="w-24 h-24 rounded-full border-4 border-surface-container-lowest shadow-ambient object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4oQAl2zqqYNtWAnYyKG0JV2Dhf2AIT5G4WVYgfsIE-JuPEg8zmSmHAshxf7xwZLWTo_QNzLSQOvOqHQhiudDm1bXpbvjTsjFSACCaPS8sVEB84uUnIQE8jftUUQsSMyRMwS6FB7ImTqm-Y--D24toyrPBxBonZegxqD96msNPSsU3fRSl1xvRIKssuoVlkD3TUw-zITUqFKle3CvNcDkrWrDLVrn3CIS4hiq6E-yg8SsGR5sLZvNrf97zir1m8KbSceZ82T-R-1Q"
              />
              <div className="text-center sm:text-left">
                <h2 className="font-h1 text-h1 text-on-background mb-2">Ahmad Ibn Omar</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">class</span>
                  <span className="font-body-md text-body-md">Year 4 - Hifz Advanced</span>
                  <span className="mx-2 text-outline-variant hidden sm:inline">•</span>
                  <span className="px-3 py-1 bg-primary-container/10 text-primary rounded-full font-label-caps text-label-caps">
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
              <button className="flex items-center gap-2 px-4 py-2 border border-secondary text-secondary rounded-lg font-button text-button hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-button text-button hover:bg-primary/90 transition-colors shadow-ambient">
                <span className="material-symbols-outlined text-[18px]">message</span>
                Contact Guardian
              </button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Section 1: Basic Information */}
            <div className="lg:col-span-1 bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-slate-100 h-fit">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  Basic Information
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-label-caps text-label-caps text-secondary mb-1">Student ID</p>
                  <p className="font-body-md text-body-md text-on-background">STU-2023-0482</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-secondary mb-1">Date of Birth</p>
                  <p className="font-body-md text-body-md text-on-background">15 Rajab 1434 (25 May 2013)</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-secondary mb-1">Guardian Contact</p>
                  <p className="font-body-md text-body-md text-on-background">+60 12-345 6789 (Father)</p>
                  <p className="font-body-md text-body-md text-on-background mt-1">omar.abdullah@email.com</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-secondary mb-1">Address</p>
                  <p className="font-body-md text-body-md text-on-background">
                    123 Jalan Setia Murni,<br />
                    Bukit Damansara,<br />
                    50490 Kuala Lumpur
                  </p>
                </div>
              </div>
            </div>

            {/* Main Column (Attendance & Notes) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Section 2: Attendance History */}
              <div className="bg-surface-container-lowest rounded-xl shadow-ambient border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-surface-bright">
                  <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">calendar_month</span>
                    Recent Attendance
                  </h3>
                  <button className="font-button text-button text-primary hover:underline">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto p-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="py-3 px-4 font-label-caps text-label-caps text-secondary">Date</th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-secondary">Class</th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-secondary">Status</th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-secondary">Time In</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm">
                      <tr className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 text-on-background">Today, 24 Oct</td>
                        <td className="py-3 px-4 text-secondary">Hifz Advanced</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-3 py-1 bg-primary-container/10 text-primary rounded-full font-label-caps text-label-caps gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Present
                          </span>
                        </td>
                        <td className="py-3 px-4 text-secondary">07:45 AM</td>
                      </tr>
                      <tr className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 text-on-background">Yesterday, 23 Oct</td>
                        <td className="py-3 px-4 text-secondary">Hifz Advanced</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-3 py-1 bg-primary-container/10 text-primary rounded-full font-label-caps text-label-caps gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Present
                          </span>
                        </td>
                        <td className="py-3 px-4 text-secondary">07:50 AM</td>
                      </tr>
                      <tr className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 text-on-background">22 Oct 2023</td>
                        <td className="py-3 px-4 text-secondary">Hifz Advanced</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-3 py-1 bg-error-container text-on-error-container rounded-full font-label-caps text-label-caps gap-1">
                            <span className="material-symbols-outlined text-[14px]">cancel</span> Absent
                          </span>
                        </td>
                        <td className="py-3 px-4 text-secondary">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Behavior Notes */}
              <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-6 border border-slate-100">
                <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
                  <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">menu_book</span>
                    Behavior &amp; Progress Notes
                  </h3>
                </div>
                
                {/* Notes List */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-lg bg-surface-bright border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-body-sm text-body-sm font-semibold text-on-background">Ustaz Ibrahim</span>
                        <span className="text-secondary font-label-caps text-label-caps px-2 py-0.5 bg-secondary-container/50 rounded">Hifz Class</span>
                      </div>
                      <span className="text-secondary font-label-caps text-label-caps whitespace-nowrap ml-2">2 Days Ago</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Ahmad has shown excellent progress in memorizing Surah Al-Mulk. His tajweed is improving steadily. Needs to focus a bit more during the afternoon revision session.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-surface-bright border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-body-sm text-body-sm font-semibold text-on-background">Ustazah Aminah</span>
                        <span className="text-secondary font-label-caps text-label-caps px-2 py-0.5 bg-tertiary-container/20 rounded">Akhlaq Class</span>
                      </div>
                      <span className="text-secondary font-label-caps text-label-caps whitespace-nowrap ml-2">1 Week Ago</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Very helpful with younger students today. Demonstrated good leadership qualities during group activities.
                    </p>
                  </div>
                </div>

                {/* Add Note Form */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="font-body-md text-body-md font-semibold text-on-background mb-3">Add New Note</h4>
                  <form className="flex flex-col gap-3">
                    <textarea 
                      className="w-full p-4 border border-outline-variant rounded-lg bg-surface-container-lowest text-body-sm font-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-none shadow-sm" 
                      placeholder="Write a note regarding behavior, progress, or general observation..." 
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button 
                        className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-button text-button hover:bg-primary/90 transition-colors shadow-ambient flex items-center gap-2" 
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Save Note
                      </button>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}