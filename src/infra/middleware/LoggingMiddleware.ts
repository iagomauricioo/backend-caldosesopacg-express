import { Request, Response, NextFunction } from 'express';
import UUID from '../../domain/vo/UUID';
import Logger from '../logger/Logger';

declare global {
    namespace Express {
        interface Request {
            traceId?: string;
            logger?: Logger;
        }
    }
}

export class LoggingMiddleware {
    static requestLogger() {
        return (req: Request, res: Response, next: NextFunction) => {
            const traceId = UUID.create().getValue();
            const startTime = Date.now();
            
            req.traceId = traceId;
            
            const logger = Logger.getInstance().childLogger({
                traceId,
                method: req.method,
                path: req.path,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent')
            });
            
            req.logger = logger;
            
            logger.info('Request started', {
                method: req.method,
                url: req.originalUrl,
                query: req.query,
                headers: {
                    'content-type': req.get('content-type'),
                    'authorization': req.get('authorization') ? '[REDACTED]' : undefined
                }
            });
            
            res.on('finish', () => {
                const duration = Date.now() - startTime;
                const statusCode = res.statusCode;
                
                const logLevel = statusCode >= 500 ? 'error' :
                               statusCode >= 400 ? 'warn' : 'info';
                
                logger[logLevel]('Request completed', {
                    statusCode,
                    duration: `${duration}ms`,
                    contentLength: res.get('content-length')
                });
            });
            
            next();
        };
    }
}