import { LogSanitizer } from './LogSanitizer';

interface LogContext {
	[key: string]: any;
	traceId?: string;
	userId?: string;
	action?: string;
	resource?: string;
	ip?: string;
	userAgent?: string;
}

interface LogEntry {
	timestamp: string;
	level: string;
	message: string;
	context?: LogContext;
	error?: {
		name: string;
		message: string;
		stack?: string;
		code?: string;
	};
}

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export default class Logger {
	private static instance: Logger;
	private level: LogLevel = "info";
	private levels: LogLevel[] = ["trace", "debug", "info", "warn", "error", "fatal"];
	private context: LogContext = {};

	private constructor() {}

	private shouldLog(level: LogLevel): boolean {
		const currentLevelIndex = this.levels.indexOf(this.level);
		const messageLevel = this.levels.indexOf(level);
		return messageLevel >= currentLevelIndex;
	}

	private formatLog(entry: LogEntry): string {
		const baseLog: any = {
			timestamp: entry.timestamp,
			level: entry.level.toUpperCase(),
			message: entry.message,
			...this.context,
			...entry.context
		};

		if (entry.error) {
			baseLog.error = entry.error;
		}

		const sanitizedLog = LogSanitizer.sanitize(baseLog);
		return JSON.stringify(sanitizedLog);
	}

	private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
		if (!this.shouldLog(level)) return;

		const entry: LogEntry = {
			timestamp: new Date().toISOString(),
			level,
			message,
			context
		};

		if (error) {
			entry.error = {
				name: error.name,
				message: error.message,
				stack: error.stack,
				code: (error as any).code
			};
		}

		const logMessage = this.formatLog(entry);

		switch (level) {
			case "trace":
			case "debug":
				console.log(logMessage);
				break;
			case "info":
				console.info(logMessage);
				break;
			case "warn":
				console.warn(logMessage);
				break;
			case "error":
			case "fatal":
				console.error(logMessage);
				break;
		}
	}

	trace(message: string, context?: LogContext): void {
		this.log("trace", message, context);
	}

	debug(message: string, context?: LogContext): void {
		this.log("debug", message, context);
	}

	info(message: string, context?: LogContext): void {
		this.log("info", message, context);
	}

	warn(message: string, context?: LogContext, error?: Error): void {
		this.log("warn", message, context, error);
	}

	error(message: string, context?: LogContext, error?: Error): void {
		this.log("error", message, context, error);
	}

	fatal(message: string, context?: LogContext, error?: Error): void {
		this.log("fatal", message, context, error);
	}

	audit(action: string, resource: string, context?: LogContext): void {
		this.info(`AUDIT: ${action}`, {
			...context,
			action,
			resource,
			audit: true
		});
	}

	setLevel(level: LogLevel): void {
		this.level = level;
	}

	setContext(context: LogContext): void {
		this.context = { ...this.context, ...context };
	}

	clearContext(): void {
		this.context = {};
	}

	childLogger(context: LogContext): Logger {
		const childLogger = Object.create(this);
		childLogger.context = { ...this.context, ...context };
		return childLogger;
	}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}
}