export type LeadIntent =
  | 'launch_kit'
  | 'cost_sheet'
  | 'floor_plan'
  | 'location_report'
  | 'price_update'
  | 'offer_update'
  | 'site_visit'
  | 'callback'
  | 'buyer_pack'
  | 'amenities_update';

export interface LeadSubmission {
  id: string;
  name: string;
  mobile: string;
  leadIntent: LeadIntent;
  sourceSection?: string;
  project: string;
  pageUrl: string;
  timestamp: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  referrer: string;
  configurationInterested?: string;
  timeframe?: string;
}

export type AnalyticsEventType =
  | 'hero_cta_click'
  | 'cost_sheet_click'
  | 'floor_plan_click'
  | 'location_report_click'
  | 'buyer_pack_click'
  | 'site_visit_click'
  | 'call_click'
  | 'whatsapp_click'
  | 'form_open'
  | 'form_start'
  | 'lead_submit'
  | 'lead_success'
  | 'secondary_qualification_complete'
  | '50_percent_scroll'
  | '75_percent_scroll'
  | '90_percent_scroll';
