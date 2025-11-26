import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors, ServerError } from "@apollo/client/errors";
import { ApolloProvider } from "@apollo/client/react";
import { accessTokenVar, setAccessToken } from "@/shared/config/apollo";
import { redirectToLogin } from "./auth";

const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_URI ||
    "https://cv-project-js.inno.ws/api/graphql",
});

const errorLink = onError(({ error }) => {
  const hasAuthGraphqlError = CombinedGraphQLErrors.is(error)
    ? error.errors.some((graphQLError) => {
        const code = (
          graphQLError.extensions?.code as string | undefined
        )?.toUpperCase();
        const message = graphQLError.message?.toLowerCase?.() ?? "";
        return (
          code === "UNAUTHENTICATED" ||
          code === "FORBIDDEN" ||
          message.includes("unauthorized") ||
          message.includes("forbidden")
        );
      })
    : false;

  const hasAuthNetworkError =
    !CombinedGraphQLErrors.is(error) &&
    typeof (error as Partial<ServerError>)?.statusCode === "number" &&
    (error as Partial<ServerError>).statusCode === 401;

  if (hasAuthGraphqlError || hasAuthNetworkError) {
    setAccessToken(null);
    redirectToLogin();
  }
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
