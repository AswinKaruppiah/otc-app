import { ApolloLink, Observable } from "@apollo/client";
import { isUnauthenticatedError } from "../utils/helper";

/**
 * Apollo Link that logs outgoing requests and incoming responses.
 * Enabled only if process.env.EXPO_PUBLIC_LOG_API is set to "true".
 *
 * Placed after authLink to allow logging of outgoing headers (like Bearer tokens).
 */
export const loggerLink = new ApolloLink((operation, forward) => {
  if (process.env.EXPO_PUBLIC_LOG_API !== "true") {
    return forward(operation);
  }

  const startTime = Date.now();
  const { operationName, query, variables } = operation;

  // Determine operation type (query / mutation / subscription)
  const definition = query.definitions.find(
    (def) => def.kind === "OperationDefinition"
  );
  const operationType = definition ? definition.operation : "operation";
  const opTypeUpper = operationType.toUpperCase();

  // Extract HTTP headers set by preceding links (e.g. authLink)
  const context = operation.getContext();
  const headers = context.headers || {};
  const authHeader = headers.authorization || headers.Authorization || "";
  const maskedAuth = authHeader
    ? `${authHeader.substring(0, 15)}... [Length: ${authHeader.length}]`
    : "None";

  // Pretty-print the request
  console.log(
    `\n┌────── 🚀 GRAPHQL REQUEST ──────────────────────────────────────────\n` +
    `│ Type:      ${opTypeUpper}\n` +
    `│ Operation: ${operationName || "Unnamed Operation"}\n` +
    `│ Headers:   Authorization: ${maskedAuth}\n` +
    `│ Variables: ${JSON.stringify(variables, null, 2).replace(/\n/g, "\n│            ")}\n` +
    `└────────────────────────────────────────────────────────────────────`
  );

  return new Observable((observer) => {
    let subscription;
    try {
      subscription = forward(operation).subscribe({
        next: (response) => {
          const elapsed = Date.now() - startTime;
          const hasErrors = response.errors && response.errors.length > 0;

          if (hasErrors) {
            const isUnauth = response.errors.some((err) =>
              isUnauthenticatedError(err)
            );

            if (!isUnauth) {
              console.warn(
                `\n┌────── ❌ GRAPHQL ERROR (${elapsed}ms) ───────────────────────────────\n` +
                `│ Operation: ${operationName || "Unnamed Operation"}\n` +
                `│ Errors:    ${JSON.stringify(response.errors, null, 2).replace(/\n/g, "\n│            ")}\n` +
                `│ Data:      ${JSON.stringify(response.data, null, 2).replace(/\n/g, "\n│            ")}\n` +
                `└────────────────────────────────────────────────────────────────────`
              );
            }
          } else {
            console.log(
              `\n┌────── ✅ GRAPHQL RESPONSE (${elapsed}ms) ────────────────────────────\n` +
              `│ Operation: ${operationName || "Unnamed Operation"}\n` +
              `│ Data:      ${JSON.stringify(response.data, null, 2).replace(/\n/g, "\n│            ")}\n` +
              `└────────────────────────────────────────────────────────────────────`
            );
          }
          observer.next(response);
        },
        error: (err) => {
          const elapsed = Date.now() - startTime;
          if (!isUnauthenticatedError(err)) {
            console.warn(
              `\n┌────── ❌ GRAPHQL NETWORK/HTTP ERROR (${elapsed}ms) ─────────────────\n` +
              `│ Operation: ${operationName || "Unnamed Operation"}\n` +
              `│ Error:     ${err.message || err}\n` +
              `└────────────────────────────────────────────────────────────────────`
            );
          }
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        },
      });
    } catch (e) {
      observer.error(e);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  });
});
