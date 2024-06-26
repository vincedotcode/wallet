
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function KYCIncomplete() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
    <div className="border border-dashed shadow-sm rounded-lg flex-1 flex items-center justify-center bg-red-100 p-8">
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <h3 className="font-bold text-2xl tracking-tight text-red-500">New User - KYC Incomplete</h3>
        <p className="text-sm text-muted-foreground">
          Your Know Your Customer (KYC) process has not been completed yet. Please complete your KYC to unlock all
          features and continue using our platform.
        </p>
        <Button className="mt-4">
          <Link href="#" prefetch={false}>
            Complete KYC
          </Link>
        </Button>
      </div>
    </div>
  </main>
  )
}
