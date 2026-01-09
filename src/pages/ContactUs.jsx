import React from 'react';


const ContactUs = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">

            <div className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-8 py-8 w-full">
                <h1 className="text-2xl font-bold text-[#0b3c6f] border-b-2 border-yellow-400 pb-2 mb-6">
                    Contact Us
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded shadow-sm border-t-4 border-[#0b3c6f]">
                        <h3 className="text-lg font-bold text-[#0b3c6f] mb-4">Directorate of Audit</h3>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                <i className="fas fa-map-marker-alt text-yellow-500 mr-3 w-5"></i>
                                <strong>Address:</strong><br />
                                4th Level, C-Wing, Delhi Secretariat,<br />
                                I.P. Estate, New Delhi - 110002
                            </p>
                            <p>
                                <i className="fas fa-phone-alt text-yellow-500 mr-3 w-5"></i>
                                <strong>Telephone:</strong><br />
                                011-23392427, 011-23392285
                            </p>
                            <p>
                                <i className="fas fa-envelope text-yellow-500 mr-3 w-5"></i>
                                <strong>Email:</strong><br />
                                audit.delhi@gov.in
                            </p>
                            <p>
                                <i className="fas fa-clock text-yellow-500 mr-3 w-5"></i>
                                <strong>Office Hours:</strong><br />
                                9:30 AM to 6:00 PM (Monday - Friday)
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded shadow-sm border-t-4 border-yellow-400">
                        <h3 className="text-lg font-bold text-[#0b3c6f] mb-4">Send Us a query</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#0b3c6f] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#0b3c6f] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                                <select className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#0b3c6f] outline-none">
                                    <option>General Query</option>
                                    <option>Technical Issue</option>
                                    <option>Feedback</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea rows="4" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#0b3c6f] outline-none"></textarea>
                            </div>
                            <button className="bg-[#0b3c6f] text-white font-bold py-2 px-6 rounded hover:bg-[#003d73]">
                                Submit Query
                            </button>
                        </form>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ContactUs;
