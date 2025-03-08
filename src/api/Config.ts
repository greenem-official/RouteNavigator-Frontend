export class Config {
    private static readonly BACKEND_HOST = import.meta.env.VUE_APP_BACKEND_HOST;
    private static readonly BACKEND_PORT = import.meta.env.VUE_APP_BACKEND_PORT;

    public static readonly BACKEND_URL = Config.BACKEND_HOST && Config.BACKEND_PORT
        ? `http://${Config.BACKEND_HOST}:${Config.BACKEND_PORT}/api`
        : "http://127.0.0.1:8080";
}