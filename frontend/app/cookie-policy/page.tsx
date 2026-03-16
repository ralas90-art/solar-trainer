import { LegalPageLayout } from "@/components/marketing/LegalPageLayout"

export default function CookiePolicy() {
    return (
        <LegalPageLayout title="Cookie Policy" lastUpdated="March 16, 2026">
            <h2>1. How Cookies Are Used</h2>
            <p>We use cookies and similar tracking technologies to ensure the Platform functions correctly, to remember your login session, and to save your preferences.</p>

            <h2>2. Types of Cookies</h2>
            <ul>
                <li><strong>Essential Cookies:</strong> Necessary for the Platform to operate (e.g., authentication, security). These cannot be disabled.</li>
                <li><strong>Analytics Cookies:</strong> Used to understand how users interact with our training modules and dashboards so we can improve the curriculum and user interface.</li>
            </ul>

            <h2>3. Managing Cookie Preferences</h2>
            <p>You can instruct your browser to refuse all non-essential cookies or to indicate when a cookie is being sent. However, if you do not accept essential cookies, you may not be able to use certain sections of the Platform.</p>
        </LegalPageLayout>
    )
}
