"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    education: 0,
    certificates: 0,
    views: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: projCount },
        { count: expCount },
        { count: eduCount },
        { count: certCount },
        { data: viewStats }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
        supabase.from('certifications').select('*', { count: 'exact', head: true }),
        supabase.from('site_stats').select('*').order('month_year', { ascending: true })
      ]);

      const totalViews = viewStats?.reduce((acc, curr) => acc + curr.view_count, 0) || 0;

      // Format data for chart
      const formattedChartData = (viewStats || []).map(stat => {
        const date = new Date(stat.month_year + '-01');
        return {
          name: date.toLocaleDateString('default', { month: 'short', year: '2-digit' }),
          views: stat.view_count
        };
      });

      setChartData(formattedChartData);
      setStats({
        projects: projCount || 0,
        experience: expCount || 0,
        education: eduCount || 0,
        certificates: certCount || 0,
        views: totalViews
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statItems = [
    { label: "Total Projects", value: stats.projects, color: "from-blue-500 to-cyan-500" },
    { label: "Experience Records", value: stats.experience, color: "from-purple-500 to-pink-500" },
    { label: "Education History", value: stats.education, color: "from-green-500 to-teal-500" },
    { label: "Awards & Certificates", value: stats.certificates, color: "from-orange-500 to-yellow-500" },
  ];

  if (loading) return (
    <div className="h-full pt-10 flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
         <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading comprehensive overview...</span>
       </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <AdminPageHeader 
        title="Dashboard Overview" 
        description="A high-level summary of your portfolio infrastructure and visitor analytics."
        action={
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-semibold text-green-600 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Live
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statItems.map((item, i) => (
          <div key={i} className="relative p-6 border border-white/10 dark:border-white/5 rounded-3xl bg-white/50 dark:bg-black/40 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-white/5 overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
             <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity`}></div>
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 relative z-10">{item.label}</p>
             <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white relative z-10">
               {item.value}
             </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 border border-white/10 dark:border-white/5 rounded-3xl bg-white/50 dark:bg-black/40 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-white/5 p-8 flex flex-col">
           <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
             <div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Visitor Analytics</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400">Total profile views over time</p>
             </div>
             <div className="text-right">
               <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
               <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                 {stats.views}
               </h3>
             </div>
           </div>
           
           <div className="flex-1 min-h-[300px] w-full relative">
             {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                   <Tooltip 
                     cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                     contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                   />
                   <Bar dataKey="views" fill="url(#colorViews)" radius={[6, 6, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                 No view data available yet.
               </div>
             )}
           </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-8">
          <div className="border border-white/10 dark:border-white/5 rounded-3xl bg-white/50 dark:bg-black/40 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-white/5 p-8">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
               Quick Actions
             </h3>
             <div className="space-y-4">
                <a href="/admin/projects" className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border border-transparent hover:border-cyan-500/30 transition-all duration-300">
                   <div>
                     <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">Add Project</p>
                     <p className="text-xs text-gray-500">Deploy a new portfolio item</p>
                   </div>
                   <span className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1A] flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors">→</span>
                </a>
                <a href="/admin/experience" className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border border-transparent hover:border-purple-500/30 transition-all duration-300">
                   <div>
                     <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">Update Experience</p>
                     <p className="text-xs text-gray-500">Add chronological records</p>
                   </div>
                   <span className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1A] flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">→</span>
                </a>
                <a href="/admin/profile" className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border border-transparent hover:border-pink-500/30 transition-all duration-300">
                   <div>
                     <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">Edit Profile</p>
                     <p className="text-xs text-gray-500">Modify biographical info</p>
                   </div>
                   <span className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1A] flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">→</span>
                </a>
             </div>
          </div>

          <div className="border border-white/10 dark:border-white/5 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#0A0A0A] shadow-inner p-8">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                 <span className="text-blue-500 text-lg">ℹ️</span>
               </div>
               <h4 className="font-bold text-gray-900 dark:text-white">Storage Policy</h4>
             </div>
             <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
               Direct media upload is enabled. Any deleted items from your repository will automatically cascade and remove associated files from Supabase Storage to maintain efficient capacity.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
