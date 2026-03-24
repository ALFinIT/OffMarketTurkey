'use client'

import { useState, Suspense } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

function LoginFormContent() {
  const router = useRouter()
  const search = useSearchParams()
  const redirectTo = search.get('redirectedFrom') ?? '/admin/dashboard'
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const msg = data?.error ?? 'Invalid credentials'
        setErrorMessage(msg)
        toast({ title: 'Login failed', description: msg, variant: 'destructive' })
        setLoading(false)
        return
      }

      router.replace(redirectTo)
    } catch (error: any) {
      setErrorMessage(error?.message ?? 'Login failed')
      toast({ title: 'Login failed', description: error?.message ?? 'Unable to sign in.', variant: 'destructive' })
      setLoading(false)
    }
  }

  return (
    <Card className="border border-border/70 bg-card/70 shadow-2xl backdrop-blur">
      <CardHeader className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">Admin Access</p>
        <CardTitle className="text-3xl text-foreground">Sign in</CardTitle>
        <CardDescription className="text-foreground/70">
          Secure panel for OffMarket Turkey. Use your admin credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </Button>
            </div>
            {errorMessage ? (
              <p className="text-xs text-destructive mt-1 text-center">{errorMessage}</p>
            ) : null}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),transparent_50%)]" />
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={
          <Card className="border border-border/70 bg-card/70 shadow-2xl backdrop-blur">
            <CardContent className="p-6">
              <div className="text-center">Loading...</div>
            </CardContent>
          </Card>
        }>
          <LoginFormContent />
        </Suspense>
      </div>
      <Toaster />
    </main>
  )
}
