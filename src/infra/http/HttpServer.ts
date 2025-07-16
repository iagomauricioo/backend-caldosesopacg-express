import express from "express";
import cors from "cors";
import { LoggingMiddleware } from "../middleware/LoggingMiddleware";
import Logger from "../logger/Logger";
import { ConflictError, ValidationError, NotFoundError } from "./ApiError";

export default interface HttpServer {
	register (method: string, url: string, callback: Function): void;
	listen (port: number): void;
}

export class ExpressAdapter implements HttpServer {
	app: any;
	router: any;

	constructor () {
		this.app = express();
		this.router = express.Router();
		this.app.use(express.json());
		this.app.use(cors());
		this.app.use(LoggingMiddleware.requestLogger());

		this.app.use('/api/v1', this.router);
	}

	register(method: string, url: string, callback: Function): void {
		this.router[method](url, async function (req: any, res: any) {
			try {
				const output = await callback(req.params, req.body, req);
				
				// Se o output já tem statusCode, usa ele
				if (output && output.statusCode) {
					return res.status(output.statusCode).json(output);
				}
				
				// Se tem success: false, trata como erro
				if (output && output.success === false) {
					return res.status(output.statusCode || 400).json(output);
				}
				
				// Sucesso padrão
				return res.status(200).json(output);
				
			} catch (e: any) {
				const logger = req.logger || Logger.getInstance();
				
				// Tratamento de erros centralizado
				const errorResponse = {
					success: false,
					statusCode: 500,
					message: "Erro interno do servidor",
					error: e.message || "Erro desconhecido",
					timestamp: new Date().toISOString()
				};
				
				// Tratar erros específicos
				if (e instanceof ConflictError) {
					errorResponse.statusCode = 409;
					errorResponse.message = "Conflito de dados";
					errorResponse.error = e.message;
				} else if (e instanceof ValidationError) {
					errorResponse.statusCode = 400;
					errorResponse.message = "Dados inválidos";
					errorResponse.error = e.message;
				} else if (e instanceof NotFoundError) {
					errorResponse.statusCode = 404;
					errorResponse.message = "Recurso não encontrado";
					errorResponse.error = e.message;
				} else if (e.code === '23505') { // PostgreSQL unique constraint violation
					errorResponse.statusCode = 409;
					errorResponse.message = "Conflito de dados";
					if (e.constraint === 'clientes_cpf_key') {
						errorResponse.error = "CPF já cadastrado no sistema";
					} else if (e.constraint === 'clientes_telefone_key') {
						errorResponse.error = "Telefone já cadastrado no sistema";
					} else {
						errorResponse.error = "Dados já cadastrados no sistema";
					}
				} else if (e.message && (e.message.includes('inválido') || e.message.includes('obrigatório'))) {
					errorResponse.statusCode = 422;
					errorResponse.message = "Dados inválidos";
					errorResponse.error = e.message;
				} else if (e.message && e.message.includes('não encontrado')) {
					errorResponse.statusCode = 404;
					errorResponse.message = "Recurso não encontrado";
					errorResponse.error = e.message;
				}
				
				logger.error("Request failed", {
					statusCode: errorResponse.statusCode,
					errorMessage: e.message,
					path: req.path,
					method: req.method
				}, e);
				
				return res.status(errorResponse.statusCode).json(errorResponse);
			}
		});
	}

	listen(port: number): void {
		const server = this.app.listen(port, () => {
			const logger = Logger.getInstance();
			logger.info("Server started", {
				port,
				apiUrl: `http://localhost:${port}/api/v1`,
				environment: process.env.NODE_ENV || 'development',
				timestamp: new Date().toISOString()
			});
		});
		
		return server;
	}
}