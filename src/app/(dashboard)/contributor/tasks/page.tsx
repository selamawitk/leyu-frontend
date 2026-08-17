"use client";
import React, { useState } from "react";
import AuthenticatedPage from "@/app/components/layout/AuthenticatedPage";
import { useContributorTasks } from "@/lib/hooks/useContributor";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/components/ui/button";
import { renderPaginationButtons } from "@/components/ui/paginationHelper";
import { ChevronLeftIcon, ChevronRightIcon, Loader2, Search } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function ContributorTasks() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: tasksData, isLoading } = useContributorTasks({
    page,
    pageSize,
    searchQuery: debouncedSearch,
  });

  const tasks = tasksData?.data || [];
  const totalPages = tasksData?.totalPages || 1;
  const totalElements = tasksData?.total || 0;
  const startRecord = tasks.length ? (page - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(page * pageSize, totalElements);

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
    <AuthenticatedPage loadingMessage="Loading tasks...">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">{t("tasks")}</h1>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded-md text-sm px-2 py-2 bg-white"
          >
            {[5, 10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tasks found.</p>
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
                    <span>Approved: {task.approved_count}</span>
                    <span>Pending: {task.pending_count}</span>
                    {task.dead_line && (
                      <span>Deadline: {new Date(task.dead_line).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <Badge className={statusColor(task.status)}>{task.status}</Badge>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <span className="text-sm text-muted-foreground">
            {totalElements > 0
              ? `Showing ${startRecord} to ${endRecord} out of ${totalElements}`
              : ""}
          </span>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            {renderPaginationButtons({
              currentPage: page,
              totalPages,
              onPageChange: setPage,
            })}
            <Button
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AuthenticatedPage>
  );
}
