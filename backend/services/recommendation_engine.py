"""
SeptiVolt Curriculum Improvement Engine
========================================
Deterministic threshold-based analysis of SupportChatAnalytics.
No AI calls — pure statistical signal detection.
"""
from dataclasses import dataclass, field, asdict
from typing import List, Optional
from collections import defaultdict, Counter
from datetime import datetime


@dataclass
class Recommendation:
    id: str                      # e.g. "rec_ctx_simulator_high"
    priority: str                # "high" | "medium" | "low"
    type: str                    # "add_faq" | "update_walkthrough" | "update_manual" | "add_localization" | "improve_ai_context" | "review_content"
    context_area: str            # "simulator" | "training" | etc.
    signal_source: str           # Primary signal
    signal_sources: List[str] = field(default_factory=list)  # All merged signals
    title: str = ""
    explanation: str = ""
    suggested_action: str = ""
    confidence: str = "medium"   # "high" | "medium" | "low"
    affected_locale: str = "both"
    supporting_data: dict = field(default_factory=dict)

    def to_dict(self):
        d = asdict(self)
        return d


MINIMUM_RECORDS = 5


def generate_recommendations(records: list) -> List[Recommendation]:
    """Generate curriculum improvement recommendations from analytics records.

    Args:
        records: List of SupportChatAnalytics model instances (already filtered)

    Returns:
        List of Recommendation objects sorted by priority (high -> medium -> low)
    """
    if len(records) < MINIMUM_RECORDS:
        return []

    recommendations: List[Recommendation] = []
    total = len(records)

    # Pre-compute area stats
    area_records = defaultdict(list)
    for r in records:
        area = r.context_area or "general"
        area_records[area].append(r)

    # Run all 6 signal analyzers
    recommendations.extend(_analyze_context_concentration(area_records, total))
    recommendations.extend(_analyze_repeated_questions(records, total))
    recommendations.extend(_analyze_not_helpful_rate(area_records, total))
    recommendations.extend(_analyze_fallback_rate(area_records, total))
    recommendations.extend(_analyze_locale_gaps(area_records, total))
    recommendations.extend(_analyze_faq_coverage_gaps(area_records, total))

    # Deduplicate: merge recommendations for the same context_area
    recommendations = _deduplicate(recommendations)

    # Sort by priority
    priority_order = {"high": 0, "medium": 1, "low": 2}
    recommendations.sort(key=lambda r: priority_order.get(r.priority, 3))

    return recommendations


def _analyze_context_concentration(area_records: dict, total: int) -> List[Recommendation]:
    recs = []
    for area, recs_in_area in area_records.items():
        pct = (len(recs_in_area) / total) * 100
        count = len(recs_in_area)

        if pct > 30:
            recs.append(Recommendation(
                id=f"rec_ctx_{area}_high",
                priority="high",
                type="review_content",
                context_area=area,
                signal_source="context_concentration",
                signal_sources=["context_concentration"],
                title=f"High support volume in {area.replace('_', ' ').title()}",
                explanation=f"{area.replace('_', ' ').title()} generated {count} support questions ({pct:.1f}% of total). This area may have unclear documentation or confusing UI.",
                suggested_action=f"Review the {area} walkthrough step and support manual section. Consider adding targeted quick FAQ buttons for this area.",
                confidence="high",
                affected_locale="both",
                supporting_data={"count": count, "percentage": round(pct, 1), "total": total}
            ))
        elif pct > 15:
            recs.append(Recommendation(
                id=f"rec_ctx_{area}_med",
                priority="medium",
                type="review_content",
                context_area=area,
                signal_source="context_concentration",
                signal_sources=["context_concentration"],
                title=f"Moderate support volume in {area.replace('_', ' ').title()}",
                explanation=f"{area.replace('_', ' ').title()} generated {count} support questions ({pct:.1f}% of total). Worth monitoring.",
                suggested_action=f"Review FAQ coverage for {area} and check if the walkthrough adequately explains this feature.",
                confidence="medium",
                affected_locale="both",
                supporting_data={"count": count, "percentage": round(pct, 1), "total": total}
            ))
        elif pct > 5 and total > 20:
            recs.append(Recommendation(
                id=f"rec_ctx_{area}_low",
                priority="low",
                type="review_content",
                context_area=area,
                signal_source="context_concentration",
                signal_sources=["context_concentration"],
                title=f"Minor support activity in {area.replace('_', ' ').title()}",
                explanation=f"{area.replace('_', ' ').title()} generated {count} questions ({pct:.1f}% of total).",
                suggested_action=f"Monitor {area} support trends over the next reporting period.",
                confidence="low",
                affected_locale="both",
                supporting_data={"count": count, "percentage": round(pct, 1), "total": total}
            ))
    return recs


