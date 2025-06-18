import * as dotenv from 'dotenv'
dotenv.config({ override: true })
import {Nothing} from "./core/types/Nothing";
import {ApplicationInit} from "./core/classes/impl/app/ApplicationInit";
import {Client} from "./core/classes/impl/app/Client";
import {EnvironNamespace} from "./core/namespaces/EnvironNamespace";
import {ModularORM} from "modular-orm";
import {ClientAPI} from "./core/classes/impl/app/ClientAPI";

export class Main {

    private static instance : Main;
    private static api: ClientAPI

    protected constructor() {}

    public async startApp() : Nothing {
        // Init all classes
        ApplicationInit.init();
        // App starting
        const client : Client = new Client()
        await client.start(EnvironNamespace.BOT_TOKEN)
        Main.api = client.getApi;
        // Connection to database
        const orm : ModularORM = ModularORM.getInstance;
        await orm.start(EnvironNamespace.DATABASE_CONNECTION_DATA);
    }

    public static getInstance() : Main {
        if (!this.instance) this.instance = new Main();
        return this.instance;
    }

    public static getApi() : ClientAPI {
        return Main.api as ClientAPI;
    }

}

new Promise(async () => {
    await Main.getInstance().startApp();
})