import Elysia from 'elysia';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { removeRefreshToken } from '@/commands/auth';
import { ERROR_MSG } from 'lib/constant';
import { HttpRes } from 'types/http-res';

export const logOut = new Elysia()
	.use(authMiddleware)
	.post('/logout', async ({ user, set, error }): HttpRes<string> => {
		if (!user) {
			return error('Unauthorized', { message: ERROR_MSG.UNAUTHORIZED });
		}

		const tokenCommand = await removeRefreshToken(user.id);

		set.status = tokenCommand.statusCode;
		return {
			message: tokenCommand.message,
			data: null,
		};
	});
