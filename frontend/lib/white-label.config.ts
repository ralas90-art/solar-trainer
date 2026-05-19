/**
 * white-label.config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All client-specific settings live here. To create a white-label instance
 * for a new solar dealer, duplicate this repo, change values in this ONE file,
 * and redeploy.
 */

export const WHITE_LABEL = {
    // ── Brand Identity ──────────────────────────────────────────────────────
    companyName: "SeptiVolt",
    tagline: "AI Solar Sales Training Operating System",
    supportEmail: "support@septivolt.com",
    industry: "Solar",
    industryName: "Solar",
    productName: "Solar Panels",
    objectName: "Roof",
    billName: "Electric Bill",
    repTitle: "Consultant",

    // ── Visual Theming ───────────────────────────────────────────────────────
    // Used for CSS variable injection (see layout.tsx / globals.css)
    colors: {
        primary: "#F97316",   // Solar Orange — buttons, accents
        primaryDim: "#EA580C",   // Orange dim — hover states
        surface: "#121212",   // Slate Base — main bg
        card: "#1A1A1A",   // Charcoal panel — card bg
        text: "#94A3B8",   // Silver text — primary text
    },

    // ── Logo ─────────────────────────────────────────────────────────────────
    // Place logo file at /public/brand/logo.png (or .svg)
    // Set to null to show companyName text instead.
    logoPath: null as string | null,

    // ── Presentation Mode ────────────────────────────────────────────────────
    // "local_pdf"    → serve PDFs from /public/slides/ (current setup)
    // "google_slides" → embed Google Slides iframes via slideEmbedUrls below
    // "download_only" → show PPTX download link only (old behaviour)
    presentationMode: "google_slides" as "local_pdf" | "google_slides" | "download_only",

    // ── Day PDF Paths (used when presentationMode = "local_pdf") ─────────────
    dayPdfPaths: {
        1: "/slides/Day_1_Foundation.pdf",
        2: "/slides/Day_2_Prospecting.pdf",
        3: "/slides/Day_3_Discovery.pdf",
        4: "/slides/Day_4_Presentation.pdf",
        5: "/slides/Day_5_Objections.pdf",
        6: "/slides/Day_6_Mastery.pdf",
        7: "/slides/Day_7_Certification.pdf",
    } as Record<number, string>,

    // ── Google Slides Embed URLs (used when presentationMode = "google_slides") ─
    // Paste the full src URL from "File → Share → Publish to web → Embed"
    // e.g. "https://docs.google.com/presentation/d/YOUR_ID/embed"
    slideEmbedUrls: {
        // Day-level (English)
        1: "https://docs.google.com/presentation/d/e/2PACX-1vRsatlMJGF45s06W4Yhn4yVeY5GeYEVHSzeWjd7poSgAV7EcG21NBE_IcmM4mqEng/pubembed?start=false&loop=false&delayms=3000",
        2: "https://docs.google.com/presentation/d/e/2PACX-1vTyrsdR9Ufio881hvDwmfAYWKFaB56Y8tZlRRLsO3uFdEi8Thv7Z-yVIiSR7rQ1RQ/pubembed?start=false&loop=false&delayms=3000",
        3: "https://docs.google.com/presentation/d/e/2PACX-1vSALSQ9PqyTtwq5rYLf-qltZZHt1Heq-YAmK_ISJiFTqc-d50e8BiU2_IyQMjVvJQ/pubembed?start=false&loop=false&delayms=3000",
        4: "https://docs.google.com/presentation/d/e/2PACX-1vQoaA1NsVyM1UL0-7Ux-UFsNZ36ijrwvDC_h3EksVLPvKHO4JrPEQgOb3EKwBQgow/pubembed?start=false&loop=false&delayms=3000",
        5: "https://docs.google.com/presentation/d/e/2PACX-1vRk4ryjJEA54rk3z4f_5Cg5pWqaJjE6OrscJ2UX3eylP3CO0zNbPA6oRJ_bJzI8jA/pubembed?start=false&loop=false&delayms=3000",
        6: "https://docs.google.com/presentation/d/e/2PACX-1vQV6lrQYl0V9PKwzkpaTaRXIO7zCvZQiSO4IaXj3SMegqwY5nZ7xH6IWEG_9oghVg/pubembed?start=false&loop=false&delayms=3000",
        7: "https://docs.google.com/presentation/d/e/2PACX-1vS4CgjxfPSmE0AvcjsAdVfLkbZw8X_Y9TeD75QTVMd2eWybyleylzqw2j4xvKwhtA/pubembed?start=false&loop=false&delayms=3000",

        // Additive Modules (English)
        "mod_1_5a": "https://docs.google.com/presentation/d/e/2PACX-1vTpB9_WD0GlCmfNpKOJlDsl-B5dtfDCI9N-UY9SEbCBEKinBI86VMPQrS1xW5EUoQ/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_5b": "https://docs.google.com/presentation/d/e/2PACX-1vQuXnKRjAle_DrLiQgrrF3RWEK0XTvy6AjJzOVse_3LYPLg6xhyv-iXevebljT8Ww/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_7a": "https://docs.google.com/presentation/d/e/2PACX-1vS7VgAeaymTwS_Uep-3JAXSm7ONANwzUycKktf8PQWbxXVDalTsNqxPlhmO-1YlLA/pubembed?start=false&loop=false&delayms=3000",
        "mod_3_7a": "https://docs.google.com/presentation/d/e/2PACX-1vSoJjN7b1AEGV7zqhO9PMLzX75JIwZXmRQhc6n-mgV9l2BqK71iz2KR-8CY5apW_w/pubembed?start=false&loop=false&delayms=3000",
        "mod_3_7b": "https://docs.google.com/presentation/d/e/2PACX-1vS8JVGLyczY0EbBy84_dcxwbIz_cBNTo7YDigd_loNyZDySWPSBq9bQsEkAo-ZC-g/pubembed?start=false&loop=false&delayms=3000",
        "mod_4_1a": "https://docs.google.com/presentation/d/e/2PACX-1vRuMKLo8JHZWST9oD0CK0iGC57Zsug_EkFg_9gnU6bl6g0LGOVZ0RJyv2hrMCFO0w/pubembed?start=false&loop=false&delayms=3000",
        "mod_4_2a": "https://docs.google.com/presentation/d/e/2PACX-1vSrxlzjEiZZY97xEvQ4CcvDpO8T6VfTQxYB42YxOPBtFwWjQ59qxhEqPTrvqVhBEQ/pubembed?start=false&loop=false&delayms=3000",
        "mod_4_2b": "https://docs.google.com/presentation/d/e/2PACX-1vROr9VfDeMlTtiQixAhUKWw0A7_KRiDlHnEfA7vaR9D7cTLv_BztPFiyNT0GMO6kQ/pubembed?start=false&loop=false&delayms=3000",
        "mod_5_5a": "https://docs.google.com/presentation/d/e/2PACX-1vS2W33TxVA5jSjMutQwQ0GyCmNzP3EbZ_hrqLDCSkkMtQpanEKujOCcZ9Zg51N2lQ/pubembed?start=false&loop=false&delayms=3000",
        "mod_5_5b": "https://docs.google.com/presentation/d/e/2PACX-1vSNePoOAB1BuOnbDiUM5pujIiIHsPShlFnF8dH5A3Q0p13eDXzhqYcwGdLugLheiA/pubembed?start=false&loop=false&delayms=3000",
        "mod_5_5c": "https://docs.google.com/presentation/d/e/2PACX-1vRQ-xbXpiiMqLtJDD1OGH-V6ZAeYxB-u1zQc4bzdHev0nMUteS4oyIKosfdX8I3hg/pubembed?start=false&loop=false&delayms=3000",
        "mod_5_5d": "https://docs.google.com/presentation/d/e/2PACX-1vQfbC5LEBsOpM4352Nf4wikHYOwv40H05Twv9Lg-aeK1Aw-GtXGfOr6bTJiNYgBTw/pubembed?start=false&loop=false&delayms=3000",
    } as Record<number | string, string>,

    // ── Google Slides Embed URLs (Spanish) ──────────────────────────────────
    // Localized Spanish versions — populated as Spanish decks are completed.
    slideEmbedUrls_es: {
        // Day-level (Spanish) — pending
        1: "PASTE_GOOGLE_SLIDES_ES_DAY_1_URL_HERE",
        2: "PASTE_GOOGLE_SLIDES_ES_DAY_2_URL_HERE",
        3: "PASTE_GOOGLE_SLIDES_ES_DAY_3_URL_HERE",
        4: "PASTE_GOOGLE_SLIDES_ES_DAY_4_URL_HERE",
        5: "PASTE_GOOGLE_SLIDES_ES_DAY_5_URL_HERE",
        6: "PASTE_GOOGLE_SLIDES_ES_DAY_6_URL_HERE",
        7: "PASTE_GOOGLE_SLIDES_ES_DAY_7_URL_HERE",

        // Additive Modules (Spanish)
        "mod_1_5a": "https://docs.google.com/presentation/d/e/2PACX-1vR8WywcLNRZR5YvNcAjYVfXk7KMjz-ObEL7F6K1LX1ufx83x5ONfGVkj6_GCOrH1Q/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_5b": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_1_7a": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_3_7a": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_3_7b": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_4_1a": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_4_2a": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_4_2b": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_5_5a": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_5_5b": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_5_5c": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
        "mod_5_5d": "PASTE_GOOGLE_SLIDES_ES_URL_HERE",
    } as Record<number | string, string>,
} as const

