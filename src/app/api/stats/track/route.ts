import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { path, userAgent } = await request.json();

    // 1. Identify device and browser from userAgent
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const isTablet = /iPad/i.test(userAgent) || (isMobile && window?.innerWidth > 768); // Simple check
    const isDesktop = !isMobile && !isTablet;

    const isChrome = /Chrome/i.test(userAgent) && !/Edge|Edg/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    const isFirefox = /Firefox/i.test(userAgent);
    const isEdge = /Edge|Edg/i.test(userAgent);

    // 2. Update traffic_stats (Per Page)
    const { data: pageStat, error: pageError } = await supabase
      .from('traffic_stats')
      .select('*')
      .eq('path', path)
      .single();

    if (!pageStat) {
      await supabase.from('traffic_stats').insert({
        path,
        view_count: 1,
        desktop_count: isDesktop ? 1 : 0,
        mobile_count: isMobile ? 1 : 0,
        tablet_count: isTablet ? 1 : 0,
        chrome_count: isChrome ? 1 : 0,
        safari_count: isSafari ? 1 : 0,
        firefox_count: isFirefox ? 1 : 0,
        edge_count: isEdge ? 1 : 0,
        others_count: (!isChrome && !isSafari && !isFirefox && !isEdge) ? 1 : 0
      });
    } else {
      await supabase
        .from('traffic_stats')
        .update({
          view_count: pageStat.view_count + 1,
          desktop_count: isDesktop ? pageStat.desktop_count + 1 : pageStat.desktop_count,
          mobile_count: isMobile ? pageStat.mobile_count + 1 : pageStat.mobile_count,
          tablet_count: isTablet ? pageStat.tablet_count + 1 : pageStat.tablet_count,
          chrome_count: isChrome ? pageStat.chrome_count + 1 : pageStat.chrome_count,
          safari_count: isSafari ? pageStat.safari_count + 1 : pageStat.safari_count,
          firefox_count: isFirefox ? pageStat.firefox_count + 1 : pageStat.firefox_count,
          edge_count: isEdge ? pageStat.edge_count + 1 : pageStat.edge_count,
          others_count: (!isChrome && !isSafari && !isFirefox && !isEdge) ? pageStat.others_count + 1 : pageStat.others_count,
          last_viewed: new Date().toISOString()
        })
        .eq('path', path);
    }

    // 3. Update daily_traffic
    const today = new Date().toISOString().split('T')[0];
    const { data: dailyStat } = await supabase
      .from('daily_traffic')
      .select('*')
      .eq('date', today)
      .single();

    if (!dailyStat) {
      await supabase.from('daily_traffic').insert({
        date: today,
        view_count: 1,
        unique_users: 1
      });
    } else {
      await supabase
        .from('daily_traffic')
        .update({
          view_count: dailyStat.view_count + 1,
          // Simple unique user logic (could be improved with cookies/IP)
          unique_users: dailyStat.unique_users + 1 
        })
        .eq('date', today);
    }

    // 4. Update legacy site_stats (monthly)
    const monthYear = today.substring(0, 7); // YYYY-MM
    const { data: monthStat } = await supabase
      .from('site_stats')
      .select('*')
      .eq('month_year', monthYear)
      .single();
    
    if (monthStat) {
      await supabase
        .from('site_stats')
        .update({ view_count: monthStat.view_count + 1 })
        .eq('month_year', monthYear);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Stats Track Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
