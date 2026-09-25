import { AnalyticsEventType, LeadSubmission } from '../types';

export function getUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key.toLowerCase()] = value;
  });
  return params;
}

export function getAttributionData() {
  const currentParams = getUrlParams();
  
  // Check session storage for existing attribution
  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('estatewise_ppc_attribution') : null;
  const initialAttribution = stored ? JSON.parse(stored) : {};

  const attribution = {
    utmSource: currentParams['utm_source'] || initialAttribution.utmSource || 'direct',
    utmMedium: currentParams['utm_medium'] || initialAttribution.utmMedium || 'none',
    utmCampaign: currentParams['utm_campaign'] || initialAttribution.utmCampaign || '',
    utmTerm: currentParams['utm_term'] || currentParams['keyword'] || initialAttribution.utmTerm || '',
    utmContent: currentParams['utm_content'] || initialAttribution.utmContent || '',
    gclid: currentParams['gclid'] || initialAttribution.gclid || '',
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('estatewise_ppc_attribution', JSON.stringify(attribution));
  }

  return attribution;
}

export function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventType: AnalyticsEventType, payload: Record<string, unknown> = {}) {
  const eventData = {
    event: eventType,
    project: 'Prestige Thane',
    timestamp: new Date().toISOString(),
    device: getDeviceType(),
    ...payload,
  };

  if (typeof window !== 'undefined') {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(eventData);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventType, payload);
    }
  }

  // Developer logging for analytics verification
  if (process.env.NODE_ENV !== 'production') {
    // Quiet debug log
    console.debug(`[EstateWise Analytics] ${eventType}:`, payload);
  }
}

export function saveLead(lead: Omit<LeadSubmission, 'id' | 'timestamp' | 'pageUrl' | 'referrer' | 'deviceType'>): LeadSubmission {
  const attribution = getAttributionData();
  const fullLead: LeadSubmission = {
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    deviceType: getDeviceType(),
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    utmTerm: attribution.utmTerm,
    utmContent: attribution.utmContent,
    gclid: attribution.gclid,
    ...lead,
  };

  try {
    const existingRaw = localStorage.getItem('estatewise_prestige_leads');
    const existing: LeadSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(fullLead);
    localStorage.setItem('estatewise_prestige_leads', JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save lead locally:', err);
  }

  trackEvent('lead_success', {
    leadId: fullLead.id,
    intent: fullLead.leadIntent,
    source: fullLead.sourceSection,
  });

  return fullLead;
}

export function updateLeadSecondary(leadId: string, updates: { configurationInterested?: string; timeframe?: string }) {
  try {
    const existingRaw = localStorage.getItem('estatewise_prestige_leads');
    if (!existingRaw) return;
    const existing: LeadSubmission[] = JSON.parse(existingRaw);
    const index = existing.findIndex((l) => l.id === leadId);
    if (index !== -1) {
      existing[index] = { ...existing[index], ...updates };
      localStorage.setItem('estatewise_prestige_leads', JSON.stringify(existing));
      trackEvent('secondary_qualification_complete', {
        leadId,
        ...updates,
      });
    }
  } catch (err) {
    console.error('Failed to update lead:', err);
  }
}
