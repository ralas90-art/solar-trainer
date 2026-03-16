import { LegalPageLayout } from "@/components/marketing/LegalPageLayout"

export default function RefundPolicy() {
    return (
        <LegalPageLayout title="Refund and Cancellation Policy" lastUpdated="March 16, 2026">
            <h2>1. Subscription Billing Cycle</h2>
            <p>Customarily, you are billed monthly or annually in advance. The bill includes the base Platform Fee and the variable fee for the number of active representatives registered to your tier.</p>

            <h2>2. Cancellation Rules</h2>
            <ul>
                <li>You may cancel your subscription at any time via the billing section in your manager dashboard or by contacting support.</li>
                <li>Upon cancellation, your account will remain active until the end of the current paid billing cycle.</li>
                <li>We do not prorate cancellations occurring mid-cycle.</li>
            </ul>

            <h2>3. Refund Conditions</h2>
            <ul>
                <li><strong>No Refunds:</strong> All Platform Fees and per-rep user fees are strictly non-refundable once billed.</li>
                <li><strong>Exceptions:</strong> Refunds are only provided if there is a verified billing error on our part, or if mandated by applicable consumer protection laws.</li>
            </ul>

            <h2>4. Billing Changes</h2>
            <p>If you add additional representatives mid-cycle, you will be billed a prorated amount for those users for the remainder of the month. If you remove representatives, the updated seat count will take effect at the start of the next billing cycle.</p>
        </LegalPageLayout>
    )
}