def _analyze_repeated_questions(records: list, total: int) -> List[Recommendation]:
    recs = []
    preview_groups = defaultdict(list)
    for r in records:
        if r.question_preview:
            preview_groups[r.question_preview].append(r)

    for preview, group in preview_groups.items():
        count = len(group)
        area = (group[0].context_area or "general")
        most_recent = max(group, key=lambda r: r.created_at)
        locale = most_recent.locale

        if count >= 5:
            recs.append(Recommendation(
                id=f"rec_rq_{area}_{hash(preview) % 10000}",
                priority="high",
                type="add_faq",
                context_area=area,
                signal_source="repeated_question",
                signal_sources=["repeated_question"],
                title=f"Add FAQ: \"{preview[:60]}{'...' if len(preview) > 60 else ''}\"",
                explanation=f"This question was asked {count} times. Trainees are repeatedly seeking help on the same topic.",
                suggested_action=f"Add a quick FAQ button with a clear answer for: \"{preview[:100]}\"",
                confidence="high",
                affected_locale=locale,
                supporting_data={"repeat_count": count, "preview": preview, "area": area}
            ))
        elif count >= 3:
            recs.append(Recommendation(
                id=f"rec_rq_{area}_{hash(preview) % 10000}",
                priority="medium",
                type="add_faq",
                context_area=area,
                signal_source="repeated_question",
                signal_sources=["repeated_question"],
                title=f"Potential FAQ: \"{preview[:60]}{'...' if len(preview) > 60 else ''}\"",
                explanation=f"This question was asked {count} times. May indicate a documentation gap.",
                suggested_action=f"Consider adding FAQ coverage for: \"{preview[:100]}\"",
                confidence="medium",
                affected_locale=locale,
                supporting_data={"repeat_count": count, "preview": preview, "area": area}
            ))
        elif count >= 2 and total > 30:
            recs.append(Recommendation(
                id=f"rec_rq_{area}_{hash(preview) % 10000}",
                priority="low",
                type="add_faq",
                context_area=area,
                signal_source="repeated_question",
                signal_sources=["repeated_question"],
                title=f"Watch pattern: \"{preview[:60]}{'...' if len(preview) > 60 else ''}\"",
                explanation=f"This question appeared {count} times. Monitor for repeat pattern.",
                suggested_action=f"Monitor if this question continues: \"{preview[:100]}\"",
                confidence="low",
                affected_locale=locale,
                supporting_data={"repeat_count": count, "preview": preview, "area": area}
            ))
    return recs


def _analyze_not_helpful_rate(area_records: dict, total: int) -> List[Recommendation]:
    recs = []
    for area, area_recs in area_records.items():
        rated = [r for r in area_recs if r.helpful is not None]
        if len(rated) < 5:
            continue

        not_helpful = sum(1 for r in rated if r.helpful is False)
        rate = (not_helpful / len(rated)) * 100

        if rate > 25:
            recs.append(Recommendation(
                id=f"rec_nh_{area}_high",
                priority="high",
                type="update_manual",
                context_area=area,
                signal_source="not_helpful_rate",
                signal_sources=["not_helpful_rate"],
                title=f"Poor answer quality in {area.replace('_', ' ').title()}",
                explanation=f"{not_helpful} of {len(rated)} rated responses ({rate:.1f}%) in {area} were marked not helpful. Support answers are failing trainees.",
                suggested_action=f"Rewrite the {area} section in the support manual. Review the AI context and quick FAQ answers for accuracy.",
                confidence="high",
                affected_locale="both",
                supporting_data={"not_helpful_count": not_helpful, "rated_count": len(rated), "rate": round(rate, 1)}
            ))
        elif rate > 15:
            recs.append(Recommendation(
                id=f"rec_nh_{area}_med",
                priority="medium",
                type="update_manual",
                context_area=area,
                signal_source="not_helpful_rate",
                signal_sources=["not_helpful_rate"],
                title=f"Below-average answer quality in {area.replace('_', ' ').title()}",
                explanation=f"{not_helpful} of {len(rated)} rated responses ({rate:.1f}%) in {area} were marked not helpful.",
                suggested_action=f"Review the {area} support content for clarity and completeness.",
                confidence="medium",
                affected_locale="both",
                supporting_data={"not_helpful_count": not_helpful, "rated_count": len(rated), "rate": round(rate, 1)}
            ))
        elif rate > 8:
            recs.append(Recommendation(
                id=f"rec_nh_{area}_low",
                priority="low",
                type="review_content",
                context_area=area,
                signal_source="not_helpful_rate",
                signal_sources=["not_helpful_rate"],
                title=f"Minor quality concern in {area.replace('_', ' ').title()}",
                explanation=f"{not_helpful} of {len(rated)} rated responses ({rate:.1f}%) in {area} were not helpful.",
                suggested_action=f"Monitor answer quality trends for {area}.",
                confidence="low",
                affected_locale="both",
                supporting_data={"not_helpful_count": not_helpful, "rated_count": len(rated), "rate": round(rate, 1)}
            ))
    return recs


