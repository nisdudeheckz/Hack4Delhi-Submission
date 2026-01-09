import React from 'react';
import { useData } from '../context/DataContext';

const RiskThresholdControl = () => {
    const { riskThreshold, setRiskThreshold } = useData();

    const handleChange = (e) => {
        setRiskThreshold(Number(e.target.value));
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                            High-Risk Threshold: {riskThreshold}
                        </label>
                        <p className="text-xs text-gray-600">
                            Adjust the minimum score to classify a case as high-risk. Current: {riskThreshold}+
                        </p>
                    </div>
                    <div className="flex-1 max-w-md">
                        <input
                            type="range"
                            min="50"
                            max="90"
                            step="5"
                            value={riskThreshold}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>50</span>
                            <span>60</span>
                            <span>70</span>
                            <span>80</span>
                            <span>90</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskThresholdControl;
