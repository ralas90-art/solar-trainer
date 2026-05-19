import { t } from "./frontend/lib/i18n";

console.log("Testing i18n resolver:");
console.log("funnel.title (en):", t("funnel.title", "en"));
console.log("funnel.cta.previous (en):", t("funnel.cta.previous", "en"));
console.log("funnel.final_step.title (en):", t("funnel.final_step.title", "en"));
console.log("funnel.questions.lead_type.text (en):", t("funnel.questions.lead_type.text", "en"));
console.log("Non-existent key:", t("non.existent.key", "en"));
