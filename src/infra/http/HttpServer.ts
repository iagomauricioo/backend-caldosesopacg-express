import express from "express";
import cors from "cors";

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

		this.app.use('/api/v1', this.router);
	}

	register(method: string, url: string, callback: Function): void {
		this.router[method](url, async function (req: any, res: any) {
			try {
				const output = await callback(req.params, req.body);
				
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
				// Tratamento de erros centralizado
				const errorResponse = {
					success: false,
					statusCode: 500,
					message: "Erro interno do servidor",
					error: e.message || "Erro desconhecido",
					timestamp: new Date().toISOString()
				};
				
				// Se é erro de validação, usa 422
				if (e.message && e.message.includes('inválido') || e.message.includes('obrigatório')) {
					errorResponse.statusCode = 422;
					errorResponse.message = "Dados inválidos";
				}
				
				// Se é erro de não encontrado, usa 404
				if (e.message && e.message.includes('não encontrado')) {
					errorResponse.statusCode = 404;
					errorResponse.message = "Recurso não encontrado";
				}
				
				return res.status(errorResponse.statusCode).json(errorResponse);
			}
		});
	}

	listen(port: number): void {
		const server = this.app.listen(port, () => {
			console.log(`🚀 Servidor rodando na porta ${port}`);
			console.log(`📡 API disponível em: http://localhost:${port}/api/v1`);
			console.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}`);
		});
		
		return server;
	}
}