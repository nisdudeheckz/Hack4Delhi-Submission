import React from 'react';

const Departments = () => {
  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
         <h1 className="text-2xl font-bold text-[#0b3c6f] border-b-2 border-yellow-400 pb-2 mb-6">
            Departments & Offices
         </h1>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Finance Department', 'Audit Department', 'Revenue Department', 'IT Department', 'Public Works Department', 'Health Department'].map((dept, index) => (
                <div key={index} className="bg-white p-6 rounded shadow-sm border-l-4 border-[#0b3c6f] hover:shadow-md transition-shadow">
                    <h2 className="font-bold text-lg mb-2 text-[#0b3c6f]">{dept}</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Contact details and audit reports for {dept}.
                    </p>
                    <button className="text-sm text-blue-600 font-semibold hover:underline">
                        View Details <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Departments;
