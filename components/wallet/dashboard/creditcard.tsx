import { Eye } from "lucide-react"
import Image from "next/image"
export default function Component() {
    return (
      <div className="relative w-full h-full bg-gradient-to-r from-[#4c57b6] to-[#6c8eff] rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=180&width=300')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 h-full w-full p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Eye className="w-10 h-10 fill-white" />
              {/* <Image src={"logo.svg"} alt="Illustration" width={10} height={50} /> */}
            </div>
            <div className="bg-white rounded-full px-2 py-1 text-xs font-medium text-[#4c57b6]">Coming Soon</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-white font-medium">Card Number</span>
              <span className="text-white font-bold text-xl">4111 1111 1111 1111</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white font-medium">Expiration</span>
                <span className="text-white font-bold text-md">12/24</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-white font-medium">Cardholder</span>
                <span className="text-white font-bold text-md">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  