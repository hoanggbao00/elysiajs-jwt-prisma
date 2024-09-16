import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';

const SECRET = {
	ACCESS_TOKEN: Bun.env.JWT_ACCESS_SECRET as string,
	REFRESH_TOKEN: Bun.env.JWT_REFRESH_SECRET as string,
};

const EXPIRATION = {
	ACCESS_TOKEN: '5m',
	REFRESH_TOKEN: '7d',
};

export const jwtAccessSetup = new Elysia({
	name: 'jwtAccess',
}).use(
	jwt({
		name: 'jwtAccess',
		secret: SECRET.ACCESS_TOKEN,
		exp: EXPIRATION.ACCESS_TOKEN,
	})
);

export const jwtRefreshSetup = new Elysia({
	name: 'jwtRefresh',
}).use(
	jwt({
		name: 'jwtRefresh',
		secret: SECRET.REFRESH_TOKEN,
		exp: EXPIRATION.REFRESH_TOKEN,
	})
);
