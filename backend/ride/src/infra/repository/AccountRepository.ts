import Account from "../../domain/entity/Account";
import { inject } from "../di/DI";
import DatabaseConnection from "../database/DatabaseConnection";

// Port
export default interface AccountRepository {
	getAccountByEmail (email: string): Promise<Account | undefined>;
	getAccountById (accountId: string): Promise<Account>;
	saveAccount (account: Account): Promise<void>;
}

// Adapter
export class AccountRepositoryDatabase implements AccountRepository {
	@inject("databaseConnection")
	connection?: DatabaseConnection;

	async getAccountByEmail (email: string) {
		const [accountData] = await this.connection?.query("select * from ccca.account where email = $1", [email]);
		if (!accountData) return;
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf);
	}
	
	async saveAccount (account: Account) {
		await this.connection?.query("insert into ccca.account (account_id, name, email, cpf) values ($1, $2, $3, $4)", [account.getAccountId(), account.getName(), account.getEmail(), account.getCpf()]);
	}
	
	async getAccountById (accountId: string) {
		const [accountData] = await this.connection?.query("select * from ccca.account where account_id = $1", [accountId]);
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf);
	}
}

// Adapter
export class AccountRepositoryMemory implements AccountRepository {
	accounts: any[];

	constructor () {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<any> {
		return this.accounts.find((account: any) => account.email === email);
	}

	async getAccountById(accountId: string): Promise<any> {
		return this.accounts.find((account: any) => account.getAccountId() === accountId);
	}

	async saveAccount(account: any): Promise<any> {
		return this.accounts.push(account);
	}

}
