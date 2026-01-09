import React, { useRef } from 'react';
import { useData } from '../context/DataContext';

const DataUpload = () => {
    const fileInputRef = useRef(null);
    const { uploadData, isLoading } = useData();

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const result = await uploadData(file);

        if (result.success) {
            alert(`Successfully uploaded ${result.count} records. Risk scores have been recalculated.`);
            fileInputRef.current.value = '';
        } else {
            alert(`Upload failed: ${result.error}`);
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Upload Government Data
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                            Accepted formats: CSV, JSON. Data will be merged with existing records.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileSelect}
                            disabled={isLoading}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150`}
                        >
                            {isLoading ? 'Processing...' : 'Choose File'}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataUpload;
