import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function AdminIndexPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/admin/dashboard')
  }

  redirect('/admin/login')
}
