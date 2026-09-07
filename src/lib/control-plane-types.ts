export interface AccountUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: "active" | "suspended" | "closed";
  role: "owner" | "admin" | "member";
  planKey: string;
  subscriptionStatus: "active" | "trialing" | "past_due" | "canceled" | "inactive";
  monthlyCreditGrant: number;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface AccountIdentity {
  user: AccountUser;
  organization: Organization;
}

export interface CreditSummary {
  balance: number;
  lifetimeGranted: number;
  lifetimeConsumed: number;
}

export interface UsageTotals {
  requests: number;
  recordsReturned: number;
  creditsConsumed: number;
}

export interface DailyUsage {
  day: string;
  requests: number;
  records_returned: number;
  credits_consumed: number;
}

export interface ProductUsage {
  product: string;
  requests: number;
  records_returned: number;
  credits_consumed: number;
}

export interface RecentUsage {
  request_id: string;
  product: string;
  operation: string;
  endpoint: string;
  records_returned: number;
  credits_consumed: number;
  status_code: number;
  latency_ms: number;
  created_at: string;
}

export interface UsageSummary {
  periodDays: number;
  totals: UsageTotals;
  activeApiKeys: number;
  daily: DailyUsage[];
  byProduct: ProductUsage[];
  recent: RecentUsage[];
}

export interface PlanDefinition {
  key: string;
  name: string;
  priceEurMonthly: number | null;
  monthlyCredits: number;
  public: boolean;
  description: string;
}

export interface BillingSummary {
  configured: boolean;
  currentPlan: PlanDefinition;
  subscription: {
    planKey: string;
    status: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  customerPortalAvailable: boolean;
  plans: PlanDefinition[];
}

export interface DashboardOverview extends AccountIdentity {
  credits: CreditSummary;
  usage: UsageSummary;
  billing: BillingSummary;
}

export interface ApiKeyMetadata {
  id: string;
  name: string;
  display: string;
  scopes: string[];
  status: "active" | "revoked";
  environment: "live" | "test";
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  revokedAt: string | null;
}

export interface ApiKeyCreation {
  secret: string;
  apiKey: ApiKeyMetadata;
}
