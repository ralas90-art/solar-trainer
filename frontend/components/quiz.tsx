"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, ArrowRight, Trophy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Quiz } from "@/lib/modules"

interface QuizProps {
    quiz: Quiz
    onComplete: (score: number) => void
}

export function QuizModule({ quiz, onComplete }: QuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)

    const currentQuestion = quiz.questions[currentIndex]
    const isLastQuestion = currentIndex === quiz.questions.length - 1

    const handleSelect = (index: number) => {
        if (isAnswered) return
        setSelectedOption(index)
    }

    const handleSubmit = () => {
        if (selectedOption === null) return

        const isCorrect = selectedOption === currentQuestion.correctAnswerIndex
        if (isCorrect) setScore(prev => prev + 1)

        setIsAnswered(true)
    }

    const handleNext = () => {
        if (isLastQuestion) {
            setShowResults(true)
        } else {
            setCurrentIndex(prev => prev + 1)
            setSelectedOption(null)
            setIsAnswered(false)
        }
    }

    const handleFinish = () => {
        onComplete(score)
    }

    const passThreshold = Math.ceil(quiz.questions.length * 0.7)
    const passed = score >= passThreshold

    if (showResults) {
        return (
            <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-6 flex justify-center">
                    {passed ? (
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <Trophy className="w-12 h-12 text-green-400" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                            <AlertTriangle className="w-12 h-12 text-red-400" />
                        </div>
                    )}
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">{passed ? "Mission Accomplished!" : "Mission Failed"}</h2>
                <p className="text-slate-400 mb-8">
                    You scored <span className={passed ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{score}</span> out of <span className="text-white">{quiz.questions.length}</span>
                </p>

                <div className="flex gap-4 justify-center">
                    {passed ? (
                        <Button onClick={handleFinish} size="lg" className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 shadow-lg shadow-green-900/40">
                            Complete Training <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    ) : (
                        <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                            Retry Mission
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm border border-blue-600/30">QUIZ</span>
                    {quiz.title}
                </h2>
                <div className="text-slate-500 font-mono text-sm">
                    {currentIndex + 1} / {quiz.questions.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-800 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                />
            </div>

            <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                <h3 className="text-xl font-medium text-slate-200 mb-8 leading-relaxed">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, idx) => {
                        let stateStyles = "border border-white/5 bg-white/5 hover:bg-white/10"
                        if (isAnswered) {
                            if (idx === currentQuestion.correctAnswerIndex) {
                                stateStyles = "border-green-500/50 bg-green-500/10 text-green-200"
                            } else if (idx === selectedOption && idx !== currentQuestion.correctAnswerIndex) {
                                stateStyles = "border-red-500/50 bg-red-500/10 text-red-200 opacity-60"
                            } else {
                                stateStyles = "opacity-40"
                            }
                        } else if (selectedOption === idx) {
                            stateStyles = "border-blue-500 bg-blue-500/20 text-white ring-1 ring-blue-500"
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center justify-between group ${stateStyles}`}
                            >
                                <span className="flex-1">{option}</span>
                                {isAnswered && idx === currentQuestion.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-400" />}
                                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-400" />}
                            </button>
                        )
                    })}
                </div>

                <AnimatePresence>
                    {isAnswered && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 pt-6 border-t border-white/10"
                        >
                            <div className={`p-4 rounded-xl ${selectedOption === currentQuestion.correctAnswerIndex ? 'bg-green-900/20 border border-green-900/30' : 'bg-blue-900/20 border border-blue-900/30'}`}>
                                <p className="text-sm font-bold mb-1 opacity-70 uppercase tracking-widest">{selectedOption === currentQuestion.correctAnswerIndex ? 'Correct Analysis' : 'Correction'}</p>
                                <p className="text-slate-200 leading-relaxed">{currentQuestion.explanation}</p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button onClick={handleNext} className="bg-white text-black hover:bg-slate-200 font-bold">
                                    {isLastQuestion ? "Finish Quiz" : "Next Question"} <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isAnswered && (
                    <div className="mt-8 flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
                        >
                            Confirm Answer
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