// ── Module Slide Start Pages ─────────────────────────────────────────────────
// Auto-generated by extract_slide_modules.py — do not edit manually.
// Each value is the 1-indexed slide number where that module begins in the day PDF.
export const SLIDE_START_PAGES: Record<string, number> = {
    "mod_1_1": 1,
    "mod_1_2": 10,
    "mod_1_3": 15,
    "mod_1_4": 21,
    "mod_1_5": 28,
    "mod_1_6": 38,
    "mod_1_7": 44,
    "mod_1_8": 1,
    "mod_2_1": 1,
    "mod_2_2": 2,
    "mod_2_3": 2,
    "mod_2_4": 2,
    "mod_2_5": 2,
    "mod_2_6": 2,
    "mod_2_7": 2,
    "mod_2_8": 2,
    "mod_3_1": 1,
    "mod_3_2": 12,
    "mod_3_3": 22,
    "mod_3_4": 30,
    "mod_3_5": 39,
    "mod_3_6": 48,
    "mod_3_7": 55,
    "mod_3_8": 62,
    "mod_3_9": 67,
    "mod_4_1": 1,
    "mod_4_2": 12,
    "mod_4_3": 22,
    "mod_4_4": 32,
    "mod_4_5": 42,
    "mod_4_6": 51,
    "mod_4_7": 60,
    "mod_4_8": 69,
    "mod_4_9": 78,
    "mod_5_1": 1,
    "mod_5_2": 10,
    "mod_5_3": 18,
    "mod_5_4": 24,
    "mod_5_5": 30,
    "mod_5_6": 37,
    "mod_5_7": 43,
    "mod_5_8": 50,
    "mod_5_9": 56,
    "mod_5_10": 62,
    "mod_6_1": 1,
    "mod_6_2": 9,
    "mod_6_3": 18,
    "mod_6_4": 25,
    "mod_6_5": 31,
    "mod_6_6": 37,
    "mod_6_7": 43,
    "mod_6_8": 50,
    "mod_6_9": 56,
    "mod_7_1": 1,
    "mod_7_2": 8,
    "mod_7_3": 14,
    "mod_7_4": 19,
    "mod_7_5": 25,
    "mod_7_6": 30,
    "mod_7_8": 42,
    "mod_7_9": 48,
}

