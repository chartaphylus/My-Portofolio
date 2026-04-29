"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  FiMonitor, 
  FiSmartphone, 
  FiTablet, 
  FiGlobe, 
  FiExternalLink, 
  FiRefreshCw, 
  FiTrendingUp,
  FiArrowUpRight,
  FiLayout,
  FiCompass,
  FiChrome
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    education: 0,
    certificates: 0,
    views: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [browserData, setBrowserData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: projCount },
        { count: expCount },
        { count: eduCount },
        { count: certCount },
        { data: viewStats },
        { data: dailyData },
        { data: pageStats }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
        supabase.from('certifications').select('*', { count: 'exact', head: true }),
        supabase.from('site_stats').select('*').order('month_year', { ascending: true }),
        supabase.from('daily_traffic').select('*').order('date', { ascending: false }).limit(7),
        supabase.from('traffic_stats').select('*').order('view_count', { ascending: false }).limit(5)
      ]);

      const totalViews = viewStats?.reduce((acc, curr) => acc + curr.view_count, 0) || 0;

      // Format real daily data
      const formattedDailyData = (dailyData || []).reverse().map(d => ({
        name: new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short' }),
        views: d.view_count,
        users: d.unique_users
      }));

      // Aggregate device and browser data from all pages
      const devices = { desktop: 0, mobile: 0, tablet: 0 };
      const browsers = { chrome: 0, safari: 0, firefox: 0, edge: 0, others: 0 };
      
      const { data: allPageStats } = await supabase.from('traffic_stats').select('*');
      
      allPageStats?.forEach(p => {
        devices.desktop += p.desktop_count || 0;
        devices.mobile += p.mobile_count || 0;
        devices.tablet += p.tablet_count || 0;
        browsers.chrome += p.chrome_count || 0;
        browsers.safari += p.safari_count || 0;
        browsers.firefox += p.firefox_count || 0;
        browsers.edge += p.edge_count || 0;
        browsers.others += p.others_count || 0;
      });

      const totalDeviceViews = (devices.desktop + devices.mobile + devices.tablet) || 1;
      const devData = [
        { device: 'DESKTOP', percentage: Math.round((devices.desktop / totalDeviceViews) * 100), icon: FiMonitor, color: '#39FF14' },
        { device: 'MOBILE', percentage: Math.round((devices.mobile / totalDeviceViews) * 100), icon: FiSmartphone, color: '#3B82F6' },
        { device: 'TABLET', percentage: Math.round((devices.tablet / totalDeviceViews) * 100), icon: FiTablet, color: '#A855F7' },
      ];

      const totalBrowserViews = (browsers.chrome + browsers.safari + browsers.firefox + browsers.edge + browsers.others) || 1;
      const brData = [
        { name: 'Chrome', percentage: Math.round((browsers.chrome / totalBrowserViews) * 100), icon: FiChrome },
        { name: 'Safari', percentage: Math.round((browsers.safari / totalBrowserViews) * 100), icon: FiCompass },
        { name: 'Firefox', percentage: Math.round((browsers.firefox / totalBrowserViews) * 100), icon: FiGlobe },
        { name: 'Edge', percentage: Math.round((browsers.edge / totalBrowserViews) * 100), icon: FiLayout },
        { name: 'Others', percentage: Math.round((browsers.others / totalBrowserViews) * 100), icon: FiGlobe },
      ];

      setChartData(formattedDailyData);
      setTopPages(pageStats || []);
      setDeviceData(devData);
      setBrowserData(brData);
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

  if (loading) return (
    <div className="h-full pt-10 flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
         <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading analytic dashboard...</span>
       </div>
    </div>
  );

  return (
    <div className="pb-20 space-y-8 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="TRAFFIC & STATISTIK" 
        description="Analisis mendalam mengenai penggunaan dan performa sistem."
        action={
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 bg-white/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400 hover:text-cyan-500 transition-all shadow-lg"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (Tren Pengunjung) */}
        <div className="lg:col-span-2 bg-white/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 flex items-center gap-2">
              <FiTrendingUp className="w-3.5 h-3.5 text-cyan-500" />
              TREN PENGUNJUNG (7 HARI TERAKHIR)
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">TOTAL VIEWS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">UNIQUE USERS</span>
              </div>
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  stroke="#888" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#888" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    fontSize: '10px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Section (Devices + Sessions) */}
        <div className="space-y-6">
          <div className="bg-white/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-8 text-center">DISTRIBUSI PERANGKAT</h3>
            <div className="space-y-8">
              {deviceData.length > 0 ? deviceData.map((item) => (
                <div key={item.device} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 tracking-widest">{item.device}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-500">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center text-[10px] text-gray-500 uppercase tracking-widest font-black">
                  Memuat data perangkat...
                </div>
              )}
            </div>

            <div className="mt-12 pt-10 border-t border-gray-200 dark:border-white/5 text-center">
              <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.25em] mb-3">TOTAL SESI BULAN INI</p>
              <h4 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{stats.views.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        {/* Bottom Left (Popular Pages) */}
        <div className="lg:col-span-2 bg-white/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="p-8 border-b border-gray-200 dark:border-white/5">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">HALAMAN TERPOPULER</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.2em] border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                  <th className="px-8 py-5">HALAMAN ARSIP</th>
                  <th className="px-8 py-5 text-center">TOTAL TAYANGAN</th>
                  <th className="px-8 py-5 text-center">PERUBAHAN</th>
                  <th className="px-8 py-5 text-right">PREVIEW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {topPages.length > 0 ? topPages.map((page, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400/90 tracking-tight">{page.path}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-[12px] font-black text-gray-900 dark:text-white">{(page.view_count || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full">+12%</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <a href={page.path} target="_blank" className="inline-flex p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all">
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-500 uppercase text-[10px] font-black tracking-widest">
                      Belum ada data traffic.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Right (Top Browsers) */}
        <div className="bg-white/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-10">
            <FiGlobe className="w-4 h-4 text-purple-500" />
            TOP BROWSERS
          </h3>
          <div className="space-y-7">
            {browserData.length > 0 ? browserData.map((browser) => (
              <div key={browser.name} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-transparent group-hover:border-gray-200 dark:group-hover:border-white/10 transition-colors">
                    <browser.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">{browser.name}</span>
                </div>
                <span className="text-[11px] font-mono font-black text-gray-700 dark:text-gray-300">{browser.percentage}%</span>
              </div>
            )) : (
              <div className="py-10 text-center text-[10px] text-gray-500 uppercase tracking-widest font-black">
                Memuat data browser...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions (Repositioned) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="border border-gray-200 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-black/40 backdrop-blur-xl p-8">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
             Quick Actions
           </h3>
           <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Add Project', sub: 'Deploy a new item', color: 'cyan', link: '/admin/projects' },
                { label: 'Update Experience', sub: 'Add chronological records', color: 'purple', link: '/admin/experience' },
                { label: 'Edit Profile', sub: 'Modify biographical info', color: 'pink', link: '/admin/profile' },
              ].map((action) => (
                <a key={action.label} href={action.link} className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border border-transparent hover:border-cyan-500/30 transition-all duration-300">
                   <div>
                     <p className={`text-sm font-semibold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors`}>{action.label}</p>
                     <p className="text-xs text-gray-500">{action.sub}</p>
                   </div>
                   <FiArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
           </div>
        </div>

        <div className="border border-gray-200 dark:border-white/10 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#0A0A0A] p-8 shadow-inner">
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
  );
}
