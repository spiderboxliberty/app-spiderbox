export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const body = await response
      .json()
      .catch(() => ({ error: 'Le serveur ne répond pas correctement.' }));
    throw new Error(body.error ?? 'Opération impossible.');
  }
  return response.json() as Promise<T>;
}
