import { Briefcase } from "lucide-react"


const LoadingSpinner = () => {
  return (
<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
  {/* Loader wrapper */}
  <div className="relative flex items-center justify-center">
    {/* Outer ripple */}
    <div className="absolute animate-ping w-32 h-32 rounded-full bg-blue-200 opacity-60"></div>
    {/* Mid ripple */}
    <div className="absolute animate-pulse w-24 h-24 rounded-full bg-blue-300 opacity-60"></div>
    {/* Inner spinning ring */}
    <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    {/* Center icon */}
    <div className="absolute flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg">
      <Briefcase className="w-6 h-6 text-blue-600" />
    </div>
  </div>

  {/* Loading text */}
  <p className="mt-8 text-lg font-semibold text-gray-800 animate-bounce">
    Finding amazing opportunities...
  </p>
</div>

 )
}

export default LoadingSpinner
