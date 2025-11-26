import { useSafeMutation } from "@/shared/lib";
import { UPDATE_CV_MUTATION, CV_QUERY, CVS_QUERY } from "./graphql";
import type {
  UpdateCvMutation,
  UpdateCvMutationVariables,
  UpdateCvInput,
} from "@/shared/graphql/generated";

export type UpdateCvPayload = Omit<UpdateCvInput, "cvId">;

export function useUpdateCv(cvId: string) {
  const { mutate, loading, error } = useSafeMutation<
    UpdateCvMutation,
    UpdateCvMutationVariables
  >(UPDATE_CV_MUTATION, {
    refetchQueries: [
      { query: CV_QUERY, variables: { cvId } },
      { query: CVS_QUERY },
    ],
  });

  const handleUpdateCv = async (payload: UpdateCvPayload) => {
    return mutate({
      variables: {
        cv: {
          ...payload,
          cvId,
        },
      },
    });
  };

  return {
    updateCv: handleUpdateCv,
    loading,
    error,
  };
}
