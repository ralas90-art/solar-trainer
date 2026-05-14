import React from 'react';

interface AudioVisualizerProps {
    isActive: boolean;
    isMuted?: boolean;
}

export function AudioVisualizer({ isActive, isMuted = false }: AudioVisualizerProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12">
            {/* Audio Bars */}
            <div className="flex items-end gap-2 h-32 mb-8">
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 rounded-full transition-all duration-300 ${isActive && !isMuted
                                ? 'bg-gradient-to-t from-indigo-500 to-purple-500 animate-pulse'
                                : 'bg-slate-700'
                            }`}
                        style={{
                            height: isActive && !isMuted
                                ? `${30 + Math.random() * 70}%`
                                : '20%',
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${0.6 + Math.random() * 0.4}s`
                        }}
                    />
                ))}
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-slate-600'
                        }`} />
                    <p className="text-slate-300 font-medium">
                        {isActive ? (isMuted ? 'Muted' : 'Call Active') : 'Connecting...'}
                    </p>
                </div>

                {isActive && !isMuted && (
                    <p className="text-slate-500 text-sm">
                        Speak naturally - the AI is listening
                    </p>
                )}

                {isMuted && (
                    <p className="text-yellow-500 text-sm">
                        🔇 Microphone muted
                    </p>
                )}
            </div>

            {/* Pulsing Ring Effect */}
            {isActive && !isMuted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full border-2 border-indigo-500/20 animate-ping"
                        style={{ animationDuration: '2s' }} />
                </div>
            )}
        </div>
    );
}
