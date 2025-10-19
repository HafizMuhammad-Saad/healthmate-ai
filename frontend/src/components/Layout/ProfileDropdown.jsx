import { ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
const ProfileDropdown = ({
    isOpen,
    onToggle,
    avatar,
    companyName,
    email,
    onLogout,
    userRole
}) => {

    const navigate = useNavigate();

  return (
    <div className="relative">
  {/* Profile Toggle Button */}
  <button
    onClick={onToggle}
    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
  >
    {avatar ? (
      <img
        src={avatar}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />
    ) : (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
        {companyName.charAt(0).toUpperCase()}
      </div>
    )}

    <div className="hidden sm:block text-left">
      <p className="text-sm font-medium text-gray-800">{companyName}</p>
      <p className="text-xs text-gray-500">{userRole}</p>
    </div>

    <ChevronDown className="w-5 h-5 text-gray-500" />
  </button>

  {/* Dropdown Menu */}
  {isOpen && (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-800">{companyName}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>

      <div className="py-1">
        <button
          onClick={() =>
            navigate(userRole === "jobseeker" ? "/profile" : "/company-profile")
          }
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
        >
          View Profile
        </button>
      </div>

      <div className="border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          Sign out
        </button>
      </div>
    </div>
  )}
</div>

  )
}

export default ProfileDropdown
