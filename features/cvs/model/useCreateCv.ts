import { useSafeMutation } from "@/shared/lib";
import { accessTokenVar } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import { CREATE_CV_MUTATION, CVS_QUERY } from "./graphql";
import type {
  CreateCvInput,
  CreateCvMutation,
  CreateCvMutationVariables,
} from "@/shared/graphql/generated";

export type CreateCvPayload = Omit<CreateCvInput, "userId">;

export function useCreateCv() {
  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const userId = decodedToken?.sub?.toString();

  const { mutate, loading, error } = useSafeMutation<
    CreateCvMutation,
    CreateCvMutationVariables
  >(CREATE_CV_MUTATION, {
    refetchQueries: [{ query: CVS_QUERY }],
  });

  const handleCreateCv = async (payload: CreateCvPayload) => {
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    return mutate({
      variables: {
        cv: {
          ...payload,
          userId,
        },
      },
    });
  };

  return {
    createCv: handleCreateCv,
    loading,
    error,
  };
}
