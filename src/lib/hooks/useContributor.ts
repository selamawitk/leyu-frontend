import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { PaginationResponse } from "@/app/types/global";

export interface ContributorTask {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  require_contributor_test: boolean;
  task_type: string;
  done_count: number;
  total_count: number;
  rejected_count: number;
  approved_count: number;
  pending_count: number;
  dead_line?: string;
  status: 'REJECTED' | 'TEST_REJECTED' | 'UNDER_REVIEW' | 'TEST_UNDER_REVIEW' | 'NEW' | 'COMPLETED';
  average_time: number | null;
  estimated_earning: number | null;
  earning_per_task: number | null;
}

interface ContributorTasksResponse extends PaginationResponse<ContributorTask> {}

interface UseContributorTasksProps {
  page: number;
  pageSize: number;
  searchQuery?: string;
}

export function useContributorTasks({
  page,
  pageSize,
  searchQuery,
}: UseContributorTasksProps) {
  const { data: session } = useSession();
  return useQuery<ContributorTasksResponse>({
    queryKey: ["contributor_tasks", page, pageSize, searchQuery],
    queryFn: async () => {
      try {
        if (!session?.access_token) {
          throw new Error("No authentication token available");
        }
        const params = new URLSearchParams({
          page: String(page),
          limit: String(pageSize),
          ...(searchQuery && { search: searchQuery }),
        });

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get<ContributorTasksResponse>(
          `${baseUrl}/task-distribution/my-tasks?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message || "Failed to fetch tasks";
          toast.error("Error", { description: message });
        }
        throw error;
      }
    },
    enabled: !!session?.access_token,
    retry: (failureCount, error) => {
      if (error.message === "No authentication token available") return false;
      return failureCount < 2;
    },
  });
}
