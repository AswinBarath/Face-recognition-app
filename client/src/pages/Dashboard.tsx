import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Camera, Users, Clock, TrendingUp } from 'lucide-react';
import { faceAPI } from '../services/api';
import { User, UserStats } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await faceAPI.getStats();
        setStats(userStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Images',
      value: stats?.totalImages || 0,
      icon: Camera,
      color: 'bg-blue-500',
      description: 'Images uploaded',
    },
    {
      title: 'Total Detections',
      value: stats?.totalDetections || 0,
      icon: Users,
      color: 'bg-green-500',
      description: 'Face detection sessions',
    },
    {
      title: 'Faces Detected',
      value: stats?.totalFacesDetected || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Total faces found',
    },
    {
      title: 'Member Since',
      value: stats?.joinedDate ? new Date(stats.joinedDate).toLocaleDateString() : 'N/A',
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Account creation date',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
            <p className="text-primary-100 mt-2">
              Ready to detect some faces? Upload an image or enter a URL to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/detect"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Camera className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Detect Faces</h3>
              <p className="text-gray-600">Upload an image or enter a URL to detect faces</p>
            </div>
          </div>
        </Link>

        <Link
          to="/history"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">View History</h3>
              <p className="text-gray-600">Check your previous face detection results</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {stats?.totalDetections === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No face detections yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start by uploading your first image to detect faces
            </p>
            <Link
              to="/detect"
              className="btn btn-primary mt-4 inline-block"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              You've detected {stats?.totalFacesDetected} faces in {stats?.totalImages} images!
            </p>
            <Link
              to="/history"
              className="btn btn-outline mt-4 inline-block"
            >
              View Full History
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 