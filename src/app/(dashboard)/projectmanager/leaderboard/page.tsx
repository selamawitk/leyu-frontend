"use client";

import React, { useState } from "react";
import { useLeaderboard } from "@/lib/hooks/useStatistics";
import { MyProjectProfiles } from "@/lib/hooks/useProject";
import { Trophy, Medal, Award, Crown, Users, Loader2 } from "lucide-react";

export default function LeaderboardPage() {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const { data: projects } = MyProjectProfiles({ page: 1, pageSize: 100, filters: {} });
  const {
    data: leaderboardData,
    isLoading,
  } = useLeaderboard(selectedProject || undefined);

  const leaderboard = leaderboardData?.data?.leaderboard ?? [];

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/25";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-md shadow-gray-400/25";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/25";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5" />;
      case 2:
        return <Medal className="w-5 h-5" />;
      case 3:
        return <Award className="w-5 h-5" />;
      default:
        return <span className="text-sm font-medium">{rank}</span>;
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30";
    if (accuracy >= 70) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30";
    return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30";
  };

  return (
    <div className="p-6 space-y-6 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Contributor Leaderboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Top contributors ranked by performance
            </p>
          </div>
        </div>
        <select
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects?.data?.result?.map((project: any) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {leaderboard.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {leaderboard.slice(0, 3).map((entry: any, index: number) => {
            const rank = index + 1;
            const colors =
              rank === 1
                ? "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 border-yellow-300 dark:border-yellow-700"
                : rank === 2
                  ? "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border-gray-300 dark:border-gray-600"
                  : "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-400 dark:border-amber-700";
            return (
              <div
                key={entry.user_id}
                className={`bg-gradient-to-br ${colors} border rounded-xl p-5 flex items-center gap-4 transition-transform hover:scale-[1.02]`}
              >
                <div
                  className={`p-3 rounded-full ${getRankStyle(rank)} flex items-center justify-center`}
                >
                  {getRankIcon(rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {entry.first_name} {entry.last_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {entry.score}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No leaderboard data available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Select a project or wait for contributors to submit data
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Approved
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rejected
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Accuracy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {leaderboard.map((entry: any, index: number) => {
                  const rank = index + 1;
                  return (
                    <tr
                      key={entry.user_id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        rank <= 3 ? "bg-gray-50/50 dark:bg-gray-700/20" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${getRankStyle(rank)}`}
                        >
                          {getRankIcon(rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {entry.first_name?.[0]}
                            {entry.last_name?.[0]}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {entry.first_name} {entry.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                          {entry.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {entry.total_submitted}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          {entry.total_approved}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          {entry.total_rejected}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getAccuracyColor(entry.accuracy_rate)}`}
                        >
                          {entry.accuracy_rate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
