import Elysia from 'elysia';
import { register } from './register';
import { login } from './login';
import { logOut } from './logout';
import { refresh } from './refresh';

const auth = new Elysia({
	prefix: '/auth',
})
	.use(register)
	.use(login)
	.use(logOut)
	.use(refresh);

export default auth;
