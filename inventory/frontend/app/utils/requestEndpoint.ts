interface Success<T> {
  data: T;
  error?: never;
}
interface Failure<E> {
  data?: never;
  error: E;
}

export type Result<T, E = Error> = Success<T> | Failure<E>;
/** Implements try/catch for a given promise.
 *
 * If the promise resolves, returns an object with a `data` property. If the promise rejects, returns an object with an `error` property.
 * @template E - the type of error to return. Defaults to `Error`.
 * @param promise - the promise to implement try/catch for.
 * @example
 * const { data, error } = await tryCatch(getData());
 * if (error) return; // handle the error
 * doSomething(data); // data can now be used
 */
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data };
  } catch (error) {
    return { error: error as E };
  }
}

/** Makes a request to the given endpoint with the given method and body.
 * @param endpoint - the endpoint to request. It will be automatically appended to the base URL, **so it should NOT start with a `/`**.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param body - the body of the request as an object. It will be automaitcally converted to a JSON object.
 * @param bypassError - whether to handle errors manually. Defaults to `false`. **Should only be used for confirmResetPassword**.
 */
export async function requestEndpoint(
  endpoint: string,
  method?: string,
  body?: object,
  bypassError?: boolean,
): Promise<void>;
/** Makes a request to the given endpoint with the given method and body.
 * @template T - the type of the request's response
 * @param endpoint - the endpoint to request. It will be automatically appended to the base URL, **so it should NOT start with a `/`**.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param body - the body of the request as an object. It will be automaitcally converted to a JSON object.
 * @param bypassError - whether to handle errors manually. Defaults to `false`. **Should only be used for confirmResetPassword**.
 * @returns the JSON response from the request.
 */
export async function requestEndpoint<T>(
  endpoint: string,
  method?: string,
  body?: object,
  bypassError?: boolean,
): Promise<T>;
export async function requestEndpoint<T>(
  endpoint: string,
  method?: string,
  body?: object,
  bypassError?: boolean,
): Promise<T | void> {
  const config = useRuntimeConfig();
  const options: RequestInit = {
    credentials: "include",
    headers: {} as Record<string, string>,
  };

  const accessToken = useCookie("access_token");
  if (accessToken.value) {
    (options.headers as Record<string, string>)["Authorization"] =
      `Bearer ${accessToken.value}`;
  }

  if (method) {
    options.method = method;
    (options.headers as Record<string, string>)["Content-Type"] =
      "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(config.public.apiBase + endpoint, options);

  // If the backend responds with 401 Unauthorized, automatically clear token and redirect to login
  if (res.status === 401 && !bypassError) {
    const accessToken = useCookie("access_token");
    const refreshToken = useCookie("refresh_token");
    accessToken.value = null;
    refreshToken.value = null;

    // Client-side redirection
    if (import.meta.client) {
      window.location.href = "/login";
    }
  }

  if (!bypassError && !res.ok) throw new Error(`Failed to fetch ${endpoint}`);

  const contentLength = res.headers.get("Content-Length");
  if (contentLength === "0") return undefined as T;

  return res.json();
}

/** **Serves as a wrapper for `tryCatch(requestEndpoint())`.**
 * @param endpoint - the endpoint to request. It will be automatically appended to the base URL, **so it should NOT start with a `/`**.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param body - the body of the request as an object. It will be automaitcally converted to a JSON object.
 * @param bypassError - whether to handle errors manually. Defaults to `false`. **Should only be used for confirmResetPassword**.
 */
export async function tryRequestEndpoint(
  endpoint: string,
  method?: string,
  body?: object,
  bypassError?: boolean,
): Promise<Result<void>>;
/** **Serves as a wrapper for `tryCatch(requestEndpoint())`.**
 * @template T - the type of the request's response
 * @param endpoint - the endpoint to request. It will be automatically appended to the base URL, **so it should NOT start with a `/`**.
 * @param method - the HTTP method to use for the request. Defaults to `"GET"`.
 * @param body - the body of the request as an object. It will be automaitcally converted to a JSON object.
 * @param bypassError - whether to handle errors manually. Defaults to `false`. **Should only be used for confirmResetPassword**.
 * @returns the JSON response from the request.
 */
export async function tryRequestEndpoint<T, K = Error>(
  endpoint: string,
  method?: string,
  body?: object,
  bypassError?: boolean,
): Promise<Result<T, K>>;
export async function tryRequestEndpoint<T, K = Error>(
  endpoint: string,
  method?: string,
  body?: object,
  bypassError?: boolean,
): Promise<Result<T | void, K>> {
  return tryCatch<T, K>(
    requestEndpoint<T>(endpoint, method, body, bypassError),
  );
}
