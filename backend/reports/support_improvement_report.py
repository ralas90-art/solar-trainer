"""
SeptiVolt Support Improvement Report Generator
===============================================
Generates a markdown curriculum improvement report from SupportChatAnalytics data.

Usage:
    cd backend
    python -m reports.support_improvement_report --date-range 30d
"""
import os
import sys
import argparse
from datetime import datetime, timedelta
from collections import defaultdict, Counter

# Ensure backend dir is on path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

def main():
    parser = argparse.ArgumentParser(description="Generate SeptiVolt Support Improvement Report")
    parser.add_argument("--date-range", choices=["7d", "30d", "90d", "all"], default="30d", help="Analysis period")
    parser.add_argument("--skip-create-tables", action="store_true", help="Skip auto-creating tables (use in production)")
    args = parser.parse_args()

    # Load environment
    try:
        from dotenv import load_dotenv
        load_dotenv()
        load_dotenv(os.path.join(backend_dir, ".env"))
    except ImportError:
        pass

    from sqlmodel import Session, select, SQLModel
    from database import engine
    from models.support_analytics import SupportChatAnalytics
    from services.recommendation_engine import generate_recommendations

    # Auto-create tables only in non-production environments.
    # Production must rely on migrate_db.py for schema management.
    is_production = os.environ.get("ENV", "").lower() == "production"
    if not args.skip_create_tables and not is_production:
        SQLModel.metadata.create_all(engine)
    elif is_production:
        print("Production mode: skipping auto table creation (use migrate_db.py)")


    # Compute date cutoff
    now = datetime.utcnow()
    date_range = args.date_range
    if date_range == "7d":
        cutoff = now - timedelta(days=7)
    elif date_range == "30d":
        cutoff = now - timedelta(days=30)
    elif date_range == "90d":
        cutoff = now - timedelta(days=90)
    else:
        cutoff = None

    # Fetch records
    with Session(engine) as session:
        all_records = session.exec(select(SupportChatAnalytics)).all()

    # Filter by date
    if cutoff:
        records = [r for r in all_records if r.created_at >= cutoff]
    else:
        records = list(all_records)

    # Generate recommendations
    recommendations = generate_recommendations(records)

    # Compute statistics
    total = len(records)
    faq_count = sum(1 for r in records if r.question_type == "quick_faq")
    custom_count = sum(1 for r in records if r.question_type == "ai_custom")
    en_count = sum(1 for r in records if r.locale == "en")
    es_count = sum(1 for r in records if r.locale == "es")
    helpful_count = sum(1 for r in records if r.helpful is True)
    not_helpful_count = sum(1 for r in records if r.helpful is False)
    unrated_count = sum(1 for r in records if r.helpful is None)
    fallback_count = sum(1 for r in records if r.fallback_used)
    rated_total = helpful_count + not_helpful_count
    helpful_rate = round((helpful_count / rated_total) * 100, 1) if rated_total > 0 else 0.0

    # Area stats
    area_stats = defaultdict(lambda: {"total": 0, "en": 0, "es": 0, "faq": 0, "custom": 0, "helpful": 0, "not_helpful": 0, "fallback": 0, "rated": 0})
    for r in records:
        area = r.context_area or "general"
        area_stats[area]["total"] += 1
        if r.locale == "en": area_stats[area]["en"] += 1
        if r.locale == "es": area_stats[area]["es"] += 1
        if r.question_type == "quick_faq": area_stats[area]["faq"] += 1
        if r.question_type == "ai_custom": area_stats[area]["custom"] += 1
        if r.helpful is True: area_stats[area]["helpful"] += 1
        if r.helpful is False: area_stats[area]["not_helpful"] += 1
        if r.fallback_used: area_stats[area]["fallback"] += 1
        if r.helpful is not None: area_stats[area]["rated"] += 1

    # Top repeated questions
    preview_groups = defaultdict(list)
    for r in records:
        if r.question_preview:
            preview_groups[r.question_preview].append(r)
    top_questions = sorted(preview_groups.items(), key=lambda x: len(x[1]), reverse=True)[:15]

    # Recent not-helpful
    not_helpful_records = sorted(
        [r for r in records if r.helpful is False],
        key=lambda r: r.created_at, reverse=True
    )[:10]

    # Group recommendations by priority
    high_recs = [r for r in recommendations if r.priority == "high"]
    med_recs = [r for r in recommendations if r.priority == "medium"]
    low_recs = [r for r in recommendations if r.priority == "low"]

    # Build report
    date_str = now.strftime("%Y-%m-%d")
    period_label = {"7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days", "all": "All time"}[date_range]

    lines = []
    lines.append(f"# SeptiVolt Support Improvement Report")
    lines.append(f"> Generated: {date_str} | Period: {period_label} | Records analyzed: {total}")
    lines.append("")

    # Section 1: Executive Summary
    lines.append("## 1. Executive Summary")
    lines.append("")
    lines.append(f"During the analysis period ({period_label}), SeptiVolt's support system processed **{total} trainee interactions** — {faq_count} quick FAQ lookups and {custom_count} AI-powered responses.")
    if rated_total > 0:
        lines.append(f"The overall helpful rate is **{helpful_rate}%** ({helpful_count} helpful / {not_helpful_count} not helpful / {unrated_count} unrated).")
    if fallback_count > 0:
        fb_rate = round((fallback_count / max(custom_count, 1)) * 100, 1)
        lines.append(f"AI fallback was triggered {fallback_count} times ({fb_rate}% of AI responses), indicating context gaps in the support manual.")
    lines.append(f"")
    lines.append(f"**{len(high_recs)} high-priority**, **{len(med_recs)} medium-priority**, and **{len(low_recs)} low-priority** curriculum improvement recommendations were generated.")
    lines.append("")

    # Section 2: Priority Action List
    lines.append("## 2. Priority Action List")
    lines.append("")
    if not recommendations:
        lines.append("_No recommendations generated. Insufficient data or no significant patterns detected._")
    else:
        for i, rec in enumerate(recommendations, 1):
            priority_icon = {"high": "[HIGH]", "medium": "[MEDIUM]", "low": "[LOW]"}[rec.priority]
            lines.append(f"{i}. **{priority_icon}** {rec.title}")
            lines.append(f"   - Area: {rec.context_area} | Signals: {', '.join(rec.signal_sources)} | Confidence: {rec.confidence}")
            lines.append(f"   - Action: {rec.suggested_action}")
            lines.append("")

    # Section 3: Top Confusion Areas
    lines.append("## 3. Top Confusion Areas")
    lines.append("")
    lines.append("| Area | Questions | % of Total | Not-Helpful Rate | Fallback Rate |")
    lines.append("|------|-----------|------------|-----------------|---------------|")
    for area, stats in sorted(area_stats.items(), key=lambda x: x[1]["total"], reverse=True):
        pct = round((stats["total"] / max(total, 1)) * 100, 1)
        nh_rate = round((stats["not_helpful"] / max(stats["rated"], 1)) * 100, 1) if stats["rated"] > 0 else 0.0
        fb_rate = round((stats["fallback"] / max(stats["custom"], 1)) * 100, 1) if stats["custom"] > 0 else 0.0
        lines.append(f"| {area} | {stats['total']} | {pct}% | {nh_rate}% | {fb_rate}% |")
    lines.append("")

    # Section 4: Repeated Questions
    lines.append("## 4. Repeated Questions")
    lines.append("")
    if top_questions:
        lines.append("| Question | Count | Locale | Area | Suggested Action |")
        lines.append("|----------|-------|--------|------|-----------------|")
        for preview, group in top_questions:
            count = len(group)
            locale = max(group, key=lambda r: r.created_at).locale
            area = group[0].context_area or "general"
            action = "Add FAQ" if count >= 3 else "Monitor"
            truncated = (preview[:80] + "...") if len(preview) > 80 else preview
            lines.append(f"| {truncated} | {count} | {locale} | {area} | {action} |")
    else:
        lines.append("_No repeated questions detected._")
    lines.append("")

    # Section 5: Recent Not-Helpful Feedback
    lines.append("## 5. Recent Not-Helpful Feedback")
    lines.append("")
    if not_helpful_records:
        lines.append("| Question | Area | Locale | Date | Suggested Fix |")
        lines.append("|----------|------|--------|------|--------------|")
        for r in not_helpful_records:
            preview = (r.question_preview[:80] + "...") if r.question_preview and len(r.question_preview) > 80 else (r.question_preview or "N/A")
            area = r.context_area or "general"
            date = r.created_at.strftime("%Y-%m-%d")
            lines.append(f"| {preview} | {area} | {r.locale} | {date} | Review {area} manual section |")
    else:
        lines.append("_No not-helpful feedback recorded._")
    lines.append("")

    # Section 6: Spanish / English Coverage Gaps
    lines.append("## 6. Spanish / English Coverage Gaps")
    lines.append("")
    lines.append("| Area | EN Questions | ES Questions | ES % | Gap Type |")
    lines.append("|------|-------------|-------------|------|----------|")
    for area, stats in sorted(area_stats.items(), key=lambda x: x[1]["es"], reverse=True):
        if stats["es"] > 0:
            es_pct = round((stats["es"] / max(stats["total"], 1)) * 100, 1)
            gap = "High" if es_pct > 30 else ("Medium" if es_pct > 15 else "Low")
            lines.append(f"| {area} | {stats['en']} | {stats['es']} | {es_pct}% | {gap} |")
    lines.append("")

    # Section 7: AI Fallback & Context Gaps
    lines.append("## 7. AI Fallback & Context Gaps")
    lines.append("")
    lines.append("| Area | Fallback Count | Fallback Rate | Suggested Manual Update |")
    lines.append("|------|---------------|---------------|------------------------|")
    for area, stats in sorted(area_stats.items(), key=lambda x: x[1]["fallback"], reverse=True):
        if stats["fallback"] > 0 and stats["custom"] > 0:
            fb_rate = round((stats["fallback"] / stats["custom"]) * 100, 1)
            lines.append(f"| {area} | {stats['fallback']} | {fb_rate}% | Expand {area} section in support manual |")
    if not any(s["fallback"] > 0 for s in area_stats.values()):
        lines.append("_No AI fallback events recorded._")
    lines.append("")

    # Section 8: Recommended Quick FAQ Additions
    lines.append("## 8. Recommended Quick FAQ Additions")
    lines.append("")
    faq_recs = [r for r in recommendations if r.type == "add_faq"]
    if faq_recs:
        for i, rec in enumerate(faq_recs, 1):
            lines.append(f"{i}. **[{rec.priority.upper()}]** {rec.title}")
            lines.append(f"   - {rec.suggested_action}")
            lines.append("")
    else:
        lines.append("_No FAQ additions recommended at this time._")
    lines.append("")

    # Section 9: Recommended Walkthrough Updates
    lines.append("## 9. Recommended Walkthrough Updates")
    lines.append("")
    walk_recs = [r for r in recommendations if r.type in ("update_walkthrough", "review_content")]
    if walk_recs:
        for i, rec in enumerate(walk_recs, 1):
            lines.append(f"{i}. **[{rec.priority.upper()}]** {rec.title}")
            lines.append(f"   - {rec.suggested_action}")
            lines.append("")
    else:
        lines.append("_No walkthrough updates recommended at this time._")
    lines.append("")

    # Section 10: Recommended Support Manual Updates
    lines.append("## 10. Recommended Support Manual Updates")
    lines.append("")
    manual_recs = [r for r in recommendations if r.type in ("update_manual", "improve_ai_context", "add_localization")]
    if manual_recs:
        for i, rec in enumerate(manual_recs, 1):
            lines.append(f"{i}. **[{rec.priority.upper()}]** {rec.title}")
            lines.append(f"   - {rec.suggested_action}")
            lines.append(f"   - Affected locale: {rec.affected_locale}")
            lines.append("")
    else:
        lines.append("_No manual updates recommended at this time._")
    lines.append("")

    # Footer
    lines.append("---")
    lines.append(f"_Report generated by SeptiVolt Curriculum Improvement Engine on {date_str}._")

    report_content = "\n".join(lines)

    # Write to docs/reports/
    project_root = os.path.dirname(backend_dir)
    reports_dir = os.path.join(project_root, "docs", "reports")
    os.makedirs(reports_dir, exist_ok=True)

    output_path = os.path.join(reports_dir, f"support-improvement-{date_str}.md")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(report_content)

    print(f"Report generated: {output_path}")
    print(f"Records analyzed: {total}")
    print(f"Recommendations: {len(high_recs)} high, {len(med_recs)} medium, {len(low_recs)} low")


if __name__ == "__main__":
    main()
