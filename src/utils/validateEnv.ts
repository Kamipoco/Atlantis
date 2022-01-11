import { cleanEnv, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production', 'testing'],
    }),
    SECRET_KEY: str(),
    DB_USER: str(),
    DB_PASS: str(),
    DB_NAME: str(),
    DB_HOST: str(),
    PROVIDER_URL: str(),
    PINATA_API_KEY: str(),
    PINATA_SECRET_API_KEY: str(),
    DEPLOYER_PRIVATE_KEY: str()
  });
};

export default validateEnv;
