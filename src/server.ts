import 'dotenv/config';
import App from '@/app';
import Routes from '@/routes';
import validateEnv from '@/utils/validateEnv';

validateEnv();

const app = new App(Routes);

app.listen();
