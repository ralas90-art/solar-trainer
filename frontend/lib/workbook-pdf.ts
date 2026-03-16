// Workbook PDF Generator — generates a downloadable PDF for a training day
import { jsPDF } from "jspdf"
import { DAY_MODULES, MODULES, type WorkbookPrompt } from "@/lib/modules"
import { getDayResponses } from "@/lib/workbook-storage"

export function generateDayWorkbookPDF(dayNumber: number, repName?: string): void {
    const dayInfo = DAY_MODULES.find(d => d.dayNumber === dayNumber)
    if (!dayInfo) return

    const responses = getDayResponses(dayNumber)
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - margin * 2
    let y = margin

    // ── Title Page ──
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    doc.text(`Day ${dayNumber} Workbook`, pageWidth / 2, 60, { align: "center" })

    doc.setFontSize(18)
    doc.setFont("helvetica", "normal")
    doc.text(dayInfo.title, pageWidth / 2, 75, { align: "center" })

    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text(dayInfo.subtitle, pageWidth / 2, 88, { align: "center" })

    if (repName) {
        doc.setFontSize(12)
        doc.text(`Representative: ${repName}`, pageWidth / 2, 110, { align: "center" })
    }

    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 125, { align: "center" })
    doc.setTextColor(0, 0, 0)

    // ── Objectives ──
    doc.addPage()
    y = margin
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Day Objectives", margin, y)
    y += 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    dayInfo.objectives.forEach(obj => {
        if (y > 270) { doc.addPage(); y = margin }
        const lines = doc.splitTextToSize(`• ${obj}`, contentWidth)
        doc.text(lines, margin, y)
        y += lines.length * 6 + 2
    })

    // ── Module Responses ──
    dayInfo.modules.forEach(modInfo => {
        const moduleData = MODULES[modInfo.id]
        if (!moduleData?.workbookPrompts?.length) return

        const modResponses = responses[modInfo.id] || {}

        // Module Header
        if (y > 240) { doc.addPage(); y = margin }
        y += 8
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(50, 50, 150)
        const titleLines = doc.splitTextToSize(`Module ${modInfo.moduleNumber}: ${modInfo.title}`, contentWidth)
        doc.text(titleLines, margin, y)
        y += titleLines.length * 7 + 4
        doc.setTextColor(0, 0, 0)

        // Draw separator
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, y, pageWidth - margin, y)
        y += 6

        // Prompts and Responses
        moduleData.workbookPrompts.forEach((prompt: WorkbookPrompt) => {
            if (y > 255) { doc.addPage(); y = margin }

            // Question
            doc.setFontSize(11)
            doc.setFont("helvetica", "bold")
            const qLines = doc.splitTextToSize(prompt.label, contentWidth)
            doc.text(qLines, margin, y)
            y += qLines.length * 6 + 3

            // Response
            doc.setFont("helvetica", "normal")
            const response = modResponses[prompt.id]

            if (prompt.type === "checklist" && prompt.items) {
                const checkedItems = Array.isArray(response) ? response : []
                prompt.items.forEach(item => {
                    if (y > 270) { doc.addPage(); y = margin }
                    const checked = checkedItems.includes(item)
                    const prefix = checked ? "☑" : "☐"
                    const itemLines = doc.splitTextToSize(`${prefix} ${item}`, contentWidth - 5)
                    doc.text(itemLines, margin + 5, y)
                    y += itemLines.length * 5 + 2
                })
            } else if (prompt.type === "rating") {
                const ratingVal = typeof response === "number" ? response : 0
                const max = prompt.maxRating || 5
                doc.text(`Rating: ${ratingVal}/${max}`, margin + 5, y)
                y += 7
            } else {
                // open_response or fill_blank
                const textVal = typeof response === "string" && response.trim() ? response : "(No response)"
                doc.setTextColor(response ? 0 : 150, response ? 0 : 150, response ? 0 : 150)
                const rLines = doc.splitTextToSize(textVal, contentWidth - 5)
                doc.text(rLines, margin + 5, y)
                y += rLines.length * 5 + 4
                doc.setTextColor(0, 0, 0)
            }

            y += 4
        })
    })

    // ── Deliverables ──
    if (dayInfo.deliverables.length > 0) {
        if (y > 240) { doc.addPage(); y = margin }
        y += 10
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("Deliverables Checklist", margin, y)
        y += 10

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        dayInfo.deliverables.forEach(d => {
            if (y > 270) { doc.addPage(); y = margin }
            const lines = doc.splitTextToSize(`☐ ${d}`, contentWidth)
            doc.text(lines, margin, y)
            y += lines.length * 6 + 2
        })
    }

    // Save
    doc.save(`Day_${dayNumber}_Workbook_${new Date().toISOString().split("T")[0]}.pdf`)
}
