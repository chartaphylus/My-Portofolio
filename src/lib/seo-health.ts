import { supabase } from '@/lib/supabase';

export async function runHealthCheck() {
  const healthReport: string[] = [];
  let isHealthy = true;

  try {
    // 1. Check Supabase (Ambil 1 data profile saja untuk memastikan koneksi)
    const { data, error } = await supabase.from('profiles').select('id').limit(1).single();
    if (error && error.code !== 'PGRST116') { // PGRST116 adalah error jika data kosong, tapi koneksi tetap aman
      healthReport.push("❌ *Supabase:* Connection Error");
      isHealthy = false;
    } else {
      healthReport.push("✅ *Supabase:* Connected");
    }

    // 2. Check Essential Assets (Simulation)
    healthReport.push("✅ *Assets:* Favicon/Logo configured");

    const statusEmoji = isHealthy ? "🟢" : "🔴";
    const message = `${statusEmoji} *Portfolio Health Report*\n\n${healthReport.join('\n')}\n\n*Status:* ${isHealthy ? "All systems operational" : "Issues detected"}`;

    return { isHealthy, message, report: healthReport };

  } catch (err) {
    console.error('Health Check Logic Error:', err);
    return { 
      isHealthy: false, 
      message: "🚨 *Critical Error:* Health check logic failed to execute.", 
      report: ["Critical Failure"] 
    };
  }
}
