import { AlertCircle } from "lucide-react"

const InputField = ({ label, id, type = "text", placeholder, value, onchange, error, helperText, required = false, disabled = false, icon: Icon, ...props }) => {
    return (
        <div className="flex flex-col w-full">
  <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>

  <div className="relative">
    {Icon && (
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
    )}

    <input
      type={type}
      id={id}
      className={`w-full border rounded-md py-2.5 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
        Icon ? "pl-10 pr-3" : "px-3"
      } ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
      placeholder={placeholder}
      value={value}
      onChange={onchange}
      disabled={disabled}
      {...props}
    />
  </div>

  {/* Error Message */}
  {error && (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
      <AlertCircle className="w-4 h-4" />
      <span>{error}</span>
    </div>
  )}

  {/* Helper Text */}
  {helperText && !error && (
    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
  )}
</div>

    )
}



export default InputField
