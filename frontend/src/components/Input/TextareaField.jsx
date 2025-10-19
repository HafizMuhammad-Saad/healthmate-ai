import React from 'react'

const TextareaField = ({
     label,
        id,
        value,
        onChange, 
        error,
        icon: Icon,
        placeholder,
        helperText, 
        required = false,
        disabled = false,
        rows=6,
        ...props
}) => {
  return (
    <div className="flex flex-col w-full">
  <label htmlFor={id} className="mb-2 text-sm font-semibold text-gray-700">
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>

  <div className="relative w-full">
    {Icon && (
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
    )}
    
    <textarea
      id={id}
      rows={rows}
      className={`w-full rounded-lg border border-gray-300 p-3 text-sm placeholder-gray-400 text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        Icon ? "pl-10" : ""
      } ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""} disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  </div>

  {error && (
    <div className="mt-1 flex items-center text-xs text-red-500">
      <AlertCircle className="w-4 h-4 mr-1" />
      <span>{error}</span>
    </div>
  )}

  {helperText && !error && (
    <p className="mt-1 text-xs text-gray-500">{helperText}</p>
  )}
</div>

  )
}

export default TextareaField
