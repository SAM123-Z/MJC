import React, { useState, useEffect } from 'react';
import { supabase, type UserProfile } from '../lib/supabase';
import { 
  Home, 
  Activity, 
  Building, 
  FileText, 
  Briefcase, 
  Bell, 
  Settings, 
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Download,
  Filter,
  Search,
  User,
  Phone,
  Mail,
  GraduationCap,
  Menu,
  X,
  Save,
  Target,
  Award,
  BarChart3
} from 'lucide-react';

interface CDCAgentDashboardProps {
  user: any;
  profile: UserProfile;
  onLogout: () => void;
}

interface AgentInfo {
  id: string;
  matricule: string;
  department: string;
  status: string;
  hire_date: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  created_at: string;
  assigned_by?: {
    username: string;
  };
}

interface Activity {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  target_audience: string;
  location: string;
  scheduled_date: string;
  status: string;
  participants_count: number;
  created_at: string;
}

interface Report {
  id: string;
  title: string;
  report_type: string;
  content: string;
  period_start: string;
  period_end: string;
  status: string;
  created_at: string;
  submitted_at?: string;
}

interface DashboardStats {
  totalMissions: number;
  completedMissions: number;
  inProgressMissions: number;
  totalActivities: number;
  upcomingActivities: number;
  totalReports: number;
  pendingReports: number;
  thisMonthActivities: number;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Home },
  { id: 'missions', label: 'Mes Missions', icon: Target },
  { id: 'activities', label: 'Activités Locales', icon: Activity },
  { id: 'reports', label: 'Mes Rapports', icon: FileText },
];

