type LogContext = Record<string, unknown>;

function formatMessage(level: string, message: string, context?: LogContext): string {
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context
    });
  }
  const ctx = context ? ` ${JSON.stringify(context)}` : '';
  return `[${level.toUpperCase()}] ${message}${ctx}`;
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(formatMessage('info', message, context));
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatMessage('warn', message, context));
  },

  error(message: string, error?: unknown, context?: LogContext) {
    const errorInfo: LogContext = {};
    if (error instanceof Error) {
      errorInfo.errorMessage = error.message;
      errorInfo.errorName = error.name;
      if (process.env.NODE_ENV !== 'production') {
        errorInfo.stack = error.stack;
      }
    }
    console.error(formatMessage('error', message, { ...errorInfo, ...context }));
  }
};
