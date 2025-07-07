export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 404, details);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

export class ExternalServiceError extends ApiError {
  constructor(service: string, message: string, statusCode: number = 502, details?: any) {
    super(`Erro na comunicação com ${service}: ${message}`, statusCode, details);
  }
} 