def _analyze_fallback_rate(area_records: dict, total: int) -> List[Recommendation]:
    recs = []
    for area, area_recs in area_records.items():
        custom_recs = [r for r in area_recs if r.question_type == "ai_custom"]
        if len(custom_recs) < 10:
            continue

        fallback_count = sum(1 for r in custom_recs if r.fallback_used)
        rate = (fallback_count / len(custom_recs)) * 100

        if rate > 20:
            recs.append(Recommendation(
                id=f"rec_fb_{area}_high",
                priority="high",
                type="improve_ai_context",
                context_area=area,
                signal_source="fallback_rate",
                signal_sources=["fallback_rate"],
                title=f"AI context gap in {area.replace('_', ' ').title()}",
                explanation=f"{fallback_count} of {len(custom_recs)} AI responses ({rate:.1f}%) in {area} used fallback answers. The AI lacks sufficient context to answer questions about this area.",
                suggested_action=f"Expand the {area} section in the support manual with more detailed guidance. Add specific terminology and process explanations.",
                confidence="high",
                affected_locale="both",
                supporting_data={"fallback_count": fallback_count, "custom_count": len(custom_recs), "rate": round(rate, 1)}
            ))
        elif rate > 10:
            recs.append(Recommendation(
                id=f"rec_fb_{area}_med",
                priority="medium",
                type="improve_ai_context",
                context_area=area,
                signal_source="fallback_rate",
                signal_sources=["fallback_rate"],
                title=f"Moderate AI gaps in {area.replace('_', ' ').title()}",
                explanation=f"{fallback_count} of {len(custom_recs)} AI responses ({rate:.1f}%) in {area} needed fallback.",
                suggested_action=f"Review and expand the {area} section in the support manual.",
                confidence="medium",
                affected_locale="both",
                supporting_data={"fallback_count": fallback_count, "custom_count": len(custom_recs), "rate": round(rate, 1)}
            ))
        elif rate > 5:
            recs.append(Recommendation(
                id=f"rec_fb_{area}_low",
                priority="low",
                type="improve_ai_context",
                context_area=area,
                signal_source="fallback_rate",
                signal_sources=["fallback_rate"],
                title=f"Minor AI context issue in {area.replace('_', ' ').title()}",
                explanation=f"{fallback_count} of {len(custom_recs)} AI responses ({rate:.1f}%) in {area} used fallback.",
                suggested_action=f"Monitor AI response quality for {area}.",
                confidence="low",
                affected_locale="both",
                supporting_data={"fallback_count": fallback_count, "custom_count": len(custom_recs), "rate": round(rate, 1)}
            ))
    return recs


