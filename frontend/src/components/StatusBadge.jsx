import React from 'react'

const StatusBadge = ({status}) => {
    const statusConfig = {
        Applied: "bg-gray-200 text-gray-800",
        Interview: "bg-yellow-200 text-yellow-800",
        Hired: "bg-green-200 text-green-800",
        Rejected: "bg-red-200 text-red-800",
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[status] || "bg-gray-200 text-gray-800"}`}>
            {status}
        </span>
    );
}

export default StatusBadge
