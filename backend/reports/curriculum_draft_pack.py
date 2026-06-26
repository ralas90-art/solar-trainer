"""
SeptiVolt Curriculum Draft Pack Generator
==========================================
Generates a markdown draft pack from acted RecommendationAction records.

Usage:
    cd backend
    python -m reports.curriculum_draft_pack --date-range 30d
"""
import os
import sys
import json
import argparse
from datetime import datetime, timedelta
from collections import defaultdict

# Ensure backend dir is on path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)


def main():
    parser = argparse.ArgumentParser(description="Generate SeptiVolt Curriculum Draft Pack")
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
    from models.recommendation_actions import RecommendationAction

    # Production guard
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

    # Fetch all actions
    with Session(engine) as session:
        all_actions = session.exec(select(RecommendationAction)).all()

    # Queue-eligible statuses
    queue_statuses = {"accepted", "needs_review", "converted_to_faq", "converted_to_walkthrough", "converted_to_manual"}
    actions = [a for a in all_actions if a.status in queue_statuses]

    # Filter by date
    if cutoff:
        filtered = []
        for a in actions:
            if a.acted_at:
                try:
                    acted = datetime.fromisoformat(a.acted_at)
                    if acted >= cutoff:
                        filtered.append(a)
                except (ValueError, TypeError):
                    filtered.append(a)  # Include if date parse fails
            else:
                filtered.append(a)
        actions = filtered

    # Group by status
    by_status = defaultdict(list)
    for a in actions:
        by_status[a.status].append(a)

    # Count by priority
    high = [a for a in actions if a.priority == "high"]
    medium = [a for a in actions if a.priority == "medium"]
    low = [a for a in actions if a.priority == "low"]

    period_label = {"7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days", "all": "All time"}.get(date_range, date_range)

    lines = []
    lines.append("# SeptiVolt Curriculum Draft Pack")
    lines.append(f"> Generated: {now.strftime('%Y-%m-%d')} | Period: {period_label} | Items: {len(actions)}")
    lines.append("")

    # Section 1: Executive Summary
    lines.append("## 1. Executive Summary")
    lines.append("")
    lines.append(f"This draft pack contains **{len(actions)} curriculum review items** ready for human review and implementation.")
    lines.append("")
    lines.append(f"- **{len(high)} high-priority** items")
    lines.append(f"- **{len(medium)} medium-priority** items")
    lines.append(f"- **{len(low)} low-priority** items")
    lines.append("")
    lines.append("| Status | Count |")
    lines.append("|--------|-------|")
    for s in ["converted_to_faq", "converted_to_walkthrough", "converted_to_manual", "accepted", "needs_review"]:
        lines.append(f"| {s.replace('_', ' ').title()} | {len(by_status.get(s, []))} |")
    lines.append("")

    # Section 2: Curriculum Review Queue
    lines.append("## 2. Curriculum Review Queue")
    lines.append("")
    if actions:
        lines.append("| # | Priority | Status | Area | Title | Acted By | Date |")
        lines.append("|---|----------|--------|------|-------|----------|------|")
        priority_order = {"high": 0, "medium": 1, "low": 2}
        sorted_actions = sorted(actions, key=lambda a: (priority_order.get(a.priority, 9), a.acted_at or ""))
        for i, a in enumerate(sorted_actions, 1):
            date_str = a.acted_at[:10] if a.acted_at and len(a.acted_at) >= 10 else "N/A"
            lines.append(f"| {i} | {a.priority} | {a.status.replace('_', ' ')} | {a.context_area} | {a.snapshot_title[:50]} | {a.acted_by} | {date_str} |")
        lines.append("")
    else:
        lines.append("_No items in the curriculum review queue._")
        lines.append("")

    # Section 3: Proposed Quick FAQ Additions
    lines.append("## 3. Proposed Quick FAQ Additions")
    lines.append("")
    faq_items = by_status.get("converted_to_faq", [])
    if faq_items:
        for a in faq_items:
            sources = json.loads(a.signal_sources_json or "[]")
            lines.append(f"### Proposed FAQ: {a.context_area}")
            lines.append("")
            lines.append(f"**Based on:** {a.snapshot_title}")
            lines.append(f"**Signal sources:** {', '.join(sources)}")
            lines.append("")
            lines.append(f"**Issue:** {a.snapshot_explanation}")
            lines.append("")
            lines.append(f"**Proposed question:** [Based on the issue above — manual refinement needed]")
            lines.append(f"**Proposed answer:** {a.snapshot_suggested_action}")
            lines.append("")
            lines.append(f"**Converted by:** {a.acted_by} on {a.acted_at[:10] if a.acted_at else 'N/A'}")
            if a.notes:
                lines.append(f"**Notes:** {a.notes}")
            lines.append("")
            lines.append("---")
            lines.append("")
    else:
        lines.append("_No FAQ additions proposed._")
        lines.append("")

    # Section 4: Proposed Walkthrough Updates
    lines.append("## 4. Proposed Walkthrough Updates")
    lines.append("")
    walk_items = by_status.get("converted_to_walkthrough", [])
    if walk_items:
        for a in walk_items:
            sources = json.loads(a.signal_sources_json or "[]")
            lines.append(f"### Proposed Walkthrough Update: {a.context_area}")
            lines.append("")
            lines.append(f"**Based on:** {a.snapshot_title}")
            lines.append(f"**Signal sources:** {', '.join(sources)}")
            lines.append("")
            lines.append(f"**Issue:** {a.snapshot_explanation}")
            lines.append(f"**Suggested change:** {a.snapshot_suggested_action}")
            lines.append("")
            lines.append(f"**Converted by:** {a.acted_by} on {a.acted_at[:10] if a.acted_at else 'N/A'}")
            if a.notes:
                lines.append(f"**Notes:** {a.notes}")
            lines.append("")
            lines.append("---")
            lines.append("")
    else:
        lines.append("_No walkthrough updates proposed._")
        lines.append("")

    # Section 5: Proposed Support Manual Updates
    lines.append("## 5. Proposed Support Manual Updates")
    lines.append("")
    manual_items = by_status.get("converted_to_manual", [])
    if manual_items:
        for a in manual_items:
            sources = json.loads(a.signal_sources_json or "[]")
            lines.append(f"### Proposed Manual Update: {a.context_area}")
            lines.append("")
            lines.append(f"**Based on:** {a.snapshot_title}")
            lines.append(f"**Signal sources:** {', '.join(sources)}")
            lines.append("")
            lines.append(f"**Issue:** {a.snapshot_explanation}")
            lines.append(f"**Suggested change:** {a.snapshot_suggested_action}")
            lines.append("")
            lines.append(f"**Converted by:** {a.acted_by} on {a.acted_at[:10] if a.acted_at else 'N/A'}")
            if a.notes:
                lines.append(f"**Notes:** {a.notes}")
            lines.append("")
            lines.append("---")
            lines.append("")
    else:
        lines.append("_No support manual updates proposed._")
        lines.append("")

    # Section 6: Spanish Localization Notes
    lines.append("## 6. Spanish Localization Notes")
    lines.append("")
    # Check supporting_data for locale-related items
    locale_items = []
    for a in actions:
        try:
            data = json.loads(a.snapshot_supporting_data_json or "{}")
            sources = json.loads(a.signal_sources_json or "[]")
            if "locale_gap" in sources or data.get("es_count", 0) > 0 or data.get("es_percentage", 0) > 0:
                locale_items.append(a)
        except (json.JSONDecodeError, TypeError):
            pass
    if locale_items:
        for a in locale_items:
            data = json.loads(a.snapshot_supporting_data_json or "{}")
            lines.append(f"- **{a.context_area}**: {a.snapshot_title} (ES count: {data.get('es_count', 'N/A')}, ES %: {data.get('es_percentage', 'N/A')}%)")
        lines.append("")
    else:
        lines.append("_No Spanish localization gaps detected in reviewed items._")
        lines.append("")

    # Section 7: NotebookLM Update Checklist
    lines.append("## 7. NotebookLM Update Checklist")
    lines.append("")
    if actions:
        for a in actions:
            status_label = a.status.replace("_", " ").title()
            lines.append(f"- [ ] **{a.context_area}** — {a.snapshot_title} ({status_label})")
        lines.append("")
        lines.append("> After implementing changes, re-upload affected sections to NotebookLM for updated chatbot context.")
        lines.append("")
    else:
        lines.append("_No NotebookLM updates needed._")
        lines.append("")

    # Section 8: Manual Implementation Checklist
    lines.append("## 8. Manual Implementation Checklist")
    lines.append("")
    lines.append("Follow this order when implementing approved changes:")
    lines.append("")
    lines.append(f"- [ ] Review all {len(faq_items)} proposed FAQ additions")
    lines.append(f"- [ ] Review all {len(walk_items)} proposed walkthrough updates")
    lines.append(f"- [ ] Review all {len(manual_items)} proposed manual updates")
    lines.append("- [ ] Update quick FAQ map in chatbot configuration")
    lines.append("- [ ] Update walkthrough TSX components")
    lines.append("- [ ] Update `docs/septivolt-support-manual.md`")
    lines.append("- [ ] Add/update Spanish translations where applicable")
    lines.append("- [ ] Re-upload affected sections to NotebookLM")
    lines.append("- [ ] Verify chatbot answers reflect new content")
    lines.append("- [ ] Mark items as completed in the Review Queue")
    lines.append("")

    # Section 9: Items Not Ready for Update
    lines.append("## 9. Items Not Ready for Update")
    lines.append("")
    not_ready = by_status.get("needs_review", []) + by_status.get("accepted", [])
    if not_ready:
        for a in not_ready:
            status_label = a.status.replace("_", " ").title()
            lines.append(f"### {a.context_area}: {a.snapshot_title}")
            lines.append("")
            lines.append(f"**Status:** {status_label}")
            lines.append(f"**Reason:** This item has been {status_label.lower()} but not yet converted to a specific curriculum update type.")
            lines.append(f"**Acted by:** {a.acted_by} on {a.acted_at[:10] if a.acted_at else 'N/A'}")
            if a.notes:
                lines.append(f"**Notes:** {a.notes}")
            lines.append("")
    else:
        lines.append("_All items have been converted to specific update types._")
        lines.append("")

    # Section 10: Reviewer Notes
    lines.append("## 10. Reviewer Notes")
    lines.append("")
    notes_items = [a for a in actions if a.notes]
    if notes_items:
        for a in notes_items:
            lines.append(f"- **{a.acted_by}** on {a.acted_at[:10] if a.acted_at else 'N/A'} ({a.context_area}, {a.status.replace('_', ' ')}):")
            lines.append(f"  > {a.notes}")
            lines.append("")
    else:
        lines.append("_No reviewer notes recorded._")
        lines.append("")

    # Write file
    project_root = os.path.dirname(backend_dir)
    report_dir = os.path.join(project_root, "docs", "reports")
    os.makedirs(report_dir, exist_ok=True)
    filename = f"curriculum-draft-pack-{now.strftime('%Y-%m-%d')}.md"
    filepath = os.path.join(report_dir, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Draft pack generated: {os.path.abspath(filepath)}")
    print(f"Items in queue: {len(actions)}")
    print(f"Breakdown: {len(faq_items)} FAQ, {len(walk_items)} walkthrough, {len(manual_items)} manual, {len(by_status.get('accepted', []))} accepted, {len(by_status.get('needs_review', []))} needs review")


if __name__ == "__main__":
    main()
