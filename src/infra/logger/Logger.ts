export default class Logger {
	private static instance: Logger;
	private level = "debug";
	private levels = ["trace", "debug", "info", "warn", "error", "fatal"];

	private constructor () {
	}

	debug (message: string, data: any) {
		const levels = this.levels.slice(this.levels.indexOf(this.level));
		if (levels.includes("debug")) {
			console.log("DEBUG [" + new Date().toISOString() + "]", message, data);
		}
	}

	setLevel (level: string) {
		this.level = level;
	}

	static getInstance () {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}
}