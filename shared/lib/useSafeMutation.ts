import { useCallback } from "react";
import {
  type DocumentNode,
  type OperationVariables,
  type TypedDocumentNode,
} from "@apollo/client";
import {
  useMutation,
  type MutationHookOptions,
} from "@apollo/client/react";

type MutationDocument<TData, TVariables> = DocumentNode | TypedDocumentNode<TData, TVariables>;

export function useSafeMutation<TData, TVariables extends OperationVariables>(
  document: MutationDocument<TData, TVariables>,
  options?: MutationHookOptions<TData, TVariables>,
) {
  const [mutateFn, result] = useMutation<TData, TVariables>(document, options);

  const mutate = useCallback(
    async (
      ...args: Parameters<typeof mutateFn>
    ) => {
      try {
        return await mutateFn(...args);
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

