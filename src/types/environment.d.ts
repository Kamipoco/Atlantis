declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'testing';
        DB_USER?: string;
        DB_PASS?: string;
        DB_NAME?: string;
        DB_HOST?: string;
        SECRET_KEY: string;
        PROVIDER_URL: string;
        PINATA_API_KEY: string;
        PINATA_SECRET_API_KEY: string;
        DEPLOYER_PRIVATE_KEY: string;
      }
    }
  }
}
