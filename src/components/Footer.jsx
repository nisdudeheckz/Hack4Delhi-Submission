import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#0b1e3c] text-white mt-auto">
            {/* Top Footer Section - Links */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">

                {/* Column 1 */}
                <div>
                    <h4 className="font-bold text-base mb-4 border-b border-gray-600 pb-2 inline-block">Quick Links</h4>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-yellow-400">Home</a></li>
                        <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
                        <li><a href="#" className="hover:text-yellow-400">Contact Us</a></li>
                        <li><a href="#" className="hover:text-yellow-400">Feedback</a></li>
                        <li><a href="#" className="hover:text-yellow-400">Sitemap</a></li>
                    </ul>
                </div>

                {/* Column 2 */}
                <div>
                    <h4 className="font-bold text-base mb-4 border-b border-gray-600 pb-2 inline-block">Policies</h4>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-yellow-400">Copyright Policy</a></li>
                        <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-yellow-400">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:text-yellow-400">Hyperlink Policy</a></li>
                        <li><a href="#" className="hover:text-yellow-400">Accessibility Statement</a></li>
                    </ul>
                </div>

                {/* Column 3 - Address */}
                <div>
                    <h4 className="font-bold text-base mb-4 border-b border-gray-600 pb-2 inline-block">Address</h4>
                    <div className="text-gray-300 space-y-2">
                        <p className="font-semibold text-white">Directorate of Audit</p>
                        <p>Government of NCT of Delhi</p>
                        <p>4th Level, C-Wing, Delhi Secretariat,</p>
                        <p>I.P. Estate, New Delhi - 110002</p>
                        <div className="mt-4">
                            <p><i className="fas fa-envelope mr-2"></i> email: audit.delhi@gov.in</p>
                            <p><i className="fas fa-phone mr-2"></i> ph: 011-23392427</p>
                        </div>
                    </div>
                </div>

                {/* Column 4 - Map Placeholder */}
                <div>
                    <h4 className="font-bold text-base mb-4 border-b border-gray-600 pb-2 inline-block">Location</h4>
                    <div className="bg-gray-200 h-40 w-full rounded flex items-center justify-center text-gray-500 text-xs">
                        [Map Integration Placeholder]
                    </div>
                </div>

            </div>

            {/* Bottom Footer Section - Copyright */}
            <div className="bg-[#050e1d] py-4 text-center text-xs text-gray-400 border-t border-gray-700">
                <p>
                    Content Owned by Directorate of Audit, Government of NCT of Delhi.
                </p>
                <p className="mt-1">
                    Developed & Hosted by National Informatics Centre,
                    Ministry of Electronics & IT, Government of India.
                </p>
                <div className="mt-2 flex justify-center gap-4">
                    <span>Last Updated: 09-Jan-2026</span>
                    <span>|</span>
                    <span>Visitors: 2,45,102</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
