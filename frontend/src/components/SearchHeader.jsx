import { MapPin, Search } from "lucide-react"


const SearchHeader = ({
    filters,
          handleFilterChange,
}) => {

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-4">
  <div className="max-w-5xl mx-auto">
    
    {/* Heading */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-3">
        Find Your Dream Job
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Explore thousands of job opportunities with all the information you need. It's your future.
      </p>
    </div>

    {/* Unified Search Bar */}
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // trigger search
      }}
      className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
    >
      {/* Keyword */}
      <div className="flex items-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-200">
        <Search className="w-5 h-5 text-gray-400 ml-4" />
        <input
          type="text"
          placeholder="Job title or keyword"
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          className="w-full px-4 py-3 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Location */}
      <div className="flex items-center flex-1 border-b sm:border-b-0 sm:border-r border-gray-200">
        <MapPin className="w-5 h-5 text-gray-400 ml-4" />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full px-4 py-3 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition-colors w-full sm:w-auto"
      >
        Search Jobs
      </button>
    </form>
  </div>
</div>


  )
}

export default SearchHeader
