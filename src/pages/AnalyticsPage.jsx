import React from 'react';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track project performance and task distribution across teams.
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
};

export default AnalyticsPage;
