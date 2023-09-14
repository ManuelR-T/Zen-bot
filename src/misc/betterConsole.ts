declare global {
  // eslint-disable-next-line
  interface Console {
    // eslint-disable-next-line
    success(message?: any, ...optionalParams: any[]): void
  }
}

const betterConsole = (): void => {
  type FormatterKeys = "info" | "warn" | "error" | "success";
  type ConsoleMethods = "info" | "warn" | "error" | "log";

  const formatter: Record<FormatterKeys, string> = {
    info: "\x1b[1m\x1b[2m[INFO]\x1b[0m\x1b[2m",
    warn: "\x1b[1m\x1b[33m[WARN]\x1b[0m\x1b[33m",
    error: "\x1b[1m\x1b[31m[ERROR]\x1b[0m\x1b[31m",
    success: "\x1b[1m\x1b[32m[SUCCESS]\x1b[0m\x1b[32m",
  };

  const createLogger = (method: ConsoleMethods, format: string) => {
    const original = console[method]
    // eslint-disable-next-line
    return (message?: any, ...optionalParams: any[]) => {
      if (typeof message === 'string') {
        original(`${format} ${message}\x1b[0m`, ...optionalParams)
      } else {
        original(message, ...optionalParams)
      }
    }
  }

  console.info = createLogger('info', formatter.info)
  console.warn = createLogger('warn', formatter.warn)
  console.error = createLogger('error', formatter.error)
  console.success = createLogger('log', formatter.success)
}

export default betterConsole
