export class HttpResponse {
  static success(data: any, message?: string, statusCode: number = 200) {
    return {
      success: true,
      statusCode,
      message: message || "Operação realizada com sucesso",
      data,
      timestamp: new Date().toISOString()
    };
  }

  static created(data: any, message?: string) {
    return this.success(data, message || "Recurso criado com sucesso", 201);
  }

  static noContent(message?: string) {
    return {
      success: true,
      statusCode: 204,
      message: message || "Operação realizada sem conteúdo",
      timestamp: new Date().toISOString()
    };
  }

  static badRequest(message: string, details?: any) {
    return {
      success: false,
      statusCode: 400,
      message: "Dados inválidos",
      error: message,
      details,
      timestamp: new Date().toISOString()
    };
  }

  static unauthorized(message: string = "Não autorizado") {
    return {
      success: false,
      statusCode: 401,
      message: message || "Não autorizado",
      error: "Unauthorized",
      timestamp: new Date().toISOString()
    };
  }

  static forbidden(message: string = "Acesso negado") {
    return {
      success: false,
      statusCode: 403,
      message: message || "Acesso negado",
      error: "Forbidden",
      timestamp: new Date().toISOString()
    };
  }

  static notFound(message: string = "Recurso não encontrado") {
    return {
      success: false,
      statusCode: 404,
      message: message || "Recurso não encontrado",
      error: "Not Found",
      timestamp: new Date().toISOString()
    };
  }

  static conflict(message: string, details?: any) {
    return {
      success: false,
      statusCode: 409,
      message: "Conflito de dados",
      error: message || "Conflito de dados",
      details,
      timestamp: new Date().toISOString()
    };
  }

  static unprocessableEntity(message: string, details?: any) {
    return {
      success: false,
      statusCode: 422,
      message: "Dados inválidos para processamento",
      error: message || "Dados inválidos para processamento",
      details,
      timestamp: new Date().toISOString()
    };
  }

  static tooManyRequests(message: string = "Limite de requisições excedido") {
    return {
      success: false,
      statusCode: 429,
      message: message || "Limite de requisições excedido",
      error: "Too Many Requests",
      timestamp: new Date().toISOString()
    };
  }

  static internalServerError(message: string = "Erro interno do servidor", details?: any) {
    return {
      success: false,
      statusCode: 500,
      message: message || "Erro interno do servidor",
      error: "Internal Server Error",
      details,
      timestamp: new Date().toISOString()
    };
  }

  static serviceUnavailable(message: string = "Serviço temporariamente indisponível") {
    return {
      success: false,
      statusCode: 503,
      message: message || "Serviço temporariamente indisponível",
      error: "Service Unavailable",
      timestamp: new Date().toISOString()
    };
  }

  // Helper para erros de integração externa
  static externalServiceError(service: string, statusCode: number, message: string, details?: any) {
    return {
      success: false,
      statusCode,
      message: `Erro na comunicação com ${service}`,
      error: message || `Erro na comunicação com ${service}`,
      details,
      timestamp: new Date().toISOString()
    };
  }
} 