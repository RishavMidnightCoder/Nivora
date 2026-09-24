import type { AxiosRequestConfig } from "axios";
import api from "./instance";

/** Common request options — same shape as your old RequestOptions */
export interface RequestOptions<TBody = unknown, TParams = Record<string, unknown>> {
  endpoint: string;
  data?: TBody;
  params?: TParams;
  extraHeaders?: Record<string, string>;
  signal?: AbortSignal;
}

/** GET JSON, returns backend payload directly */
export async function getData<T = any>(opts: Omit<RequestOptions, "data">): Promise<T> {
  const { endpoint, params, extraHeaders, signal } = opts;
  const res = await api.get<T>(endpoint, {
    params,
    signal,
    headers: { ...(extraHeaders ?? {}) },
  });
  return res.data;
}

/** POST JSON, returns backend payload directly */
export async function postData<T = any>(opts: RequestOptions): Promise<T> {
  const { endpoint, data, params, extraHeaders } = opts;
  const res = await api.post<T>(endpoint, data ?? {}, {
    params,
    headers: { ...(extraHeaders ?? {}) },
  });
  return res.data;
}

/** PATCH JSON, returns backend payload directly */
export async function patchData<T = any>(opts: RequestOptions): Promise<T> {
  const { endpoint, data, params, extraHeaders } = opts;
  const res = await api.patch<T>(endpoint, data ?? {}, {
    params,
    headers: { ...(extraHeaders ?? {}) },
  });
  return res.data;
}

/** PUT JSON, returns backend payload directly */
export async function putData<T = any>(opts: RequestOptions): Promise<T> {
  const { endpoint, data, params, extraHeaders } = opts;
  const res = await api.put<T>(endpoint, data ?? {}, {
    params,
    headers: { ...(extraHeaders ?? {}) },
  });
  return res.data;
}

/** DELETE JSON, returns backend payload directly */
export async function deleteData<T = any>(opts: RequestOptions): Promise<T> {
  const { endpoint, data, params, extraHeaders } = opts;
  const res = await api.delete<T>(endpoint, {
    data,
    params,
    headers: { ...(extraHeaders ?? {}) },
  });
  return res.data;
}

/** POST multipart/form-data, returns backend payload directly */
export async function postFormData<T = any>(opts: RequestOptions<FormData>): Promise<T> {
  const { endpoint, data, params, extraHeaders } = opts;
  const res = await api.post<T>(endpoint, data ?? new FormData(), {
    params,
    headers: {
      "Content-Type": undefined,
      ...(extraHeaders ?? {}),
    },
  });
  return res.data;
}