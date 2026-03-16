import { AudioLessonSection } from "@/lib/training-audio"
import { CheckCircle2, PlayCircle } from "lucide-react"

export function AudioSectionList({
  sections,
  activeSectionId,
  completedSections,
  onSelectSection,
}: {
  sections: AudioLessonSection[]
  activeSectionId: string
  completedSections: Record<string, boolean>
  onSelectSection: (sectionId: string) => void
}) {
  return (
    <div className="space-y-2">
      {sections.map((section, index) => {
        const active = section.id === activeSectionId
        const completed = Boolean(completedSections[section.id])
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelectSection(section.id)}
            className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
              active
                ? "border-[#FF5722]/35 bg-[#FF5722]/10"
                : "border-white/10 bg-white/5 hover:border-[#FF5722]/20"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-hud text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">
                  Section {index + 1}
                </p>
                <p className="text-sm text-white">{section.title}</p>
              </div>
              {completed ? <CheckCircle2 className="h-4 w-4 text-[#FFB300]" /> : <PlayCircle className="h-4 w-4 text-[#FF5722]" />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
