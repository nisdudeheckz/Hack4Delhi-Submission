import React from 'react';

const Card = ({ title, metric, description, trend }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-6 flex-1 min-w-[280px]">
        <dt className="text-sm font-medium text-gray-500 truncate">
            {title}
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {metric}
        </dd>
        <div className="mt-2 text-sm text-gray-600">
            {description}
        </div>
    </div>
);

const DashboardCards = () => {
    const cards = [
        {
            title: "High-Risk Districts",
            metric: "12",
            description: "Districts flagged with >85% anomaly score (Last 30 days)."
        },
        {
            title: "Potential Wastage",
            metric: "$4.2M",
            description: "Estimated redundant spending identified across all sectors."
        },
        {
            title: "Pending Audits",
            metric: "34",
            description: "Auto-generated cases awaiting human review and approval."
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 px-1">
                Live Risk Overview
            </h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-between">
                {cards.map((card, index) => (
                    <Card key={index} {...card} />
                ))}
            </div>
        </div>
    );
};

export default DashboardCards;
