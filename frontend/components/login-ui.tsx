"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function AuthForm({ onLogin }: { onLogin: (user: any) => void }) {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        if (!username || !password) {
            setError("Please enter username and password")
            return
        }
        setError("")
        setIsLoading(true)

        const endpoint = isLogin ? "/login" : "/signup"

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
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
            // For prototype, we'll mock the tenant selection or just assign default
            onLogin({
                id: data.username,
                name: data.username,
                username: data.username,
                // Mock tenant assignment for now
                tenant: {
                    id: "1",
                    name: "Solar Bros Inc",
                    allowed_states: ["CA", "NY"],
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
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
                <CardDescription>
                    {isLogin ? "Enter your credentials to access the simulator." : "Sign up to start your sales training."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="jdoe" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLogin ? "Sign In" : "Sign Up"}
                </Button>
                <Button variant="ghost" className="w-full text-xs" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </Button>
            </CardFooter>
        </Card>
    )
}
