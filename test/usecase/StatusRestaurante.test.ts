import AbrirRestaurante from "../../src/application/usecase/AbrirRestaurante";
import FecharRestaurante from "../../src/application/usecase/FecharRestaurante";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { Registry } from "../../src/infra/di/DI";
import { ConfigRepositoryDatabase } from "../../src/infra/repository/Config.repository";

let abrirRestaurante: AbrirRestaurante;
let fecharRestaurante: FecharRestaurante;

beforeEach(() => {
	Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
	Registry.getInstance().provide("configRepository", new ConfigRepositoryDatabase());
	abrirRestaurante = new AbrirRestaurante();
    fecharRestaurante = new FecharRestaurante();
});

test.only("Deve abrir o restaurante", async function () {
	const outputAbrirRestaurante = await abrirRestaurante.execute();
	console.log(outputAbrirRestaurante);
	expect(outputAbrirRestaurante).toBe(true);
});

test.only("Deve fechar o restaurante", async function () {
	const outputFecharRestaurante = await fecharRestaurante.execute();
	console.log(outputFecharRestaurante);
	expect(outputFecharRestaurante).toBe(false);
});