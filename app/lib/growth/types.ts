export type TaskStatus = "not_started" | "in_progress" | "done" | "skipped";
export type Priority = "high" | "medium" | "low";
export type JoinedStatus = "not_joined" | "requested" | "joined" | "rejected";
export type ContactStatus =
  | "not_contacted"
  | "contacted"
  | "replied"
  | "interested"
  | "declined"
  | "partnered";
export type ContentStatus = "idea" | "drafted" | "approved" | "scheduled" | "posted";
export type OutreachStatus = "not_sent" | "sent" | "replied" | "follow_up_needed" | "closed";

export type GrowthDailyTask = {
  id: string;
  task_date: string;
  task_title: string;
  task_type: string | null;
  platform: string | null;
  priority: Priority | null;
  status: TaskStatus;
  link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthCommunity = {
  id: string;
  platform: string;
  name: string;
  url: string | null;
  audience_type: string | null;
  estimated_size: string | null;
  priority: Priority;
  joined_status: JoinedStatus;
  promo_rules: string | null;
  first_post_allowed_date: string | null;
  last_engaged_date: string | null;
  best_post_angle: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthCreator = {
  id: string;
  platform: string;
  name: string;
  handle: string | null;
  url: string | null;
  niche: string | null;
  audience_fit: string | null;
  estimated_followers: string | null;
  priority: Priority;
  contact_method: string | null;
  contact_status: ContactStatus;
  outreach_angle: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthContentItem = {
  id: string;
  publish_date: string;
  platform: string;
  content_type: string;
  topic: string;
  hook: string | null;
  body: string | null;
  cta: string | null;
  image_prompt: string | null;
  status: ContentStatus;
  url_after_posting: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthOutreach = {
  id: string;
  outreach_date: string;
  target_type: string;
  target_name: string;
  platform: string | null;
  url: string | null;
  message: string | null;
  status: OutreachStatus;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthMetricsDaily = {
  id: string;
  metric_date: string;
  website_visits: number | null;
  waitlist_signups: number | null;
  beta_users_invited: number | null;
  beta_users_active: number | null;
  app_sessions: number | null;
  feedback_submissions: number | null;
  thumbs_up_count: number | null;
  thumbs_down_count: number | null;
  email_subscribers: number | null;
  email_open_rate: number | null;
  email_click_rate: number | null;
  x_followers: number | null;
  linkedin_followers: number | null;
  instagram_followers: number | null;
  tiktok_followers: number | null;
  facebook_groups_joined: number | null;
  reddit_comments_posted: number | null;
  creator_outreach_sent: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthRevenueDaily = {
  id: string;
  revenue_date: string;
  daily_revenue: number | null;
  ltd_units_sold: number | null;
  ltd_price: number | null;
  refunds: number | null;
  net_revenue: number | null;
  cumulative_launch_revenue: number | null;
  daily_target: number | null;
  weekly_target: number | null;
  monthly_target: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthAgentRun = {
  id: string;
  agent_name: string;
  run_date: string;
  input: string | null;
  output: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
};
