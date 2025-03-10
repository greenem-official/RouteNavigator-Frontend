export class Config {
    // private static readonly BACKEND_HOST = import.meta.env.VUE_APP_BACKEND_HOST;
    // private static readonly BACKEND_PORT = import.meta.env.VUE_APP_BACKEND_PORT;

    public static readonly PROD_MODE = import.meta.env.VITE_PROD_MODE;

    public static readonly BACKEND_URL = (Config.PROD_MODE === "true" )
        ? '/api'
        : "http://127.0.0.1:8080";
}
