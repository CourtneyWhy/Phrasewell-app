import { NextResponse } from "next/server";
import { growthDb } from "@/app/lib/growth/db";
import { LIFECYCLE_FUNNEL } from "@/app/lib/growth/email-data";

export async function GET() {
  const db = growthDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const [
    waitlist,
    feedbackAll,
    testimonials,
    segments,
    campaigns,
    emailAnalytics,
    metricsLatest,
    revenueRows,
  ] = await Promise.all([
    db.from("waitlist_signups").select("id", { count: "exact", head: true }),
    db.from("phrase_feedback").select("helpful, id"),
    db.from("phrase_feedback").select("id", { count: "exact", head: true }).eq("can_use_publicly", true),
    db.from("growth_email_segments").select("*").order("slug"),
    db.from("growth_email_campaigns").select("*").order("send_date"),
    db.from("growth_email_analytics_daily").select("*").order("metric_date", { ascending: false }).limit(14),
    db.from("growth_metrics_daily").select("*").order("metric_date", { ascending: false }).limit(1).maybeSingle(),
    db.from("growth_revenue_daily").select("net_revenue, cumulative_launch_revenue, ltd_units_sold"),
  ]);

  const feedbackRows = feedbackAll.data ?? [];
  const positiveFeedback = feedbackRows.filter((r) => r.helpful === true).length;
  const waitlistCount = waitlist.count ?? 0;
  const betaActive = metricsLatest.data?.beta_users_active ?? 0;
  const betaInvited = metricsLatest.data?.beta_users_invited ?? 0;
  const ltdUnits = revenueRows.data?.reduce((s, r) => s + Number(r.ltd_units_sold ?? 0), 0) ?? 0;
  const ltdRevenue = revenueRows.data?.length
    ? Math.max(...revenueRows.data.map((r) => Number(r.cumulative_launch_revenue ?? 0)))
    : 0;

  const counts: Record<string, number> = {
    visitor: metricsLatest.data?.website_visits ?? waitlistCount,
    waitlist: waitlistCount,
    beta_invite: betaInvited || Math.floor(waitlistCount * 0.1),
    beta_user: betaActive,
    highly_engaged: positiveFeedback >= 3 ? positiveFeedback : Math.min(positiveFeedback, betaActive),
    testimonial: testimonials.count ?? 0,
    founder_ltd: ltdUnits,
    power_user: Math.floor(ltdUnits * 0.3),
    referral: 0,
    subscription: 0,
  };

  const funnel = LIFECYCLE_FUNNEL.map((stage, i) => {
    const count = counts[stage.id] ?? 0;
    const prev = i > 0 ? counts[LIFECYCLE_FUNNEL[i - 1].id] ?? 0 : count;
    const conversion = prev > 0 && i > 0 ? Math.round((count / prev) * 100) : i === 0 ? 100 : 0;
    const dropOff = i > 0 && prev > 0 ? prev - count : 0;
    return { ...stage, count, conversion, dropOff };
  });

  const segmentRows = (segments.data ?? []).map((s) => ({
    ...s,
    estimated_count: s.estimated_count ?? counts[s.lifecycle_stage ?? ""] ?? 0,
  }));

  const campaignAttribution = (campaigns.data ?? [])
    .filter((c) => c.revenue_attributed)
    .sort((a, b) => Number(b.revenue_attributed) - Number(a.revenue_attributed));

  const analytics = emailAnalytics.data ?? [];
  const avgOpen =
    analytics.length > 0
      ? analytics.reduce((s, a) => s + Number(a.open_rate ?? 0), 0) / analytics.length
      : null;

  return NextResponse.json({
    funnel,
    segments: segmentRows,
    launchTracker: {
      waitlist: waitlistCount,
      betaInvited,
      betaActive,
      customers: ltdUnits,
      revenue: ltdRevenue,
      emailSubscribers: metricsLatest.data?.email_subscribers ?? analytics[0]?.subscribers ?? null,
    },
    emailAnalytics: {
      latest: analytics[0] ?? null,
      trend: analytics,
      avgOpenRate: avgOpen ? Math.round(avgOpen * 10) / 10 : null,
    },
    campaignAttribution,
    topCampaign: campaignAttribution[0] ?? null,
    worstCampaign: campaignAttribution[campaignAttribution.length - 1] ?? null,
  });
}
