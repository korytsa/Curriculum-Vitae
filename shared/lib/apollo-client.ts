import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import type { GraphQLError } from "graphql";
import toast from "react-hot-toast";
import { ApolloProvider } from "@apollo/client/react";
import { accessTokenVar, setAccessToken } from "@/shared/config/apollo";
import i18n from "@/shared/lib/i18n";
import { redirectToLogin } from "./auth";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "https://cv-project-js.inno.ws/api/graphql",
});

const UNAUTHORIZED_CODES = new Set(["UNAUTHENTICATED", "FORBIDDEN"]);

const getUnauthorizedMessage = () => i18n.t("errors.unauthorized");

const getNetworkErrorMessage = () => i18n.t("errors.network");

const getFallbackErrorMessage = () => i18n.t("errors.unexpected");

export type ErrorHandler = (message: string, error: unknown) => void;

export interface ApolloErrorContext {
  skipErrorToast?: boolean;
  errorHandler?: ErrorHandler;
}

const errorLink = onError(({ error, operation }) => {
  const context = operation.getContext() as ApolloErrorContext;
  const skipErrorToast = context.skipErrorToast === true;
  const customErrorHandler = context.errorHandler;

  const graphQLErrors = CombinedGraphQLErrors.is(error) ? (error.errors as readonly GraphQLError[]) : undefined;

  const hasAuthGraphqlError =
    graphQLErrors?.some((graphQLError: GraphQLError) => {
      const code = (graphQLError.extensions?.code as string | undefined)?.toUpperCase();
      const message = graphQLError.message?.toLowerCase?.() ?? "";
      return (code && UNAUTHORIZED_CODES.has(code)) || message.includes("unauthorized") || message.includes("forbidden");
    }) ?? false;

  const networkError = !CombinedGraphQLErrors.is(error) ? (error as Partial<ServerError>) : undefined;
  const hasAuthNetworkError = typeof networkError?.statusCode === "number" && networkError.statusCode === 401;

  if (hasAuthGraphqlError || hasAuthNetworkError) {
    toast.error(getUnauthorizedMessage());
    setAccessToken(null);
    redirectToLogin();
    return;
  }

  if (customErrorHandler) {
    const userFacingMessages: string[] = [];

    graphQLErrors?.forEach((graphQLError: GraphQLError) => {
      const userMessage = (graphQLError.extensions?.userMessage as string | undefined) || graphQLError.message;
      if (userMessage) {
        userFacingMessages.push(userMessage);
      }
    });

    if (networkError && !hasAuthNetworkError) {
      userFacingMessages.push((networkError as Error)?.message || getNetworkErrorMessage());
    } else if (!CombinedGraphQLErrors.is(error) && error) {
      userFacingMessages.push(error.message ?? getNetworkErrorMessage());
    }

    if (!userFacingMessages.length) {
      userFacingMessages.push(getFallbackErrorMessage());
    }

    customErrorHandler(userFacingMessages.length > 0 ? userFacingMessages[0] : getFallbackErrorMessage(), error);
    return;
  }

  if (skipErrorToast) {
    return;
  }

  const userFacingMessages: string[] = [];

  graphQLErrors?.forEach((graphQLError: GraphQLError) => {
    const userMessage = (graphQLError.extensions?.userMessage as string | undefined) || graphQLError.message;
    if (userMessage) {
      userFacingMessages.push(userMessage);
    }
  });

  if (networkError && !hasAuthNetworkError) {
    userFacingMessages.push((networkError as Error)?.message || getNetworkErrorMessage());
  } else if (!CombinedGraphQLErrors.is(error) && error) {
    userFacingMessages.push(error.message ?? getNetworkErrorMessage());
  }

  if (!userFacingMessages.length) {
    userFacingMessages.push(getFallbackErrorMessage());
  }

  userFacingMessages.forEach((message) => toast.error(message));
});

const authLink = setContext((_, { headers }) => {
  const token = accessTokenVar();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export { ApolloProvider };
