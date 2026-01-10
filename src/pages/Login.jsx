import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 800));

            const success = login(email, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid credentials. Please contact your system administrator.');
            }
        } catch (err) {
            setError('System error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">

            {/* 1. Header Section (Identical to Dashboard) */}
            <div className="w-full">
                {/* Top Strip */}
                <div className="bg-[#0b1e3c] text-white text-xs py-1 px-4 sm:px-8 flex justify-end items-center gap-4">
                    <div className="flex items-center gap-2 border-r border-gray-500 pr-3">
                        <span>Skip to Main Content</span>
                        <span>|</span>
                        <span>Screen Reader Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <select className="bg-[#0b1e3c] border border-gray-500 rounded-sm py-0.5 px-1 focus:outline-none">
                            <option>English</option>
                            <option>Hindi</option>
                        </select>
                    </div>
                </div>

                {/* Branding Header */}
                <div className="bg-white py-2 px-4 sm:px-8 border-b border-gray-200">
                    <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png"
                                alt="Emblem"
                                className="h-16 object-contain"
                            />
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                    National Expenditure Risk System (NERS)
                                </h1>
                                <p className="text-sm text-gray-600 font-semibold">
                                    Government of National Capital Territory of Delhi
                                </p>
                            </div>
                        </div>
                        {/* Logos */}
                        <div className="hidden md:flex items-center gap-4 text-xs text-gray-400">
                            <div className="border border-gray-200 p-2 rounded bg-gray-50">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3KvIDJaZXcLi0Xf7WZICZPhxdrNwaSZtPtw&s" alt="G20 Summit" className="h-20 w-auto object-contain" />
                            </div>
                            <div className="border border-gray-200 p-2 rounded bg-gray-50">
                                <img src="https://media.istockphoto.com/id/1607483797/vector/banner-or-header-designed-of-15th-august-happy-independence-day-of-india.jpg?s=612x612&w=0&k=20&c=tS_9ghoRvgcIEbSi-mn3qwDq1phL1dfObM8rI9BH6t8=" alt="Azadi" className="h-20 w-auto object-contain" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar / Nav Placeholdler */}
                <div className="bg-[#004b8d] h-2 shadow-md w-full"></div>
            </div>

            {/* 2. Main Login Content */}
            <div className="flex-1 bg-gray-100 flex flex-col md:flex-row items-stretch">

                {/* Left Side: Banner / Information */}
                <div className="md:w-3/5 bg-gray-200 relative overflow-hidden hidden md:block">
                    <img
                        src="https://cdnbbsr.s3waas.gov.in/s354ff9e9e3a2ec0300d4ce11261f5169f/uploads/2019/12/20191224100-1024x576.jpg"
                        alt="Delhi Secretariat"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-center p-12 text-white">
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-bold mb-4 border-l-4 border-yellow-400 pl-4">Secure Audit Access</h2>
                            <p className="text-lg mb-6">
                                Authorized personnel only. This system uses advanced AI to monitor public expenditure ensuring transparency and accountability.
                            </p>
                            <ul className="space-y-2 text-sm opacity-90">
                                <li><i className="fas fa-check-circle text-yellow-400 mr-2"></i> Real-time Anomaly Detection</li>
                                <li><i className="fas fa-check-circle text-yellow-400 mr-2"></i> Automated Risk Scoring</li>
                                <li><i className="fas fa-check-circle text-yellow-400 mr-2"></i> Secure Data Handling</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="md:w-2/5 flex items-center justify-center p-8 bg-white relative">
                    <div className="w-full max-w-md">

                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-[#0b3c6f] uppercase tracking-wide">Officer Login</h3>
                            <p className="text-sm text-gray-500 mt-1">Please identify yourself to proceed</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Official Email ID</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400"><i className="fas fa-envelope"></i></span>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004b8d] focus:border-transparent outline-none transition-all"
                                        placeholder="name@gov.in"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-400"><i className="fas fa-lock"></i></span>
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#004b8d] focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Mock Captcha */}
                            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded border border-gray-200">
                                <div className="bg-white border text-xl font-mono px-4 py-1 tracking-widest text-gray-600 line-through select-none">
                                    8X29A
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    className="flex-1 py-1 px-2 border border-gray-300 rounded text-sm focus:outline-none"
                                />
                                <button type="button" className="text-blue-600 hover:text-blue-800"><i className="fas fa-sync-alt"></i></button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-[#004b8d] hover:bg-[#003d73] text-white font-bold py-3 rounded shadow-md transition-all flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin mr-2"></i> Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Secure Login <i className="fas fa-arrow-right ml-2"></i>
                                    </>
                                )}
                            </button>

                            <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                                <a href="#" className="hover:underline hover:text-[#004b8d]">Forgot Password?</a>
                                <a href="#" className="hover:underline hover:text-[#004b8d]">Officer Registration</a>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">
                                Standard Operating Procedures (SOP) apply. Unauthorized access is a punishable offense under IT Act, 2000.
                            </p>
                        </div>

                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Login;
