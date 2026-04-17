import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { fetchAuthSession } from 'aws-amplify/auth';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getExportDownloadUrl } from '../services/analysisService';

interface ExportEvent {
  status: 'processing' | 'completed' | 'failed';
  message: string;
  percent: number;
}

export function useExportTask() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const startExport = useCallback(async (startFn: () => Promise<{ task_id: string }>) => {
    setIsExporting(true);
    setProgress(0);
    setMessage('Connecting to export service...');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const toastId = toast.loading('Starting export...', {
      description: 'Preparing your file for download',
    });

    try {
      const { task_id } = await startFn();
      
      // Fetch fresh session from Amplify
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
      const sseUrl = new URL(`/export/events/${task_id}`, baseURL.startsWith('http') ? baseURL : window.location.origin + baseURL);

      await fetchEventSource(sseUrl.toString(), {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'text/event-stream',
        },
        signal: controller.signal,
        onmessage: (event) => {
          try {
            const data: ExportEvent = JSON.parse(event.data);
            setProgress(data.percent);
            setMessage(data.message);
            
            toast.loading(`Exporting: ${data.percent}%`, {
              id: toastId,
              description: data.message,
            });

            if (data.status === 'completed') {
              controller.abort();
              setIsExporting(false);
              setProgress(100);
              setMessage('Download starting...');
              
              toast.success('Export completed!', {
                id: toastId,
                description: 'Your download will start shortly.',
              });

              // Get download URL and trigger it (async)
              getExportDownloadUrl(task_id).then(({ url, filename }) => {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }).catch(err => {
                console.error('Failed to get download URL:', err);
              });
            } else if (data.status === 'failed') {
              controller.abort();
              setIsExporting(false);
              toast.error('Export failed', {
                id: toastId,
                description: data.message || 'An unknown error occurred.',
              });
            }
          } catch (err) {
            console.error('Failed to parse export event:', err);
          }
        },
        onerror: (err) => {
          console.error('Export stream error:', err);
          setIsExporting(false);
          toast.error('Export connection lost', {
            id: toastId,
            description: 'Please try again.',
          });
          throw err; // Stop retrying
        }
      });

    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setIsExporting(false);
      toast.error('Failed to start export', {
        id: toastId,
        description: err?.message || 'Please check your connection.',
      });
    }
  }, []);

  return { startExport, isExporting, progress, message };
}
