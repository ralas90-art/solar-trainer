import { LegalPageLayout } from "@/components/marketing/LegalPageLayout"

export default function AcceptableUsePolicy() {
    return (
        <LegalPageLayout title="Acceptable Use Policy" lastUpdated="March 16, 2026">
            <p>This Acceptable Use Policy outlines prohibited actions on the Platform. A violation may result in immediate account termination.</p>
            
            <h2>Prohibited Activities</h2>
            <p>You agree NOT to:</p>
            <ul>
                <li><strong>Engage in Illegal Use:</strong> Use the Platform for any unlawful, fraudulent, or malicious purposes.</li>
                <li><strong>Harass or Abuse:</strong> Interact with the AI systems, or other users, using hate speech, threats, explicit language, or harassment.</li>
                <li><strong>Misuse AI Systems:</strong> Attempt to "jailbreak," prompt-inject, overload, disrupt, or manipulate the AI roleplay simulations to generate unintended or harmful outputs.</li>
                <li><strong>Reverse Engineer:</strong> Decompile, disassemble, or reverse engineer any part of the Platform, the AI models, or proprietary training curriculum.</li>
                <li><strong>Infringe Intellectual Property:</strong> Copy, distribute, or resell our training materials, scenarios, or codebase.</li>
                <li><strong>Non-Training Usage:</strong> Use the voice or text AI agents for live customer interactions, automated telemarketing, or any purpose other than internal sales training and roleplay.</li>
            </ul>
        </LegalPageLayout>
    )
}
