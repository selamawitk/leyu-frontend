"use client";
import React, { useState } from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import { useContributorTasks } from "@/lib/hooks/useContributor";
import { Badge } from "@/app/components/ui/badge";
import { Loader2, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function ContributorDashboard() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const { data: tasksData, isLoading } = useContributorTasks({ page, pageSize });

  const tasks = tasksData?.data?.result || [];

  const totalTasks = tasksData?.data?.total || 0;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingTasks = tasks.filter((t) => t.status === "NEW" || t.status === "UNDER_REVIEW").length;
  const rejectedTasks = tasks.filter((t) => t.status === "REJECTED" || t.status === "TEST_REJECTED").length;

  const statusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "NEW":
        return "bg-blue-100 text-blue-700";
      case "UNDER_REVIEW":
      case "TEST_UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
      case "TEST_REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AuthenticatedPage loadingMessage="Loading contributor dashboard...">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">{t("dashboard")}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("tasks")}</span>
            </div>
            <div className="text-2xl font-bold">{isLoading ? "-" : totalTasks}</div>
          </div>
          <div className="rounded-xl bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold">{isLoading ? "-" : completedTasks}</div>
          </div>
          <div className="rounded-xl bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold">{isLoading ? "-" : pendingTasks}</div>
          </div>
          <div className="rounded-xl bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Rejected</span>
            </div>
            <div className="text-2xl font-bold">{isLoading ? "-" : rejectedTasks}</div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">{t("tasks")}</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{task.name}</h3>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Type: {task.task_type}</span>
                      <span>Progress: {task.done_count}/{task.total_count}</span>
                      {task.estimated_earning != null && (
                        <span>Earning: {task.estimated_earning}</span>
                      )}
                    </div>
                  </div>
                  <Badge className={statusColor(task.status)}>{task.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedPage>
  );
}
