import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, TrendingUp, Lightbulb, RotateCcw, ArrowRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface SimulationFeedbackProps {
    passed: boolean;
    score: number;
    transcript: Array<{ role: string; content: string; timestamp?: string }>;
    strengths?: string[];
    improvements?: string[];
    suggestedScript?: string;
    feedbackSummary?: string;
    toneRating?: string;
    toneFeedback?: string;
    onRetry: () => void;
    onContinue: () => void;
}

export function SimulationFeedback({
    passed,
    score,
    transcript,
    strengths = [],
    improvements = [],
    suggestedScript,
    feedbackSummary,
    toneRating,
    toneFeedback,
    onRetry,
    onContinue
}: SimulationFeedbackProps) {
    const [showTranscript, setShowTranscript] = React.useState(false);
    const [showScript, setShowScript] = React.useState(false);

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            {/* Header */}
            <Card className={`border-2 ${passed ? 'border-green-500 bg-green-950/20' : 'border-yellow-500 bg-yellow-950/20'}`}>
                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                        {passed ? (
                            <CheckCircle2 className="w-16 h-16 text-green-400" />
                        ) : (
                            <Lightbulb className="w-16 h-16 text-yellow-400" />
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {passed ? '🎉 Congratulations!' : '📚 Learning Opportunity'}
                    </CardTitle>
                    <p className="text-slate-400 mt-2">
                        {passed ? 'You passed this simulation!' : 'Keep practicing - you\'re improving!'}
                    </p>

                    {/* Score */}
                    <div className="mt-4">
                        <div className="text-4xl font-bold text-white">{score}/100</div>
                        <Badge className={`mt-2 ${passed ? 'bg-green-600' : 'bg-yellow-600'}`}>
                            {passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                        </Badge>
                    </div>

                    {/* Tone Analysis - New Section */}
                    {toneRating && (
                        <div className="mt-6 flex flex-col items-center gap-2">
                            <div className="bg-indigo-900/40 px-4 py-2 rounded-full border border-indigo-500/30 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <span className="text-indigo-200 font-semibold uppercase text-sm tracking-wider">
                                    Tone: <span className="text-white">{toneRating}</span>
                                </span>
                            </div>
                            {toneFeedback && (
                                <p className="text-slate-400 text-sm italic max-w-lg mx-auto">
                                    "{toneFeedback}"
                                </p>
                            )}
                        </div>
                    )}

                    {/* Feedback Summary */}
                    {feedbackSummary && (
                        <div className="mt-6 bg-slate-900/50 p-4 rounded-lg border border-white/5 text-left">
                            <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                Coach's Summary
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed italic">"{feedbackSummary}"</p>
                        </div>
                    )}
                </CardHeader>
            </Card>

            {/* Strengths */}
            {strengths.length > 0 && (
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400">
                            <TrendingUp className="w-5 h-5" />
                            What You Did Well
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {strengths.map((strength, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Improvements */}
            {improvements.length > 0 && (
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-400">
                            <Lightbulb className="w-5 h-5" />
                            Areas to Improve
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {improvements.map((improvement, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-300">
                                    <XCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span>{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Suggested Script (for failed attempts) */}
            {!passed && suggestedScript && (
                <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader
                        className="cursor-pointer hover:bg-slate-800/50 transition-colors"
                        onClick={() => setShowScript(!showScript)}
                    >
                        <CardTitle className="flex items-center justify-between text-indigo-400">
                            <span className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5" />
                                Suggested Script for Next Time
                            </span>
                            {showScript ? <ChevronUp /> : <ChevronDown />}
                        </CardTitle>
                    </CardHeader>
                    {showScript && (
                        <CardContent>
                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-700">
                                <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
                                    {suggestedScript}
                                </p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Transcript */}
            <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader
                    className="cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => setShowTranscript(!showTranscript)}
                >
                    <CardTitle className="flex items-center justify-between">
                        <span>📝 Full Transcript</span>
                        {showTranscript ? <ChevronUp /> : <ChevronDown />}
                    </CardTitle>
                </CardHeader>
                {showTranscript && (
                    <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {transcript.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-lg ${msg.role === 'user'
                                        ? 'bg-indigo-900/30 ml-8'
                                        : 'bg-slate-800/50 mr-8'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-slate-400">
                                            {msg.role === 'user' ? 'You' : 'Homeowner'}
                                        </span>
                                        {msg.timestamp && (
                                            <span className="text-xs text-slate-500">{msg.timestamp}</span>
                                        )}
                                    </div>
                                    <p className="text-slate-300 text-sm">{msg.content}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                </Button>
                <Button
                    onClick={onContinue}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                    {passed ? 'Continue' : 'Next Scenario'}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
