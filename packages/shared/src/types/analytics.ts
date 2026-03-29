export interface AnalyticsEvent {
  id: string;
  projectId: string;
  sessionId: string;
  visitorId: string;
  eventType: string;
  eventName: string | null;
  pagePath: string | null;
  pageTitle: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  screenWidth: number | null;
  customProperties: Record<string, any>;
  createdAt: Date;
}
