import { useCallback } from "react";
import {
  type DocumentNode,
  type MutationFunctionOptions,
  type MutationHookOptions,
  type TypedDocumentNode,
} from "@apollo/client";
import { useMutation } from "@apollo/client/react";

type MutationDocument<TData, TVariables> = DocumentNode | TypedDocumentNode<TData, TVariables>;

export function useSafeMutation<TData, TVariables>(
  document: MutationDocument<TData, TVariables>,
  options?: MutationHookOptions<TData, TVariables>,
) {
  const [mutateFn, result] = useMutation<TData, TVariables>(document, options);

  const mutate = useCallback(
    async (mutateOptions?: MutationFunctionOptions<TData, TVariables>) => {
      try {
        return await mutateFn(mutateOptions);
      } catch (mutationError) {
        console.error("[GraphQL mutation error]", mutationError);
        throw mutationError;
      }
    },
    [mutateFn],
  );

  return {
    mutate,
    ...result,
  };
}

