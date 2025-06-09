import React, { useState, useEffect } from "react";
import {
  Users,
  Settings,
  Shield,
  Activity,
  Search,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  isUserAdmin,
  getSiteSettings,
  updateSiteSetting,
  getAllUsers,
  getUserSessions,
  getAdminUsers,
} from "../../lib/admin";
import ProductManagement from "./ProductManagement";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const adminStatus = await isUserAdmin(user.id);
      setIsAdmin(adminStatus);

      if (adminStatus) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [settingsData, usersData, sessionsData, adminsData] =
        await Promise.all([
          getSiteSettings(),
          getAllUsers(),
          getUserSessions(),
          getAdminUsers(),
        ]);

      const settingsObj =
        settingsData?.reduce((acc: any, setting: any) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {}) || {};

      setSiteSettings(settingsObj);
      setUsers(usersData || []);
      setSessions(sessionsData || []);
      setAdmins(adminsData || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleSettingToggle = async (key: string, currentValue: boolean) => {
    try {
      await updateSiteSetting(key, { enabled: !currentValue });
      setSiteSettings((prev) => ({
        ...prev,
        [key]: { enabled: !currentValue },
      }));
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Please sign in to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Access Required
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: Activity },
    { id: "products", name: "Products", icon: Search },
    { id: "users", name: "Users", icon: Users },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your beauty brand website</p>
        </div>

      
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-rose-500 text-rose-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        
        {activeTab === "overview" && (
          <div className="space-y-6">
          
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Sessions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {sessions.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Admin Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {admins.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-rose-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Site Status
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {siteSettings.site_access?.enabled ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

           
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent User Sessions
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.user_profiles?.full_name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.user_profiles?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(session.last_activity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && <ProductManagement />}

        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                User Management
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.full_name || "No Name"}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Site Settings
                </h3>
              </div>
              <div className="p-6 space-y-6">
              
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Site Access
                    </h4>
                    <p className="text-sm text-gray-500">
                      Control public access to the website
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingToggle(
                        "site_access",
                        siteSettings.site_access?.enabled
                      )
                    }
                    className="flex items-center"
                  >
                    {siteSettings.site_access?.enabled ? (
                      <ToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      User Registration
                    </h4>
                    <p className="text-sm text-gray-500">
                      Allow new users to register
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingToggle(
                        "user_registration",
                        siteSettings.user_registration?.enabled
                      )
                    }
                    className="flex items-center"
                  >
                    {siteSettings.user_registration?.enabled ? (
                      <ToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

              
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Maintenance Mode
                    </h4>
                    <p className="text-sm text-gray-500">
                      Put site in maintenance mode
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSettingToggle(
                        "site_maintenance",
                        siteSettings.site_maintenance?.enabled
                      )
                    }
                    className="flex items-center"
                  >
                    {siteSettings.site_maintenance?.enabled ? (
                      <ToggleRight className="w-8 h-8 text-yellow-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

           
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Admin Users
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {admin.user_profiles?.full_name || "Admin User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {admin.user_profiles?.email}
                          </p>
                          <p className="text-xs text-gray-400">
                            Role: {admin.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          Admin
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
