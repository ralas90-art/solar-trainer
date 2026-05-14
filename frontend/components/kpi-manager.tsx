"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, Trash2, GripVertical, Save } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface KPIDefinition {
    id: string
    label: string
    description: string | null
    target_value: number | null
    display_order: number
    is_active: boolean
}

interface Template {
    id: string
    name: string
    description: string | null
    is_default: boolean
    kpis: Array<{
        label: string
        description: string | null
        target_value: number | null
    }>
}

interface KPIManagerProps {
    kpiDefinitions: KPIDefinition[]
    onClose: () => void
    onKPIsUpdated: () => void
}

export function KPIManager({ kpiDefinitions, onClose, onKPIsUpdated }: KPIManagerProps) {
    const [templates, setTemplates] = useState<Template[]>([])
    const [editingKPI, setEditingKPI] = useState<KPIDefinition | null>(null)
    const [newKPI, setNewKPI] = useState({ label: '', description: '', target_value: '' })
    const [showNewForm, setShowNewForm] = useState(false)

    useEffect(() => {
        loadTemplates()
    }, [])

    const loadTemplates = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/kpis/templates`)
            if (response.ok) {
                const data = await response.json()
                setTemplates(data)
            }
        } catch (error) {
            console.error('Error loading templates:', error)
        }
    }

    const handleApplyTemplate = async (templateId: string) => {
        if (!confirm('This will add KPIs from the template. Continue?')) return

        try {
            const response = await fetch(`${API_URL}/api/v1/kpis/templates/${templateId}/apply`, {
                method: 'POST',
                credentials: 'include'
            })

            if (response.ok) {
                onKPIsUpdated()
            } else {
                alert('Failed to apply template')
            }
        } catch (error) {
            console.error('Error applying template:', error)
            alert('Error applying template')
        }
    }

    const handleCreateKPI = async () => {
        if (!newKPI.label.trim()) {
            alert('Please enter a KPI label')
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/v1/kpis/definitions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    label: newKPI.label,
                    description: newKPI.description || null,
                    target_value: newKPI.target_value ? parseInt(newKPI.target_value) : null
                })
            })

            if (response.ok) {
                setNewKPI({ label: '', description: '', target_value: '' })
                setShowNewForm(false)
                onKPIsUpdated()
            } else {
                alert('Failed to create KPI')
            }
        } catch (error) {
            console.error('Error creating KPI:', error)
            alert('Error creating KPI')
        }
    }

    const handleUpdateKPI = async (kpi: KPIDefinition) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/kpis/definitions/${kpi.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    label: kpi.label,
                    description: kpi.description,
                    target_value: kpi.target_value
                })
            })

            if (response.ok) {
                setEditingKPI(null)
                onKPIsUpdated()
            } else {
                alert('Failed to update KPI')
            }
        } catch (error) {
            console.error('Error updating KPI:', error)
            alert('Error updating KPI')
        }
    }

    const handleDeleteKPI = async (kpiId: string) => {
        if (!confirm('Are you sure you want to delete this KPI? This will also delete all associated entries.')) return

        try {
            const response = await fetch(`${API_URL}/api/v1/kpis/definitions/${kpiId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                onKPIsUpdated()
            } else {
                alert('Failed to delete KPI')
            }
        } catch (error) {
            console.error('Error deleting KPI:', error)
            alert('Error deleting KPI')
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manage KPIs</h1>
                        <p className="text-slate-400 mt-1">Customize your tracking metrics</p>
                    </div>
                    <Button onClick={onClose} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        <X className="w-4 h-4 mr-2" />
                        Close
                    </Button>
                </div>

                {/* Templates */}
                {kpiDefinitions.length === 0 && (
                    <Card className="mb-6 bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">📋 Quick Start Templates</CardTitle>
                            <CardDescription className="text-slate-400">Choose a preset template to get started quickly</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {templates.map((template) => (
                                    <Card key={template.id} className="cursor-pointer bg-slate-950 border-slate-800 hover:border-purple-500/50 transition-colors">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                                            <CardDescription className="text-sm text-slate-400">{template.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 mb-4">
                                                {template.kpis.map((kpi, idx) => (
                                                    <div key={idx} className="text-sm flex items-center justify-between text-slate-300">
                                                        <span>{kpi.label}</span>
                                                        {kpi.target_value && (
                                                            <Badge variant="secondary" className="bg-slate-800 text-slate-300">{kpi.target_value}/day</Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                onClick={() => handleApplyTemplate(template.id)}
                                                className="w-full bg-purple-600 hover:bg-purple-700"
                                                size="sm"
                                            >
                                                Use This Template
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Your KPIs */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-white">Your KPIs</CardTitle>
                                <CardDescription className="text-slate-400">Drag to reorder, click to edit</CardDescription>
                            </div>
                            <Button onClick={() => setShowNewForm(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                New KPI
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {/* New KPI Form */}
                            {showNewForm && (
                                <Card className="border-2 border-purple-500 bg-slate-950">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="new-label" className="text-slate-200">KPI Label *</Label>
                                                <Input
                                                    id="new-label"
                                                    value={newKPI.label}
                                                    onChange={(e) => setNewKPI({ ...newKPI, label: e.target.value })}
                                                    placeholder="e.g., Knocks, Calls Made"
                                                    className="bg-slate-900 border-slate-700 text-white"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="new-description" className="text-slate-200">Description</Label>
                                                <Textarea
                                                    id="new-description"
                                                    value={newKPI.description}
                                                    onChange={(e) => setNewKPI({ ...newKPI, description: e.target.value })}
                                                    placeholder="Optional description"
                                                    rows={2}
                                                    className="bg-slate-900 border-slate-700 text-white"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="new-target" className="text-slate-200">Daily Target</Label>
                                                <Input
                                                    id="new-target"
                                                    type="number"
                                                    value={newKPI.target_value}
                                                    onChange={(e) => setNewKPI({ ...newKPI, target_value: e.target.value })}
                                                    placeholder="e.g., 100"
                                                    className="bg-slate-900 border-slate-700 text-white"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={handleCreateKPI} className="flex-1 bg-green-600 hover:bg-green-700">
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Create KPI
                                                </Button>
                                                <Button onClick={() => setShowNewForm(false)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Existing KPIs */}
                            {kpiDefinitions.map((kpi) => (
                                <Card key={kpi.id} className="bg-slate-950 border-slate-800">
                                    <CardContent className="pt-6">
                                        {editingKPI?.id === kpi.id ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-slate-200">Label</Label>
                                                    <Input
                                                        value={editingKPI.label}
                                                        onChange={(e) => setEditingKPI({ ...editingKPI, label: e.target.value })}
                                                        className="bg-slate-900 border-slate-700 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-slate-200">Description</Label>
                                                    <Textarea
                                                        value={editingKPI.description || ''}
                                                        onChange={(e) => setEditingKPI({ ...editingKPI, description: e.target.value })}
                                                        rows={2}
                                                        className="bg-slate-900 border-slate-700 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-slate-200">Daily Target</Label>
                                                    <Input
                                                        type="number"
                                                        value={editingKPI.target_value || ''}
                                                        onChange={(e) => setEditingKPI({ ...editingKPI, target_value: parseInt(e.target.value) || null })}
                                                        className="bg-slate-900 border-slate-700 text-white"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => handleUpdateKPI(editingKPI)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                                        Save Changes
                                                    </Button>
                                                    <Button onClick={() => setEditingKPI(null)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <GripVertical className="w-5 h-5 text-slate-600 cursor-move" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-white">{kpi.label}</div>
                                                    {kpi.description && (
                                                        <div className="text-sm text-slate-500">{kpi.description}</div>
                                                    )}
                                                    {kpi.target_value && (
                                                        <Badge variant="secondary" className="mt-1 bg-slate-800 text-slate-300">
                                                            Target: {kpi.target_value}/day
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => setEditingKPI(kpi)} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                                                        Edit
                                                    </Button>
                                                    <Button onClick={() => handleDeleteKPI(kpi.id)} variant="destructive" size="sm" className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {kpiDefinitions.length === 0 && !showNewForm && (
                                <div className="text-center py-12 text-slate-500">
                                    <p>No KPIs yet. Create one or choose a template above.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
