import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { fetchEventSource } from '@microsoft/fetch-event-source';

/**
 * Hook to handle Server-Sent Events (SSE).
 * Uses @microsoft/fetch-event-source for secure header-based auth.
 */
export function useSSE<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!url) return;

    // Close existing connection if any
    disconnect();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Fetch fresh session from Amplify
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      // Use the API base URL if provided, otherwise fallback to window.location.origin
      const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
      
      const sseUrl = new URL(url, baseURL.startsWith('http') ? baseURL : window.location.origin + baseURL);

      await fetchEventSource(sseUrl.toString(), {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'text/event-stream',
        },
        signal: controller.signal,
        onopen: async (response) => {
          if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
            setIsConnected(true);
            setError(null);
          } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new Error(`Failed to connect: ${response.statusText}`);
          }
        },
        onmessage: (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
          } catch (err) {
            console.error('Failed to parse SSE message:', err);
          }
        },
        onclose: () => {
          setIsConnected(false);
        },
        onerror: (err) => {
          console.error('SSE Error:', err);
          setError('Connection failed');
          setIsConnected(false);
          // Re-throw to allow auto-retry behavior of fetch-event-source
          throw err;
        },
      });

    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // Normal cleanup
      }
      console.error('Failed to establish SSE connection:', err);
      setError(err?.message || 'Connection failed');
      setIsConnected(false);
    }
  }, [url, disconnect]);

  useEffect(() => {
    if (url) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  return { data, error, isConnected, disconnect, connect };
}
