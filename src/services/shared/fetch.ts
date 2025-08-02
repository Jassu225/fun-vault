// USED on both client and server

const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || '';

export async function fetchGet<ResT>(url: string): Promise<ResT> {
  const response = await globalThis.fetch(getBaseUrl() + url, {
    method: 'GET',
    // credentials: 'same-origin',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<ResT>;
}

export async function fechPost<ReqT, ResT>(url: string, body: ReqT): Promise<ResT> {
  const response = await globalThis.fetch(getBaseUrl() + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    // credentials: 'same-origin',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<ResT>;
}
