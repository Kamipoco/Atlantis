import App from '@/app';
import Routes from '@/routes';

const app = new App(Routes)
const server = app.listen()

export default server