const statusConfig = {
  assigned: { label: 'Assignée', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  in_progress: { label: 'En cours', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  completed: { label: 'Terminée', color: 'text-green-600', bgColor: 'bg-green-50' },
  cancelled: { label: 'Annulée', color: 'text-red-600', bgColor: 'bg-red-50' },
  planned: { label: 'Planifiée', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  ongoing: { label: 'En cours', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  draft: { label: 'Brouillon', color: 'text-gray-600', bgColor: 'bg-gray-50' },
  submitted: { label: 'Soumis', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  reviewed: { label: 'Révisé', color: 'text-green-600', bgColor: 'bg-green-50' },
};

const priorityConfig = {
  low: { label: 'Faible', color: 'text-gray-600', bgColor: 'bg-gray-50' },
  medium: { label: 'Moyenne', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  high: { label: 'Élevée', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  urgent: { label: 'Urgente', color: 'text-red-600', bgColor: 'bg-red-50' },
};

const activityTypes = [
  { value: 'formation', label: 'Formation' },
  { value: 'sensibilisation', label: 'Sensibilisation' },
  { value: 'reunion', label: 'Réunion' },
  { value: 'evenement', label: 'Événement' },
  { value: 'autre', label: 'Autre' },
];

const reportTypes = [
  { value: 'monthly', label: 'Rapport Mensuel' },
  { value: 'activity', label: 'Rapport d\'Activité' },
  { value: 'mission', label: 'Rapport de Mission' },
  { value: 'special', label: 'Rapport Spécial' },
];

export default function CDCAgentDashboard({ user, profile, onLogout }: CDCAgentDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalMissions: 0,
    completedMissions: 0,
    inProgressMissions: 0,
    totalActivities: 0,
    upcomingActivities: 0,
    totalReports: 0,
    pendingReports: 0,
    thisMonthActivities: 0,
  });
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState<'activity' | 'report'>('activity');
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchAgentData();
  }, [user.id]);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAgentInfo(),
        fetchMissions(),
        fetchActivities(),
        fetchReports(),
      ]);
      calculateStats();
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentInfo = async () => {
    const { data } = await supabase
      .from('cdc_agents')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) setAgentInfo(data);
  };

  const fetchMissions = async () => {
    if (!agentInfo) return;
    
    const { data } = await supabase
      .from('cdc_missions')
      .select(`
        *,
        user_profiles!cdc_missions_assigned_by_fkey (username)
      `)
      .eq('agent_id', agentInfo.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      const formattedMissions = data.map(mission => ({
        ...mission,
        assigned_by: mission.user_profiles ? { username: mission.user_profiles.username } : undefined
      }));
      setMissions(formattedMissions);
    }
  };

  const fetchActivities = async () => {
    if (!agentInfo) return;
    
    const { data } = await supabase
      .from('cdc_activities')
      .select('*')
      .eq('agent_id', agentInfo.id)
      .order('created_at', { ascending: false });
    
    if (data) setActivities(data);
  };

  const fetchReports = async () => {
    if (!agentInfo) return;
    
    const { data } = await supabase
      .from('cdc_reports')
      .select('*')
      .eq('agent_id', agentInfo.id)
      .order('created_at', { ascending: false });
    
    if (data) setReports(data);
  };

  const calculateStats = () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    setStats({
      totalMissions: missions.length,
      completedMissions: missions.filter(m => m.status === 'completed').length,
      inProgressMissions: missions.filter(m => m.status === 'in_progress').length,
      totalActivities: activities.length,
      upcomingActivities: activities.filter(a => new Date(a.scheduled_date) > now).length,
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === 'draft').length,
      thisMonthActivities: activities.filter(a => new Date(a.created_at) >= thisMonth).length,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleCreateActivity = async (activityData: any) => {
    if (!agentInfo) return;

    try {
      const { error } = await supabase
        .from('cdc_activities')
        .insert({
          agent_id: agentInfo.id,
          title: activityData.title,
          description: activityData.description,
          activity_type: activityData.activity_type,
          target_audience: activityData.target_audience,
          location: activityData.location,
          scheduled_date: activityData.scheduled_date,
          participants_count: activityData.participants_count || 0,
        });

      if (error) throw error;

      await fetchActivities();
      setShowCreateModal(false);
      alert('Activité créée avec succès!');
    } catch (error: any) {
      console.error('Error creating activity:', error);
      alert('Erreur lors de la création de l\'activité: ' + error.message);
    }
  };

  const handleUpdateActivity = async (activityId: string, activityData: any) => {
    try {
      const { error } = await supabase
        .from('cdc_activities')
        .update({
          title: activityData.title,
          description: activityData.description,
          activity_type: activityData.activity_type,
          target_audience: activityData.target_audience,
          location: activityData.location,
          scheduled_date: activityData.scheduled_date,
          participants_count: activityData.participants_count,
          status: activityData.status,
        })
        .eq('id', activityId);

      if (error) throw error;

      await fetchActivities();
      setEditingItem(null);
      alert('Activité mise à jour avec succès!');
    } catch (error: any) {
      console.error('Error updating activity:', error);
      alert('Erreur lors de la mise à jour: ' + error.message);
    }
  };

  const handleCreateReport = async (reportData: any) => {
    if (!agentInfo) return;

    try {
      const { error } = await supabase
        .from('cdc_reports')
        .insert({
          agent_id: agentInfo.id,
          title: reportData.title,
          report_type: reportData.report_type,
          content: reportData.content,
          period_start: reportData.period_start,
          period_end: reportData.period_end,
          status: 'draft',
        });

      if (error) throw error;

      await fetchReports();
      setShowCreateModal(false);
      alert('Rapport créé avec succès!');
    } catch (error: any) {
      console.error('Error creating report:', error);
      alert('Erreur lors de la création du rapport: ' + error.message);
    }
  };

  const handleSubmitReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('cdc_reports')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) throw error;

      await fetchReports();
      alert('Rapport soumis avec succès!');
    } catch (error: any) {
      console.error('Error submitting report:', error);
      alert('Erreur lors de la soumission: ' + error.message);
    }
  };

  const handleUpdateMissionStatus = async (missionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('cdc_missions')
        .update({ status: newStatus })
        .eq('id', missionId);

      if (error) throw error;

      await fetchMissions();
      alert('Statut de la mission mis à jour!');
    } catch (error: any) {
      console.error('Error updating mission:', error);
      alert('Erreur lors de la mise à jour: ' + error.message);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Agent Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agent CDC - {profile.username}</h2>
            <p className="text-gray-600">Matricule: {agentInfo?.matricule}</p>
            <p className="text-sm text-gray-500">Département: {agentInfo?.department}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">CIN National</p>
            <p className="text-lg font-semibold text-gray-900">{profile.user_id_or_registration}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Statut</p>
            <p className="text-lg font-semibold text-green-600 capitalize">{agentInfo?.status}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Date d'embauche</p>
            <p className="text-lg font-semibold text-gray-900">
              {agentInfo?.hire_date ? new Date(agentInfo.hire_date).toLocaleDateString('fr-FR') : 'N/A'}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Missions Totales</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMissions}</p>
              <p className="text-sm text-green-600">{stats.completedMissions} terminées</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activités</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalActivities}</p>
              <p className="text-sm text-blue-600">{stats.upcomingActivities} à venir</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rapports</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
              <p className="text-sm text-yellow-600">{stats.pendingReports} en attente</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ce Mois</p>
              <p className="text-3xl font-bold text-gray-900">{stats.thisMonthActivities}</p>
              <p className="text-sm text-green-600">Activités créées</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Missions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Missions Récentes</h3>
          <button
            onClick={() => setActiveTab('missions')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Voir tout
          </button>
        </div>
        <div className="p-6">
          {missions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune mission assignée</p>
          ) : (
            <div className="space-y-4">
              {missions.slice(0, 3).map((mission) => (
                <div key={mission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{mission.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[mission.status]?.bgColor} ${statusConfig[mission.status]?.color}`}>
                        {statusConfig[mission.status]?.label}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[mission.priority]?.bgColor} ${priorityConfig[mission.priority]?.color}`}>
                        {priorityConfig[mission.priority]?.label}
                      </span>
                      {mission.due_date && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(mission.due_date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
          <button
            onClick={() => setActiveTab('activities')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Voir tout
          </button>
        </div>
        <div className="p-6">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune activité créée</p>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(activity.scheduled_date).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {activity.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {activity.participants_count} participants
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMissions = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Mes Missions</h2>
        <div className="text-sm text-gray-600">
          {stats.totalMissions} missions • {stats.completedMissions} terminées • {stats.inProgressMissions} en cours
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {missions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune mission assignée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {missions.map((mission) => (
                <div key={mission.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{mission.title}</h3>
                      <p className="text-gray-600 mt-2">{mission.description}</p>
                      {mission.assigned_by && (
                        <p className="text-sm text-gray-500 mt-1">
                          Assignée par: {mission.assigned_by.username}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[mission.status]?.bgColor} ${statusConfig[mission.status]?.color}`}>
                        {statusConfig[mission.status]?.label}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[mission.priority]?.bgColor} ${priorityConfig[mission.priority]?.color}`}>
                        {priorityConfig[mission.priority]?.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {mission.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Échéance: {new Date(mission.due_date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Créée le {new Date(mission.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    {mission.status !== 'completed' && mission.status !== 'cancelled' && (
                      <div className="flex items-center gap-2">
                        {mission.status === 'assigned' && (
                          <button
                            onClick={() => handleUpdateMissionStatus(mission.id, 'in_progress')}
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
                          >
                            Commencer
                          </button>
                        )}
                        {mission.status === 'in_progress' && (
                          <button
                            onClick={() => handleUpdateMissionStatus(mission.id, 'completed')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Terminer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Activités Locales</h2>
        <button
          onClick={() => {
            setModalType('activity');
            setEditingItem(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Activité
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune activité créée</p>
              <button
                onClick={() => {
                  setModalType('activity');
                  setEditingItem(null);
                  setShowCreateModal(true);
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Créer votre première activité
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-gray-600 mt-2">{activity.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(activity.scheduled_date).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {activity.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {activity.participants_count} participants
                        </span>
                        <span className="capitalize">
                          Type: {activity.activity_type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[activity.status]?.bgColor} ${statusConfig[activity.status]?.color}`}>
                        {statusConfig[activity.status]?.label}
                      </span>
                      <button
                        onClick={() => {
                          setEditingItem(activity);
                          setModalType('activity');
                          setShowCreateModal(true);
                        }}
                        className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {activity.target_audience && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Public cible:</p>
                      <p className="text-sm text-gray-600">{activity.target_audience}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Mes Rapports</h2>
        <button
          onClick={() => {
            setModalType('report');
            setEditingItem(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Rapport
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rapport créé</p>
              <button
                onClick={() => {
                  setModalType('report');
                  setEditingItem(null);
                  setShowCreateModal(true);
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Créer votre premier rapport
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-gray-600 mt-1">Type: {reportTypes.find(t => t.value === report.report_type)?.label}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Période: {new Date(report.period_start).toLocaleDateString('fr-FR')} - {new Date(report.period_end).toLocaleDateString('fr-FR')}</span>
                        <span>Créé le {new Date(report.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[report.status]?.bgColor} ${statusConfig[report.status]?.color}`}>
                        {statusConfig[report.status]?.label}
                      </span>
                      {report.status === 'draft' && (
                        <button
                          onClick={() => handleSubmitReport(report.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Soumettre
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-3">{report.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCreateModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-red-600 via-green-600 to-blue-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {editingItem ? 'Modifier' : 'Créer'} {modalType === 'activity' ? 'une Activité' : 'un Rapport'}
            </h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            {modalType === 'activity' ? (
              <ActivityForm
                activity={editingItem}
                onSubmit={editingItem ? 
                  (data) => handleUpdateActivity(editingItem.id, data) : 
                  handleCreateActivity
                }
                onCancel={() => setShowCreateModal(false)}
              />
            ) : (
              <ReportForm
                report={editingItem}
                onSubmit={handleCreateReport}
                onCancel={() => setShowCreateModal(false)}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'missions':
        return renderMissions();
      case 'activities':
        return renderActivities();
      case 'reports':
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between lg:justify-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-600 via-green-600 to-blue-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Agent CDC</h1>
                <p className="text-sm text-gray-500">MINJEC</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-green-600 text-white shadow-md font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 bg-white mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{profile.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Tableau de bord'}
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="hidden md:block text-sm text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Modal */}
      {renderCreateModal()}
    </div>
  );
}

// Composant pour le formulaire d'activité
const ActivityForm = ({ activity, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    description: activity?.description || '',
    activity_type: activity?.activity_type || 'formation',
    target_audience: activity?.target_audience || '',
    location: activity?.location || '',
    scheduled_date: activity?.scheduled_date || '',
    participants_count: activity?.participants_count || 0,
    status: activity?.status || 'planned',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titre de l'activité <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type d'activité <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.activity_type}
            onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date prévue <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.scheduled_date}
            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lieu <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Public cible
        </label>
        <input
          type="text"
          value={formData.target_audience}
          onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ex: Jeunes de 18-35 ans, Associations locales..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de participants
          </label>
          <input
            type="number"
            value={formData.participants_count}
            onChange={(e) => setFormData({ ...formData, participants_count: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min="0"
          />
        </div>

        {activity && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="planned">Planifiée</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {activity ? 'Mettre à jour' : 'Créer l\'activité'}
        </button>
      </div>
    </form>
  );
};

// Composant pour le formulaire de rapport
const ReportForm = ({ report, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    title: report?.title || '',
    report_type: report?.report_type || 'monthly',
    content: report?.content || '',
    period_start: report?.period_start || '',
    period_end: report?.period_end || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titre du rapport <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type de rapport <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.report_type}
          onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          {reportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Début de période <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.period_start}
            onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fin de période <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.period_end}
            onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contenu du rapport <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Décrivez les activités réalisées, les résultats obtenus, les difficultés rencontrées..."
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Créer le rapport
        </button>
      </div>
    </form>
  );
};