"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SiteSettings } from "@/types/database";

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      if (data) {
        setSettings(data);
      }
    };
    fetchSettings();
  }, []);

  return (
    <NextThemesProvider {...props}>
      {settings && (
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --theme-bg: ${settings.light_bg_color || '#ffffff'};
              --theme-text: ${settings.light_text_color || '#000000'};
              --theme-primary: ${settings.light_primary_color || '#0ea5e9'};
            }
            .dark {
              --theme-bg: ${settings.dark_bg_color || '#0a0a0a'};
              --theme-text: ${settings.dark_text_color || '#ffffff'};
              --theme-primary: ${settings.dark_primary_color || '#22d3ee'};
            }
            
            body {
              background-color: var(--theme-bg);
              color: var(--theme-text);
            }
          `
        }} />
      )}
      {children}
    </NextThemesProvider>
  );
}