// ── Google Slides Resolution Helper ──────────────────────────────────────────
export function getGoogleSlidesEmbedUrl(moduleId: string, language: string): string | null {
    if (WHITE_LABEL.presentationMode !== "google_slides") return null;

    const esUrls = WHITE_LABEL.slideEmbedUrls_es || {};
    const enUrls = WHITE_LABEL.slideEmbedUrls || {};
    const dayNum = parseInt(moduleId.split("_")[1], 10);

    const isPlaceholder = (url?: string) => {
        if (!url || url.trim() === "") return true;
        if (url.startsWith("PASTE_")) return true;
        return false;
    };

    let resolvedUrl: string | null = null;

    if (language === "es") {
        let url = esUrls[moduleId as keyof typeof esUrls];
        if (!isPlaceholder(url)) {
            resolvedUrl = url;
        } else if (Number.isFinite(dayNum)) {
            url = esUrls[dayNum as keyof typeof esUrls];
            if (!isPlaceholder(url)) {
                resolvedUrl = url;
            }
        }
    }

    // Fallback to English
    if (!resolvedUrl) {
        let url = enUrls[moduleId as keyof typeof enUrls];
        if (!isPlaceholder(url)) {
            resolvedUrl = url;
        } else if (Number.isFinite(dayNum)) {
            url = enUrls[dayNum as keyof typeof enUrls];
            if (!isPlaceholder(url)) {
                resolvedUrl = url;
            }
        }
    }

    // Console-safe behavior: only warn for English missing or invalid format
    if (!resolvedUrl) {
        console.warn(`[Slide Fallback Warning] No valid slide URL found for module ${moduleId}.`);
    } else if (!resolvedUrl.includes("docs.google.com/presentation")) {
        console.warn(`[Slide Fallback Warning] URL for module ${moduleId} does not look like a valid Google Slides embed URL: ${resolvedUrl}`);
    }

    return resolvedUrl;
}
