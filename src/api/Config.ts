export class Config {
    public static readonly PROD_MODE = import.meta.env.VITE_PROD_MODE; // to use a local server by default

    public static readonly BACKEND_URL = (Config.PROD_MODE === "true" )
        ? '/api'
        : "http://127.0.0.1:8080";
}
