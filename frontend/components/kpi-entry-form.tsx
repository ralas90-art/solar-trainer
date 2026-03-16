"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Save, CheckCircle2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface KPIDefinition {
    id: string
    label: string
    description: string | null
    target_value: number | null
    display_order: number
    is_active: boolean
}

interface KPIEntry {
    id: string
    kpi_definition_id: string
    kpi_label: string
    date: string
    value: number
    target: number | null
    notes: string | null
}

interface KPIEntryFormProps {
    kpiDefinitions: KPIDefinition[]
    todayEntries: KPIEntry[]
    onEntrySaved: () => void
}

export function KPIEntryForm({ kpiDefinitions, todayEntries, onEntrySaved }: KPIEntryFormProps) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [values, setValues] = useState<Record<string, number>>({})
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Initialize values from today's entries
    useEffect(() => {
        const initialValues: Record<string, number> = {}
        todayEntries.forEach(entry => {
            initialValues[entry.kpi_definition_id] = entry.value
        })
        setValues(initialValues)
    }, [todayEntries])

    const handleValueChange = (kpiId: string, value: string) => {
        const numValue = parseInt(value) || 0
        setValues(prev => ({ ...prev, [kpiId]: numValue }))
    }

    const handleSave = async () => {
        setSaving(true)
        setSaved(false)

        try {
            // Prepare bulk entries
            const entries = Object.entries(values).map(([kpiId, value]) => ({
                kpi_definition_id: kpiId,
                value: value
            }))

            const response = await fetch(`${API_URL}/api/v1/kpis/entries/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    date: date,
                    entries: entries
                })
            })

            if (response.ok) {
                setSaved(true)
                onEntrySaved()
                setTimeout(() => setSaved(false), 3000)
            } else {
                alert('Failed to save entries')
            }
        } catch (error) {
            console.error('Error saving entries:', error)
            alert('Error saving entries')
        } finally {
            setSaving(false)
        }
    }

    const isToday = date === new Date().toISOString().split('T')[0]

    // Deduplicate KPIs by label to handle potential backend duplicates
    const uniqueKPIs = kpiDefinitions.filter((kpi, index, self) =>
        index === self.findIndex((t) => (
            t.label === kpi.label
        ))
    )

    return (
        <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            {isToday ? "Today's Numbers" : 'Daily Entry'}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {isToday ? 'Log your metrics for today' : `Logging for ${date}`}
                        </CardDescription>
                    </div>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-48 bg-slate-950 border-slate-800 text-white"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* KPI Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uniqueKPIs.map((kpi) => {
                            const value = values[kpi.id] || 0
                            const target = kpi.target_value || 0
                            const percentage = target > 0 ? (value / target) * 100 : 0
                            const isComplete = percentage >= 100

                            return (
                                <div key={kpi.id} className="space-y-2">
                                    <Label htmlFor={kpi.id} className="flex items-center justify-between text-slate-200">
                                        <span>{kpi.label}</span>
                                        {target > 0 && (
                                            <span className="text-sm text-slate-500">
                                                Goal: {target}
                                            </span>
                                        )}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={kpi.id}
                                            type="number"
                                            min="0"
                                            value={values[kpi.id] || ''}
                                            onChange={(e) => handleValueChange(kpi.id, e.target.value)}
                                            placeholder="0"
                                            className={`text-lg bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 ${isComplete ? 'border-green-500/50 bg-green-500/10' : ''}`}
                                        />
                                        {isComplete && (
                                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                    {target > 0 && (
                                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all ${percentage >= 100
                                                    ? 'bg-green-500'
                                                    : percentage >= 75
                                                        ? 'bg-blue-500'
                                                        : percentage >= 50
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>
                                    )}
                                    {kpi.description && (
                                        <p className="text-xs text-slate-500">{kpi.description}</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-slate-200">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any observations about today's performance..."
                            rows={3}
                            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={saving || kpiDefinitions.length === 0}
                            size="lg"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save {isToday ? "Today's" : ''} Data
                                </>
                            )}
                        </Button>
                        {saved && (
                            <div className="flex items-center gap-2 text-green-400 font-medium">
                                <CheckCircle2 className="w-5 h-5" />
                                Saved!
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
