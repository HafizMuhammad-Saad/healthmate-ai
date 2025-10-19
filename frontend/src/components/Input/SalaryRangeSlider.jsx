import { useState } from "react"


const SalaryRangeSlider = ({filters, handleFilterChange}) => {
  const [minSalary, setMinSalary] = useState(filters?.minSalary || 0)
  const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || 0)
  
  return (
     <div className="space-y-4">
      {/* Inputs Row */}
      <div className="flex gap-4">
        {/* Min Salary */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Salary
          </label>
          <input
            type="number"
            placeholder="0"
            min="0"
            step="1000"
            value={minSalary || ""}
            onChange={({target}) => setMinSalary(target.value)}
            onBlur={() =>
              handleFilterChange(
                "minSalary",
                minSalary ? parseInt(minSalary) : ""
              )
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Max Salary */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Salary
          </label>
          <input
            type="number"
            placeholder="No limit"
            min="0"
            step="1000"
            value={maxSalary || ""}
            onChange={({target}) => setMaxSalary(target.value)}
            onBlur={() =>
              handleFilterChange(
                "maxSalary",
                maxSalary ? parseInt(maxSalary) : ""
              )
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
        </div>
      </div>

      {/* Range Display */}
      {(minSalary || maxSalary) ? (
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
          Range:
          {minSalary
            ? `PKR ${minSalary.toLocaleString()}`
            : "PKR 0"} -{" "}
          
          {maxSalary
            ? `PKR ${maxSalary.toLocaleString()}`
            : "No limit"}
        </div>
      ) : null}
    </div>
  )
}

export default SalaryRangeSlider
