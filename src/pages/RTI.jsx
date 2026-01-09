import React from 'react';


const RTI = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

            <div className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
                <h1 className="text-2xl font-bold text-[#0b3c6f] border-b-2 border-yellow-400 pb-2 mb-6">
                    Right to Information (RTI)
                </h1>
                <div className="bg-white p-8 rounded shadow-sm border-t-4 border-[#0b3c6f] mb-8">
                    <h3 className="text-xl font-bold mb-4">Proactive Disclosure under RTI Act, 2005</h3>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                        In pursuance of Section 4(1)(b) of the Right to Information Act, 2005, the Directorate of Audit, Government of NCT of Delhi, hereby publishes the following information for the general public.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-blue-700 mb-6">
                        <li><a href="#" className="hover:underline">Manual 1: Particulars of Organization, Functions and Duties</a></li>
                        <li><a href="#" className="hover:underline">Manual 2: Powers and Duties of Officers and Employees</a></li>
                        <li><a href="#" className="hover:underline">Manual 3: Procedure followed in Decision Making Process</a></li>
                        <li><a href="#" className="hover:underline">Manual 4: Norms set for Discharge of Functions</a></li>
                        <li><a href="#" className="hover:underline">Manual 5: Rules, Regulations, Instructions, Manuals and Records</a></li>
                    </ul>

                    <div className="bg-blue-50 p-4 rounded border border-blue-100">
                        <h4 className="font-bold text-[#0b3c6f] mb-2">Public Information Officers (PIOs)</h4>
                        <p className="text-sm text-gray-700"><strong>Name:</strong> Sh. Rajender Kumar</p>
                        <p className="text-sm text-gray-700"><strong>Designation:</strong> Deputy Controller of Accounts</p>
                        <p className="text-sm text-gray-700"><strong>Email:</strong> pio.audit@delhi.gov.in</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RTI;
