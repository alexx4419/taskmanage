import { useAuth } from '../context/AuthContext';
import TaskerDashboard from './dashboards/TaskerDashboard';
import LeadDashboard from './dashboards/LeadDashboard';
import ReviewerDashboard from './dashboards/ReviewerDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'PROJECT_LEAD') {
    return <LeadDashboard />;
  }

  if (user.role === 'QUALITY_REVIEWER') {
    return <ReviewerDashboard />;
  }

  // Default to TASKER dashboard
  return <TaskerDashboard />;
}