def _analyze_locale_gaps(area_records: dict, total: int) -> List[Recommendation]:
    recs = []
    for area, area_recs in area_records.items():
        es_count = sum(1 for r in area_recs if r.locale == "es")
        en_count = sum(1 for r in area_recs if r.locale == "en")
        area_total = len(area_recs)

        if area_total < 3 or es_count < 1:
            continue

        es_pct = (es_count / area_total) * 100
        # Check if Spanish questions use FAQ less (indicating missing ES FAQs)
        es_faq = sum(1 for r in area_recs if r.locale == "es" and r.question_type == "quick_faq")
        es_custom = es_count - es_faq

        if es_pct > 30:
            recs.append(Recommendation(
                id=f"rec_loc_{area}_high",
                priority="high",
                type="add_localization",
                context_area=area,
                signal_source="locale_gap",
                signal_sources=["locale_gap"],
                title=f"Spanish coverage gap in {area.replace('_', ' ').title()}",
                explanation=f"{es_count} of {area_total} questions ({es_pct:.1f}%) in {area} are in Spanish. High demand for Spanish-language support.",
                suggested_action=f"Ensure the {area} section has complete Spanish translations in the support manual and walkthrough. Add Spanish quick FAQ buttons.",
                confidence="high",
                affected_locale="es",
                supporting_data={"es_count": es_count, "en_count": en_count, "es_percentage": round(es_pct, 1), "es_faq": es_faq, "es_custom": es_custom}
            ))
        elif es_pct > 15:
            recs.append(Recommendation(
                id=f"rec_loc_{area}_med",
                priority="medium",
                type="add_localization",
                context_area=area,
                signal_source="locale_gap",
                signal_sources=["locale_gap"],
                title=f"Growing Spanish demand in {area.replace('_', ' ').title()}",
                explanation=f"{es_count} of {area_total} questions ({es_pct:.1f}%) in {area} are in Spanish.",
                suggested_action=f"Review Spanish support coverage for {area}.",
                confidence="medium",
                affected_locale="es",
                supporting_data={"es_count": es_count, "en_count": en_count, "es_percentage": round(es_pct, 1)}
            ))
        elif es_pct > 5 and es_count >= 3:
            recs.append(Recommendation(
                id=f"rec_loc_{area}_low",
                priority="low",
                type="add_localization",
                context_area=area,
                signal_source="locale_gap",
                signal_sources=["locale_gap"],
                title=f"Minor Spanish activity in {area.replace('_', ' ').title()}",
                explanation=f"{es_count} Spanish questions detected in {area}.",
                suggested_action=f"Monitor Spanish support needs for {area}.",
                confidence="low",
                affected_locale="es",
                supporting_data={"es_count": es_count, "en_count": en_count, "es_percentage": round(es_pct, 1)}
            ))
    return recs


def _analyze_faq_coverage_gaps(area_records: dict, total: int) -> List[Recommendation]:
    recs = []
    for area, area_recs in area_records.items():
        if len(area_recs) < 5:
            continue

        custom_count = sum(1 for r in area_recs if r.question_type == "ai_custom")
        faq_count = sum(1 for r in area_recs if r.question_type == "quick_faq")
        custom_pct = (custom_count / len(area_recs)) * 100

        if custom_pct > 80:
            recs.append(Recommendation(
                id=f"rec_faq_{area}_high",
                priority="high",
                type="add_faq",
                context_area=area,
                signal_source="faq_coverage_gap",
                signal_sources=["faq_coverage_gap"],
                title=f"FAQ coverage gap in {area.replace('_', ' ').title()}",
                explanation=f"{custom_count} of {len(area_recs)} questions ({custom_pct:.1f}%) in {area} required AI responses instead of using quick FAQs. The existing FAQ buttons don't cover trainee needs.",
                suggested_action=f"Add new quick FAQ buttons for {area} based on the most common AI-answered questions in this area.",
                confidence="medium",
                affected_locale="both",
                supporting_data={"custom_count": custom_count, "faq_count": faq_count, "custom_percentage": round(custom_pct, 1)}
            ))
        elif custom_pct > 60:
            recs.append(Recommendation(
                id=f"rec_faq_{area}_med",
                priority="medium",
                type="add_faq",
                context_area=area,
                signal_source="faq_coverage_gap",
                signal_sources=["faq_coverage_gap"],
                title=f"Moderate FAQ gap in {area.replace('_', ' ').title()}",
                explanation=f"{custom_count} of {len(area_recs)} questions ({custom_pct:.1f}%) in {area} went to AI instead of FAQ.",
                suggested_action=f"Review common AI questions for {area} and add FAQ buttons.",
                confidence="low",
                affected_locale="both",
                supporting_data={"custom_count": custom_count, "faq_count": faq_count, "custom_percentage": round(custom_pct, 1)}
            ))
    return recs


def _deduplicate(recommendations: List[Recommendation]) -> List[Recommendation]:
    """Merge recommendations for the same context_area, keeping the highest priority."""
    area_recs = defaultdict(list)
    for rec in recommendations:
        area_recs[rec.context_area].append(rec)

    merged = []
    priority_order = {"high": 0, "medium": 1, "low": 2}

    for area, recs in area_recs.items():
        # Group by type to avoid merging unrelated recommendations
        type_groups = defaultdict(list)
        for r in recs:
            type_groups[r.type].append(r)

        for rec_type, type_recs in type_groups.items():
            if len(type_recs) == 1:
                merged.append(type_recs[0])
            else:
                # Keep the highest priority one and merge signal_sources
                type_recs.sort(key=lambda r: priority_order.get(r.priority, 3))
                best = type_recs[0]
                all_sources = []
                for r in type_recs:
                    for s in r.signal_sources:
                        if s not in all_sources:
                            all_sources.append(s)
                best.signal_sources = all_sources
                merged.append(best)

    return merged
