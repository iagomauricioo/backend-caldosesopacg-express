import { inject } from "../di/DI";
import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "../http/HttpServer";

export default class AccountController {
	@inject("httpServer")
	httpServer?: HttpServer;
	@inject("getAccount")
	getAccount?: GetAccount;

	constructor () {
		this.httpServer?.register("get", "/accounts/:accountId", async (params: any, body: any) => {
			const output = await this.getAccount?.execute(params.accountId);
			return output;
		});
	}
}
