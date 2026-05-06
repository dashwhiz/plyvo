"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  GA_MEASUREMENT_ID,
  isAnalyticsAvailable,
  setAnalyticsOptOut,
  trackPageView,
} from "@/lib/analytics";
import { useSetting } from "@/hooks/useSettings";

export default function Analytics() {
  const pathname = usePathname();
  const analyticsEnabled = useSetting("analyticsEnabled");

  useEffect(() => {
    setAnalyticsOptOut(!analyticsEnabled);
  }, [analyticsEnabled]);

  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname);
  }, [pathname]);

  if (!isAnalyticsAvailable()) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
