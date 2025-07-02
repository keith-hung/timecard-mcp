export enum TimeCardErrorCode {
  // Authentication errors
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // Data errors
  INVALID_DATE = 'INVALID_DATE',
  INVALID_PROJECT = 'INVALID_PROJECT',
  INVALID_ACTIVITY = 'INVALID_ACTIVITY',
  INVALID_INDEX = 'INVALID_INDEX',
  INVALID_HOURS = 'INVALID_HOURS',
  
  // Business logic errors
  TIMESHEET_LOCKED = 'TIMESHEET_LOCKED',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  HOURS_EXCEEDED = 'HOURS_EXCEEDED',
  
  // Technical errors
  BROWSER_ERROR = 'BROWSER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export class TimeCardError extends Error {
  public readonly code: TimeCardErrorCode;
  public readonly details?: Record<string, any>;

  constructor(code: TimeCardErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'TimeCardError';
    this.code = code;
    this.details = details;
  }

  toJSON(): Record<string, any> {
    return {
      success: false,
      error_code: this.code,
      message: this.message,
      details: this.details || {}
    };
  }
}

export function createAuthError(message: string, details?: Record<string, any>): TimeCardError {
  return new TimeCardError(TimeCardErrorCode.AUTHENTICATION_FAILED, message, details);
}

export function createDataError(message: string, details?: Record<string, any>): TimeCardError {
  return new TimeCardError(TimeCardErrorCode.INVALID_DATE, message, details);
}

export function createProjectError(projectId: string): TimeCardError {
  return new TimeCardError(
    TimeCardErrorCode.INVALID_PROJECT, 
    `Project ID '${projectId}' not found or access denied`,
    { requested_project: projectId }
  );
}

export function createActivityError(activityId: string, projectId: string): TimeCardError {
  return new TimeCardError(
    TimeCardErrorCode.INVALID_ACTIVITY,
    `Activity ID '${activityId}' not found for project '${projectId}'`,
    { requested_activity: activityId, project_id: projectId }
  );
}

export function createIndexError(index: number, maxIndex: number = 9): TimeCardError {
  return new TimeCardError(
    TimeCardErrorCode.INVALID_INDEX,
    `Entry index ${index} is out of range (0-${maxIndex})`,
    { requested_index: index, max_index: maxIndex }
  );
}

export function createBrowserError(message: string, details?: Record<string, any>): TimeCardError {
  return new TimeCardError(TimeCardErrorCode.BROWSER_ERROR, message, details);
}

export function handleError(error: unknown): TimeCardError {
  if (error instanceof TimeCardError) {
    return error;
  }
  
  if (error instanceof Error) {
    // Try to categorize common errors
    if (error.message.includes('timeout')) {
      return new TimeCardError(TimeCardErrorCode.TIMEOUT_ERROR, error.message);
    }
    
    if (error.message.includes('selector') || error.message.includes('element')) {
      return new TimeCardError(TimeCardErrorCode.ELEMENT_NOT_FOUND, error.message);
    }
    
    if (error.message.includes('network') || error.message.includes('connection')) {
      return new TimeCardError(TimeCardErrorCode.NETWORK_ERROR, error.message);
    }
    
    return new TimeCardError(TimeCardErrorCode.BROWSER_ERROR, error.message);
  }
  
  return new TimeCardError(TimeCardErrorCode.BROWSER_ERROR, 'Unknown error occurred');
}