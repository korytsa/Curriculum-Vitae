import { useSafeMutation } from "@/shared/lib";
import { DELETE_CV_MUTATION, CVS_QUERY } from "./graphql";
import type {
  DeleteCvMutation,
  DeleteCvMutationVariables,
  DeleteCvInput,
} from "@/shared/graphql/generated";

export type DeleteCvPayload = DeleteCvInput;

export function useDeleteCv() {
  const { mutate, loading, error } = useSafeMutation<
    DeleteCvMutation,
    DeleteCvMutationVariables
  >(DELETE_CV_MUTATION, {
    refetchQueries: [{ query: CVS_QUERY }],
  });

  const handleDeleteCv = async (payload: DeleteCvPayload) => {
    return mutate({
      variables: {
        cv: payload,
      },
    });
  };

  return {
    deleteCv: handleDeleteCv,
    loading,
    error,
  };
}
