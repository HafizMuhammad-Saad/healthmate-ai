import React from 'react'

const SelectField = ({
    label,
    options,
    id,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    icon: Icon,
}) => {
    return (
        <div className="relative w-full">
            {/* Floating Label */}
            <label
                htmlFor={id}
                className="mb-2 text-sm font-semibold text-gray-700"
            >
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {/* Select Wrapper */}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                )}

                {/* Select Field */}
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`w-full border rounded-xl py-3 text-sm transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 focus:border-transparent appearance-none ${Icon ? "pl-10 pr-10" : "px-4"
                        } ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"} ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
                        }`}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-gray-400 transition-transform duration-200 transform"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-1 mt-1 text-sm text-red-500 animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}

export default SelectField
