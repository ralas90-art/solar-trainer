"use client"

import { useState } from "react"
import { getApiUrl } from "@/lib/utils"
// @ts-ignore
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Input } from "@/components/ui/input"
// @ts-ignore
import { Label } from "@/components/ui/label"
import { Loader2, Sun, Lock, User, MapPin } from "lucide-react"

export function AuthForm({ onLogin }: { onLogin: (user: any) => void }) {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [selectedState, setSelectedState] = useState("CA")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        if (!username || !password) {
            setError("Please enter username and password")
            return
        }
        setError("")
        setIsLoading(true)

        const endpoint = isLogin ? "/login" : "/signup"

        try {
            const API_URL = getApiUrl()
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || "Authentication failed")
            }

            // Auto-login after signup or regular login
            onLogin({
                id: data.username,
                name: data.username,
                username: data.username,
                // Mock tenant assignment with SELECTED STATE
                tenant: {
                    id: "1",
                    name: "Solar Bros Inc",
                    allowed_states: [selectedState, "CA", "NY"],
                    brand_color: "bg-orange-500"
                }
            })

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-4">
            <div className="mb-8 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Sun className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Sales<span className="text-orange-500">Pro</span>
                </h1>
                <p className="text-slate-500">Master the Art of Solar Sales</p>
            </div>

            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-xl text-center">
                        {isLogin ? "Welcome Back" : "Start Your Journey"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isLogin ? "Sign in to continue your training" : "Create an account to access the simulator"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    className="pl-9"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="state">Primary Market</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <select
                                        id="state"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                    >
                                        <option value="CA">California (NEM 3.0)</option>
                                        <option value="NY">New York (Tax Credits)</option>
                                        <option value="TX">Texas (Dereulated)</option>
                                        <option value="FL">Florida (Net Metering)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLogin ? "Sign In" : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        variant="link"
                        className="w-full text-slate-500 hover:text-slate-900"
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError("")
                        }}
                    >
                        {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8 text-center text-sm text-slate-400">
                &copy; 2024 SalesPro Agent
            </div>
        </div>
    )
}
