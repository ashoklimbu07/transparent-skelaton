/** Sleep for ms, or reject if signal is aborted (so generation can stop when client cancels). */
export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    const err = new Error('Cancelled') as Error & { name: string };
    err.name = 'AbortError';
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      const err = new Error('Cancelled') as Error & { name: string };
      err.name = 'AbortError';
      reject(err);
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

