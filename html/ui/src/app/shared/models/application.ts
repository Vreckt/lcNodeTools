export class Application {
    private name: string;
    private path: string;
    private port: number;
    private startableFile: string;
    private description: string;
    private status: boolean;

    constructor() {}

    static createByJSON(name: string, path: string, port: number, main: string, description: string): Application {
        const app = new Application();
        app.name = name;
        app.path = path;
        app.port = port;
        app.startableFile = main;
        app.description = description;
        app.status = false;
        return app;
    }
}
