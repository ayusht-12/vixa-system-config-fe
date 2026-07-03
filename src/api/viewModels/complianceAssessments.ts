import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeAssessment,
  fetchAssessments,
  fetchFrameworks,
  startAssessment,
} from "../compliance";

export function useComplianceAssessmentsViewModel() {
  const queryClient = useQueryClient();
  const assessments = useQuery({
    queryKey: ["compliance", "assessments"],
    queryFn: fetchAssessments,
  });
  const frameworks = useQuery({
    queryKey: ["compliance", "frameworks"],
    queryFn: fetchFrameworks,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["compliance", "assessments"] });
  }

  return {
    assessments: assessments.data ?? [],
    frameworkOptions: (frameworks.data ?? []).map((f) => ({
      id: f.id,
      label: f.display_name,
    })),
    isLoading: assessments.isLoading || frameworks.isLoading,
    error: (assessments.error ?? frameworks.error) as Error | null,
    start: (frameworkId: string) =>
      startAssessment({ framework_id: frameworkId }).then(invalidate),
    complete: (assessmentId: string) => completeAssessment(assessmentId).then(invalidate),
  };
}
