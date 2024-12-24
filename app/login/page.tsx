import { Library } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/app/login/form"

interface LoginPageProps {
  searchParams?: { next?: string }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Library className="size-4" />
          </div>
          Dolce Biblioteca
        </Link>
        <LoginForm searchParams={searchParams} />
      </div>
    </div>
  )
}
