import React, { useState, useEffect } from 'react';
import { Clock, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { faceAPI } from '../services/api';
import { User, DetectionHistory, ImageDetection } from '../types';

interface HistoryProps {
  user: User;
}

const History: React.FC<HistoryProps> = ({ user }) => {
  const [history, setHistory] = useState<DetectionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  const fetchHistory = async (page: number = 1) => {
    try {
      setLoading(true);
      const result = await faceAPI.getHistory(page, 10);
      setHistory(result);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getImageUrl = (detection: ImageDetection) => {
    if (detection.image_url) return detection.image_url;
    if (detection.file_path) return `http://localhost:5000/${detection.file_path}`;
    return null;
  };

  if (loading && !history) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Detection History</h1>
        <p className="text-gray-600">
          View your previous face detection results and statistics
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {history?.detections.length === 0 ? (
        <div className="card text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Detection History</h3>
          <p className="text-gray-600 mb-6">
            You haven't performed any face detections yet.
          </p>
          <a
            href="/detect"
            className="btn btn-primary inline-block"
          >
            Start Detecting Faces
          </a>
        </div>
      ) : (
        <>
          {/* Statistics Summary */}
          {history && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Detections</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {history.pagination.totalCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Faces</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {history.detections.reduce((sum, d) => sum + d.face_count, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {history.detections.length > 0
                        ? formatDuration(
                            history.detections.reduce((sum, d) => sum + d.processing_time_ms, 0) /
                              history.detections.length
                          )
                        : '0ms'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detection List */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Detections</h3>
            
            <div className="space-y-4">
              {history?.detections.map((detection) => (
                <div
                  key={detection.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      {getImageUrl(detection) ? (
                        <img
                          src={getImageUrl(detection)!}
                          alt="Detection result"
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Detection Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {detection.file_name || 'Image Detection'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(detection.created_at)}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{detection.face_count} face(s) detected</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(detection.processing_time_ms)}</span>
                        </div>
                      </div>

                      {detection.image_url && (
                        <p className="mt-1 text-xs text-gray-500 truncate">
                          URL: {detection.image_url}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {history && history.pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {history.pagination.currentPage} of {history.pagination.totalPages}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!history.pagination.hasPrev}
                    className="btn btn-outline px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!history.pagination.hasNext}
                    className="btn btn-outline px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History; 