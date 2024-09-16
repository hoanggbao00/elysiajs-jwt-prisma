import { Elysia } from 'elysia';
import auth from './routes/auth';
import me from './routes/me';

const port = Bun.env.PORT || 8080;

const app = new Elysia().use(auth).use(me);

app.listen(port, () => {
	console.log(`🦊 Elysia is running at ${app.server?.hostname}:${port}`);
});
