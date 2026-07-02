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

export type PipelineStatus = "not_started" | "drafted" | "approved" | "scheduled" | "posted";

export type GrowthEmailSegment = {
  id: string;
  slug: string;
  name: string;
  definition: string | null;
  klaviyo_segment_name: string | null;
  lifecycle_stage: string | null;
  estimated_count: number | null;
  priority: Priority;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthEmailFlow = {
  id: string;
  slug: string;
  name: string;
  purpose: string | null;
  trigger_description: string | null;
  goal: string | null;
  status: string;
  owner: string | null;
  lifecycle_stage: string | null;
  klaviyo_flow_name: string | null;
  sort_order: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthEmailFlowEmail = {
  id: string;
  flow_slug: string;
  step_number: number;
  send_timing: string | null;
  subject: string | null;
  preview_text: string | null;
  body_outline: string | null;
  goal: string | null;
  cta: string | null;
  graphic_recommendation: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthEmailCampaign = {
  id: string;
  send_date: string | null;
  campaign_name: string;
  campaign_type: string | null;
  segment_slug: string | null;
  subject: string | null;
  preview_text: string | null;
  goal: string | null;
  cta: string | null;
  graphic_recommendation: string | null;
  status: string;
  flow_slug: string | null;
  revenue_attributed: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthEmailLibraryItem = {
  id: string;
  slug: string | null;
  subject: string;
  preview_text: string | null;
  goal: string | null;
  cta: string | null;
  graphic_recommendation: string | null;
  body_outline: string | null;
  status: string;
  campaign: string | null;
  flow_slug: string | null;
  lifecycle_stage: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthEmailAnalyticsDaily = {
  id: string;
  metric_date: string;
  subscribers: number | null;
  open_rate: number | null;
  click_rate: number | null;
  unsubscribes: number | null;
  waitlist_conversion: number | null;
  beta_conversion: number | null;
  ltd_conversion: number | null;
  revenue_per_email: number | null;
  revenue_per_subscriber: number | null;
  top_email: string | null;
  worst_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthContentPipeline = {
  id: string;
  behavior_id: string;
  behavior_title: string;
  category_id: string;
  category_title: string;
  blog_status: PipelineStatus;
  newsletter_status: PipelineStatus;
  linkedin_status: PipelineStatus;
  x_status: PipelineStatus;
  facebook_status: PipelineStatus;
  reddit_status: PipelineStatus;
  instagram_status: PipelineStatus;
  tiktok_status: PipelineStatus;
  pinterest_status: PipelineStatus;
  blog_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SocialOpportunityStatus = "new" | "used" | "skipped" | "duplicate";

export type GrowthSocialOpportunity = {
  id: string;
  scout_date: string;
  platform: "reddit" | "x";
  source_name: string | null;
  thread_url: string;
  thread_title: string | null;
  thread_excerpt: string | null;
  draft_response: string | null;
  relevance_score: number | null;
  status: SocialOpportunityStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GrowthContentDraft = {
  id: string;
  draft_date: string;
  platform: string;
  content_type: string;
  behavior_id: string | null;
  behavior_title: string | null;
  hook: string | null;
  body: string | null;
  cta: string | null;
  image_prompts: string[] | null;
  video_script: string | null;
  status: string;
  source_task_title: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
