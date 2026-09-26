export type LeadIntent =
  | 'launch_kit'
  | 'buyer_pack'
  | 'cost_sheet'
  | 'floor_plan'
  | 'location_report'
  | 'price_update'
  | 'offer_update'
  | 'site_visit'
  | 'callback'
  | 'project_updates'
  | 'rera_update'
  | 'amenities_update'
  | '2bhk'
  | '3bhk'
  | '4bhk'
  | 'advisor_call';

export interface LeadSubmission {
  id: string;
  name: string;
  mobile: string;
  leadIntent: LeadIntent | string;
  sourceSection?: string;
  leadConfiguration?: string;
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
  | 'cta_view'
  | 'cta_click'
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
  | 'mobile_entered'
  | 'lead_submit'
  | 'lead_success'
  | 'qualification_step'
  | 'secondary_qualification_complete'
  | 'scroll_25'
  | 'scroll_50'
  | 'scroll_75'
  | 'scroll_90';
