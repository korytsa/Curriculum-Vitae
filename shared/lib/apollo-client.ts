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
const ERROR_TOAST_DEDUP_MS = 1500;
const recentlyShownErrors = new Map<string, number>();

const translate = (key: string) => i18n.t(key);

const getUnauthorizedMessage = () => translate("errors.unauthorized");

const getNetworkErrorMessage = () => translate("errors.network");

const getFallbackErrorMessage = () => translate("errors.unexpected");

const enqueueErrorToast = (message: string) => {
  const now = Date.now();
  const lastShownAt = recentlyShownErrors.get(message);
  if (typeof lastShownAt === "number" && now - lastShownAt < ERROR_TOAST_DEDUP_MS) {
    return;
  }

  recentlyShownErrors.set(message, now);
  toast.error(message);

  recentlyShownErrors.forEach((timestamp, text) => {
    if (now - timestamp >= ERROR_TOAST_DEDUP_MS) {
      recentlyShownErrors.delete(text);
    }
  });
};

const errorLink = onError(({ error }) => {
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
    enqueueErrorToast(getUnauthorizedMessage());
    setAccessToken(null);
    redirectToLogin();
    return;
  }

  const userFacingMessages = new Set<string>();

  graphQLErrors?.forEach((graphQLError: GraphQLError) => {
    const userMessage = (graphQLError.extensions?.userMessage as string | undefined) || graphQLError.message;
    if (userMessage) {
      userFacingMessages.add(userMessage);
    }
  });

  if (networkError && !hasAuthNetworkError) {
    userFacingMessages.add(getNetworkErrorMessage());
  } else if (!CombinedGraphQLErrors.is(error) && error) {
    userFacingMessages.add(getFallbackErrorMessage());
  }

  if (!userFacingMessages.size) {
    userFacingMessages.add(getFallbackErrorMessage());
  }

  userFacingMessages.forEach((message) => enqueueErrorToast(message));
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
