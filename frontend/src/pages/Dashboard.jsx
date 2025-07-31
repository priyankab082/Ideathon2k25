import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import DashboardButtons from '../components/DashboardButtons';
import DashboardStats from '../components/DashboardStats';
import RecentInterviewSessions from '../components/RecentInterviewSessions';
import SkillImprovement from '../components/SkillImprovement';
import UpcomingFeatures from '../components/UpcomingFeatures';

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <DashboardHeader />
      <DashboardButtons />
      <DashboardStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <RecentInterviewSessions />
        <SkillImprovement />
      </div>
      <UpcomingFeatures />
    </div>
  );
};

export default Dashboard;