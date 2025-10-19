import { Briefcase } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-900">
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col items-center text-center space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
          <Briefcase className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">HealthMate AI</h3>
      </div>

      {/* Tagline */}
      <p className="max-w-md text-sm">
        Connecting talent with opportunity. Simple, fast, effective.
      </p>

      {/* Copyright */}
      <div className="text-xs space-y-1">
        <p>&copy; {new Date().getFullYear()} HealthMate AI. All rights reserved.</p>
        <p>
          Made with 🤍 by{" "}
          <a 
            href="https://www.linkedin.com/in/MuhammadSaad/" 
            className="text-blue-400 hover:underline"
          >
            Muhammad Saad
          </a>
        </p>
      </div>
    </div>
  </div>
</footer>
  )
}

export default Footer
