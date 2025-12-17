// website/src/utils/errorHandler.ts

// Define error types
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Interface for error objects
export interface AppError {
  id: string;
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: Date;
  component?: string;
  stackTrace?: string;
  userId?: string;
  userAction?: string;
}

// Interface for logger
export interface Logger {
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string | Error, meta?: any): void;
  debug(message: string, meta?: any): void;
}

// Simple in-memory logger implementation
class SimpleLogger implements Logger {
  private logs: AppError[] = [];

  info(message: string, meta?: any): void {
    console.info(`[INFO] ${new Date().toISOString()}: ${message}`, meta);
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta);
  }

  error(message: string | Error, meta?: any): void {
    const timestamp = new Date().toISOString();
    if (typeof message === 'string') {
      console.error(`[ERROR] ${timestamp}: ${message}`, meta);
    } else {
      console.error(`[ERROR] ${timestamp}: ${message.message}`, { ...meta, stack: message.stack });
    }
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta);
    }
  }

  getLogs(): AppError[] {
    return [...this.logs];
  }
}

// Global error handler
class ErrorHandler {
  private logger: Logger;
  private onErrorCallback?: (error: AppError) => void;

  constructor(logger?: Logger) {
    this.logger = logger || new SimpleLogger();
    
    // Set up global error handlers
    this.setupGlobalHandlers();
  }

  // Set up callback for error handling
  setOnError(callback: (error: AppError) => void): void {
    this.onErrorCallback = callback;
  }

  // Handle an error
  handleError(error: any, component?: string, userAction?: string): AppError {
    const appError: AppError = this.createAppError(error, component, userAction);
    
    // Log the error appropriately
    if (appError.type === ErrorType.VALIDATION_ERROR) {
      this.logger.warn(appError.message, appError);
    } else {
      this.logger.error(appError.message, appError);
    }
    
    // Call error callback if available
    if (this.onErrorCallback) {
      this.onErrorCallback(appError);
    }
    
    return appError;
  }

  // Create a standardized AppError object
  private createAppError(error: any, component?: string, userAction?: string): AppError {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let errorType: ErrorType = ErrorType.UNKNOWN_ERROR;
    let message = 'An unknown error occurred';
    let details: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      details = error.stack;
    } else if (typeof error === 'string') {
      message = error;
    } else {
      // Try to extract message from other types of error objects
      message = error?.message || error?.toString() || JSON.stringify(error);
    }

    // Determine error type based on message or other properties
    if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
      errorType = ErrorType.NETWORK_ERROR;
    } else if (message.toLowerCase().includes('validation') || message.toLowerCase().includes('invalid')) {
      errorType = ErrorType.VALIDATION_ERROR;
    } else if (message.toLowerCase().includes('auth') || message.toLowerCase().includes('token')) {
      errorType = ErrorType.AUTHENTICATION_ERROR;
    } else if (error.status >= 500) {
      errorType = ErrorType.SERVER_ERROR;
    } else if (error.status >= 400) {
      errorType = ErrorType.CLIENT_ERROR;
    }

    return {
      id: errorId,
      type: errorType,
      message,
      details,
      timestamp: new Date(),
      component,
      stackTrace: details,
      userAction
    };
  }

  // Set up global error handlers
  private setupGlobalHandlers(): void {
    // Handle uncaught exceptions
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError(event.error, 'Global', 'Uncaught Error');
      });

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(event.reason, 'Global', 'Unhandled Promise Rejection');
        // Prevent the default behavior of logging to console
        // event.preventDefault(); // Uncomment if you want to prevent default logging
      });
    }
  }

  // Get the logger
  getLogger(): Logger {
    return this.logger;
  }
}

// Global singleton instance
const errorHandler = new ErrorHandler();
export default errorHandler;