import Elysia from 'elysia';
import { ERROR_MSG } from 'lib/constant';
import { jwtAccessSetup } from 'configs/jwt.config';
import { checkUserExists } from '@/commands/auth';

// Admin middleware
export const adminMiddleware = (app: Elysia) =>
	app.use(jwtAccessSetup).derive(async ({ jwtAccess, headers, error }) => {
		// check if request has authorization header
		const authorization = headers['authorization'];
		if (!authorization || !authorization.startsWith('Bearer')) {
			return error('Unauthorized', { message: ERROR_MSG.UNAUTHORIZED });
		}

		// get token from header
		const token = authorization.split(' ')[1];
		if (!token) {
			return error('Unauthorized', { message: ERROR_MSG.UNAUTHORIZED });
		}

		// check if token is valid
		const jwtPayload = await jwtAccess.verify(token);
		if (!jwtPayload) {
			return error('Forbidden', { message: ERROR_MSG.TOKEN_INVALID });
		}

		// get user data from database by user id in token
		const userId = jwtPayload.sub;
		const user = await checkUserExists(userId!);
		if (!user.data) {
			return error('Forbidden', { message: ERROR_MSG.FORBIDDEN });
		}

		// check role admin
		if (user.data.user.role !== 'ADMIN') {
			return error('Forbidden', { message: ERROR_MSG.FORBIDDEN });
		}

		return {
			user: { ...user.data.user },
		};
	});
