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
    industry: "Solar",
    ownerName: "Rob",
    tagline: "AI Solar Sales Training Operating System",
    supportEmail: "support@training-os.com", // Generalized default
    isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || false,

    // ── Visual Theming ───────────────────────────────────────────────────────
    // Used for CSS variable injection (see layout.tsx / globals.css)
    colors: {
        primary: "#FF5722",   // SeptiVolt Orange
        primaryDim: "#EA580C", // Orange dim
        accent: "#FFB300",    // Amber Accent
        accentDim: "#FFD54F", // Amber Accent Dim
        surface: "#121212",   // Slate Base
        card: "#1A1A1A",      // Charcoal panel
        text: "#94A3B8",      // Silver text
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
        // Day-level Defaults
        1: "https://docs.google.com/presentation/d/e/2PACX-1vRsatlMJGF45s06W4Yhn4yVeY5GeYEVHSzeWjd7poSgAV7EcG21NBE_IcmM4mqEng/pubembed?start=false&loop=false&delayms=3000",
        2: "https://docs.google.com/presentation/d/e/2PACX-1vTyrsdR9Ufio881hvDwmfAYWKFaB56Y8tZlRRLsO3uFdEi8Thv7Z-yVIiSR7rQ1RQ/pubembed?start=false&loop=false&delayms=3000",
        3: "https://docs.google.com/presentation/d/e/2PACX-1vSALSQ9PqyTtwq5rYLf-qltZZHt1Heq-YAmK_ISJiFTqc-d50e8BiU2_IyQMjVvJQ/pubembed?start=false&loop=false&delayms=3000",
        4: "https://docs.google.com/presentation/d/e/2PACX-1vQoaA1NsVyM1UL0-7Ux-UFsNZ36ijrwvDC_h3EksVLPvKHO4JrPEQgOb3EKwBQgow/pubembed?start=false&loop=false&delayms=3000",
        5: "https://docs.google.com/presentation/d/e/2PACX-1vRk4ryjJEA54rk3z4f_5Cg5pWqaJjE6OrscJ2UX3eylP3CO0zNbPA6oRJ_bJzI8jA/pubembed?start=false&loop=false&delayms=3000",
        6: "https://docs.google.com/presentation/d/e/2PACX-1vQV6lrQYl0V9PKwzkpaTaRXIO7zCvZQiSO4IaXj3SMegqwY5nZ7xH6IWEG_9oghVg/pubembed?start=false&loop=false&delayms=3000",
        7: "https://docs.google.com/presentation/d/e/2PACX-1vS4CgjxfPSmE0AvcjsAdVfLkbZw8X_Y9TeD75QTVMd2eWybyleylzqw2j4xvKwhtA/pubembed?start=false&loop=false&delayms=3000",

        // Personalized Additive Modules (Paste new URLs here)
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
    // Localized Spanish versions of the presentation slides.
    slideEmbedUrls_es: {
        // Day-level Defaults
        1: "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        2: "https://docs.google.com/presentation/d/e/2PACX-1vQM9yoQayiCQepKd3BQqIae0Nwl3LsxWn7bngzh7do07m8JsXtDS0kxndR0KIQp_w/pubembed?start=false&loop=false&delayms=3000",
        3: "https://docs.google.com/presentation/d/e/2PACX-1vScA32SqbTtGn2D7rl33c881w-wJ0Q_8I0EPrOQFdwIqrhtZaEJfqZmnlsyPQ-ddw/pubembed?start=false&loop=false&delayms=3000",
        4: "https://docs.google.com/presentation/d/e/2PACX-1vT-phVLKwjOrGkVe_Tm2enXGA6EUj5QNtTR52yHnbuI0ml9GUQJHF7MbOvwRle3yQ/pubembed?start=false&loop=false&delayms=3000",
        5: "https://docs.google.com/presentation/d/e/2PACX-1vRuefKvWIJslDDoMI25_UPDuraI0zgNQ_num17p8Waco31SAlkAJJfpDrF5aJs_Uw/pubembed?start=false&loop=false&delayms=3000",
        6: "https://docs.google.com/presentation/d/e/2PACX-1vST_b1uOCEH6kKHSo4ZlNRpb49aal9mVR6FoQ72PYZIJhiBZ5RveoWvog-fpwEKPg/pubembed?start=false&loop=false&delayms=3000",
        7: "https://docs.google.com/presentation/d/e/2PACX-1vTtOZRqtYZIhzwgtqehjEbrE1bVNeXGAiMohS3djwx4FpiiEA5n0HDU10yS0g763Q/pubembed?start=false&loop=false&delayms=3000",

        // Additive & V2 Modules (Spanish)
        "mod_1_1": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_2": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_3": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_4": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_5": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_5a": "https://docs.google.com/presentation/d/e/2PACX-1vTzQQ5h5m7CWwvhqoD24RrAfgPQ2MBz1g15cgsZkASd0tb91iTaeaCodmCCBYM_wA/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_5b": "https://docs.google.com/presentation/d/e/2PACX-1vRgOzoaEWFHdY9ACvROS9eKPCTbMJqWMWXcYQTSANudA3d_DBjghSoQh2DRmg_NSw/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_5c": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_6": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_7": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_7a": "https://docs.google.com/presentation/d/e/2PACX-1vTxufpg8rdQhPFvPajf-ztxLdnzKxdLKJt1gCDZBuAc_ncCYk9mp1A6EWHvgbDP7A/pubembed?start=false&loop=false&delayms=3000",
        "mod_1_8": "https://docs.google.com/presentation/d/e/2PACX-1vTmd8NaSkdY2p1SxvgcKa4BaOVTBz8AXdYGdQDwV2buO30B8duZRrUPh9LmgvO6zg/pubembed?start=false&loop=false&delayms=3000",
        
        "mod_3_7a": "https://docs.google.com/presentation/d/e/2PACX-1vTMRM_O6yozqGjp0ui_qswdYVVc8adgRmYEIYPk-DV-X6OBs7UG8MKz2MlDQ1omLA/pubembed?start=false&loop=false&delayms=3000",
        "mod_3_7b": "https://docs.google.com/presentation/d/e/2PACX-1vQvdkxCgoxyRNFg9cs8SB3xih44r6nVVnI6aBfeK42QhYb3kt_I8h7aTo8AXRSvZQ/pubembed?start=false&loop=false&delayms=3000",
        
        "mod_4_1a": "https://docs.google.com/presentation/d/e/2PACX-1vSHHirgcQEC0c-OniZKZdC2D4uwNlhgAN_eRqPDGqyoK3Bn1GKq0K93u27UvgI41g/pubembed?start=false&loop=false&delayms=3000",
        "mod_4_2a": "https://docs.google.com/presentation/d/e/2PACX-1vT5f6flDdCG6xFN-E6-fuKDWVX8MuyS1gGG5RiXQcwIbzgQIdZwr1Gk6RRO8HLXqw/pubembed?start=false&loop=false&delayms=3000",
        "mod_4_2b": "https://docs.google.com/presentation/d/e/2PACX-1vT5f6flDdCG6xFN-E6-fuKDWVX8MuyS1gGG5RiXQcwIbzgQIdZwr1Gk6RRO8HLXqw/pubembed?start=false&loop=false&delayms=3000",
        
        "mod_5_5a": "https://docs.google.com/presentation/d/e/2PACX-1vT1U8AWN05x-Ecpev5b_HGoMYrVc66b3WxsDY1qPI1t0sJ8VUN35xvVMLPa4PijXQ/pubembed?start=false&loop=false&delayms=3000",
        "mod_5_5b": "https://docs.google.com/presentation/d/e/2PACX-1vS9E1YX0PXiC8ae-s5uWVUVdoIPgjRy3a8szd1_CP6kZ54yrHqGCH3VAjjGhXKNgg/pubembed?start=false&loop=false&delayms=3000",
        "mod_5_5c": "https://docs.google.com/presentation/d/e/2PACX-1vT4RexDdoDILf7MHbTDF33LuTn5dYeNq73-aoqzvNe-3hAY6FuWljARRHpkE-FcHA/pubembed?start=false&loop=false&delayms=3000",
        "mod_5_5d": "https://docs.google.com/presentation/d/e/2PACX-1vRwE3Mouy1vMd6eslXkKe5B7Zr7LuzqEpeSCWLeAgOERGVntty9BJDj9ZGcFaOQcQ/pubembed?start=false&loop=false&delayms=3000",
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
    "mod_5_5a": 31,
    "mod_5_5b": 32,
    "mod_5_5c": 33,
    "mod_5_5d": 34,
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

export const INDUSTRY = WHITE_LABEL.industry;
export const COMPANY_NAME = WHITE_LABEL.companyName;
