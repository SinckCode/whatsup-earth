import { API_BASE_URL } from '../api/config';

type LogLevel = 'info' | 'warn' | 'error';
type LogCategory = 'ui_error' | 'api_error' | 'navigation';

interface ClientLog {
  level: LogLevel;
  message: string;
  category: LogCategory;
  meta?: {
    component?: string;
    url?: string;
    stack?: string;
    userId?: number;
    userAgent?: string;
  };
}

// Buffer de logs para enviar en batch
let logBuffer: ClientLog[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const FLUSH_INTERVAL = 5000; // 5 segundos
const MAX_BUFFER_SIZE = 20;

function getBaseUrl(): string {
  // Quitar /api del final si existe para construir /api/client-logs
  return API_BASE_URL.replace(/\/api\/?$/, '');
}

async function flushLogs(): Promise<void> {
  if (logBuffer.length === 0) return;

  const logsToSend = [...logBuffer];
  logBuffer = [];

  try {
    await fetch(`${getBaseUrl()}/api/client-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs: logsToSend }),
    });
  } catch {
    // Si falla el envio, no re-encolar para evitar loops
  }
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushLogs();
  }, FLUSH_INTERVAL);
}

function pushLog(log: ClientLog): void {
  logBuffer.push(log);
  if (logBuffer.length >= MAX_BUFFER_SIZE) {
    flushLogs();
  } else {
    scheduleFlush();
  }
}

// API publica
export const clientLogger = {
  info(message: string, category: LogCategory = 'navigation', meta?: ClientLog['meta']) {
    pushLog({ level: 'info', message, category, meta });
  },
  warn(message: string, category: LogCategory = 'ui_error', meta?: ClientLog['meta']) {
    pushLog({ level: 'warn', message, category, meta });
  },
  error(message: string, category: LogCategory = 'ui_error', meta?: ClientLog['meta']) {
    pushLog({ level: 'error', message, category, meta });
  },
};

// Captura global de errores no manejados
export function initGlobalErrorHandlers(): void {
  window.addEventListener('error', (event) => {
    clientLogger.error(event.message, 'ui_error', {
      stack: event.error?.stack,
      url: event.filename,
      userAgent: navigator.userAgent,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason);
    clientLogger.error(`Unhandled rejection: ${message}`, 'ui_error', {
      stack: event.reason?.stack,
      userAgent: navigator.userAgent,
    });
  });

  // Flush al cerrar la pagina
  window.addEventListener('beforeunload', () => {
    flushLogs();
  });
}
