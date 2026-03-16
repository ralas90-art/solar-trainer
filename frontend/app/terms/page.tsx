import { LegalPageLayout } from "@/components/marketing/LegalPageLayout"

export default function TermsOfService() {
    return (
        <LegalPageLayout title="Terms of Service" lastUpdated="March 16, 2026">
            <h2>1. Subscription Terms and Access</h2>
            <p>The Platform operates on a subscription model offering three tiers: Starter, Growth, and Enterprise.</p>
            <ul>
                <li><strong>Fees:</strong> Subscriptions consist of a base monthly Platform Fee plus a per-active-representative fee, billed in advance on a monthly or annual basis, as outlined in your selected plan.</li>
                <li><strong>Tiers:</strong> Features—such as text/voice AI roleplay, dashboards, and reporting—are limited to the specific tier to which you subscribe.</li>
                <li><strong>Changes:</strong> We reserve the right to modify our pricing or plan features upon 30 days notice to you.</li>
            </ul>

            <h2>2. Billing and Payments</h2>
            <p>All payments are processed securely through our third-party payment processor, Stripe. By providing payment information, you authorize Stripe and us to charge your payment method for all applicable fees.</p>
            <ul>
                <li><strong>Failures:</strong> If a payment method fails, we may suspend access to the Platform until the outstanding balance is settled.</li>
                <li><strong>Taxes:</strong> Prices do not include applicable taxes, which you are responsible for paying.</li>
            </ul>

            <h2>3. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized access.</p>

            <h2>4. Cancellation Policy</h2>
            <p>You may cancel your subscription at any time through your account settings or by contacting our support team. Cancellations take effect at the end of the current billing cycle. You will retain access to the Platform until that billing cycle concludes. Platform fees and per-rep fees already paid are non-refundable unless otherwise required by law.</p>

            <h2>5. Intellectual Property Ownership</h2>
            <p>All content on the Platform, including but not limited to training curriculum, narrated modules, AI roleplay scenarios, software code, and UI design, is the exclusive property of SeptiVolt or its licensors. You are granted a limited, non-exclusive, non-transferable license to use the Platform solely for internal training purposes during your active subscription period.</p>

            <h2>6. Disclaimers About Training Results</h2>
            <p>The Platform provides training, educational materials, and AI simulations intended to improve solar sales performance. <strong>However, we make no guarantees, warranties, or promises regarding specific financial outcomes, increased sales volume, or commission earnings.</strong> Sales success depends on numerous independent factors outside our control. The AI simulations are for educational purposes and do not substitute for professional legal, financial, or direct management advice.</p>

            <h2>7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, SeptiVolt and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of or inability to use the Platform. In no event shall our total liability exceed the amounts you paid to us in the twelve (12) months preceding the claim.</p>

            <h2>8. Acceptable Use</h2>
            <p>You agree to use the Platform only for its intended training purposes and strictly in accordance with our Acceptable Use Policy.</p>

            <h2>9. Termination Conditions</h2>
            <p>We reserve the right to suspend or terminate your account immediately, without prior notice or refund, if you breach these Terms or the Acceptable Use Policy.</p>

            <h2>10. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
        </LegalPageLayout>
    )
}
