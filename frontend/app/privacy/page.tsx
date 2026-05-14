import { LegalPageLayout } from "@/components/marketing/LegalPageLayout"

export default function PrivacyPolicy() {
    return (
        <LegalPageLayout title="Privacy Policy" lastUpdated="March 16, 2026">
            <h2>1. Information We Collect</h2>
            <p>We collect information to provide, manage, and improve the Platform:</p>
            <ul>
                <li><strong>Account Data:</strong> Name, email address, company name, and password.</li>
                <li><strong>Billing Data:</strong> Invoicing details and payment history. (Note: Full credit card data is securely stored and processed by Stripe; we do not store this data).</li>
                <li><strong>Usage & Training Data:</strong> Audio recordings (from voice AI simulations), text transcripts (from text AI simulations), quiz scores, workbook entries, certifications attained, and general platform interaction metrics.</li>
                <li><strong>Device & Technical Data:</strong> IP addresses, browser type, and operating system.</li>
            </ul>

            <h2>2. How We Use Your Data</h2>
            <ul>
                <li>To deliver and operate the training curriculum, AI simulations, and manager dashboards.</li>
                <li>To process payments and manage subscriptions.</li>
                <li>To analyze user performance and aggregate team analytics for your company administrators.</li>
                <li>To improve our AI models and training scenarios (audio and text interactions may be used internally to refine AI responses unless explicitly opted-out in Enterprise agreements).</li>
                <li>To send administrative notifications and customer support communications.</li>
            </ul>

            <h2>3. How Data is Stored and Protected</h2>
            <p>We implement industry-standard security measures, including encryption in transit and at rest, to protect your personal information. Access to your data is restricted to authorized personnel only.</p>

            <h2>4. Third-Party Tools</h2>
            <p>We use trusted third-party service providers to facilitate our services:</p>
            <ul>
                <li><strong>Stripe:</strong> For secure payment and subscription processing.</li>
                <li><strong>AI Providers:</strong> To process voice and text inputs for roleplay simulations.</li>
                <li><strong>Analytics Providers:</strong> To track platform usage and improve user experience.</li>
            </ul>
            <p>These providers are bound by strict data processing agreements to protect your data.</p>

            <h2>5. Your User Rights</h2>
            <p>Depending on your location, you may have the right to request access to, correction of, or deletion of your personal data. Please contact our support team to exercise these rights.</p>
        </LegalPageLayout>
    )
}
