import { ChevronDown, ChevronUp } from "lucide-react"
import { CATEGORIES, JOB_TYPES } from "../utils/data"
import SalaryRangeSlider from "./Input/SalaryRangeSlider";
const FilterSection = ({ title, children, isExpanded, onToggle }) => (
  <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
    <button className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors "
      onClick={onToggle}>
      {title}
      {isExpanded ? (<ChevronUp className="w-4 h-4" />) : (<ChevronDown className="w-h h-4" />)}
    </button>
    {isExpanded && children}
  </div>
);

const FilterContent = ({
  toggleSection,
  clearAllFilters,
  expendSections,
  filters,
  handleFilterChange,
}) => {
  return <div className="space-y-6">
      {/* Clear All Button */}
      <div className="flex justify-end">
        <button
          onClick={clearAllFilters}
          className="text-sm text-red-500 hover:text-red-600 font-medium transition"
        >
          Clear All
        </button>
      </div>

      {/* Job Type */}
      <FilterSection
        title="Job Type"
        isExpanded={expendSections?.jobType}
        onToggle={() => toggleSection("jobType")}
      >
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 cursor-pointer transition"
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters?.type === type.value}
                onChange={(e) =>
                  handleFilterChange(
                    "type",
                    e.target.checked ? type.value : ""
                  )
                }
              />
              <span className="text-gray-700">{type.value}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Salary Range */}
      <FilterSection
        title="Salary Range"
        isExpanded={expendSections?.salary}
        onToggle={() => toggleSection("salary")}
      >
        <div className="p-2">
          <SalaryRangeSlider
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection
        title="Category"
        isExpanded={expendSections?.categories}
        onToggle={() => toggleSection("categories")}
      >
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label
              key={category.value}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-purple-50 cursor-pointer transition"
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                checked={filters?.category === category.value}
                onChange={(e) =>
                  handleFilterChange(
                    "category",
                    e.target.checked ? category.value : ""
                  )
                }
              />
              <span className="text-gray-700">{category.value}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
}

export default FilterContent
