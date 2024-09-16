import { checkUserExists, updateRefreshToken } from '@/commands/auth';
import { authModel } from '@/models/auth.model';
import { jwtAccessSetup, jwtRefreshSetup } from '@config/jwt.config';
import Elysia from 'elysia';
import { ERROR_MSG, SUCCESS_MSG } from 'lib/constant';
import { HttpRes } from 'types/http-res';

type RefreshRes = {
	accessToken: string;
	refreshToken: string;
};

export const refresh = new Elysia()
	.use(jwtAccessSetup)
	.use(jwtRefreshSetup)
	.use(authModel)
	.post(
		'/refresh',
		async ({
			jwtAccess,
			jwtRefresh,
			query,
			set,
			error,
		}): HttpRes<RefreshRes> => {
			// check if refresh token is valid
			const jwtPayload = await jwtRefresh.verify(query.id);
			if (!jwtPayload) {
				return error('Forbidden', { message: ERROR_MSG.FORBIDDEN });
			}
			const userId = jwtPayload.sub;

			// check if user id from token is valid
			const userCommand = await checkUserExists(userId!);
			if (!userCommand.data) {
				return error(userCommand.statusCode, { message: ERROR_MSG.FORBIDDEN });
			}

			// create new access token
			const accessJWTToken = await jwtAccess.sign({
				sub: userCommand.data.user.id,
				iat: Date.now(),
			});

			// create new refresh token
			const refreshJWTToken = await jwtRefresh.sign({
				sub: userCommand.data.user.id,
				iat: Date.now(),
			});

			// update refresh token to database
			const updated = await updateRefreshToken(
				userCommand.data.user.id,
				refreshJWTToken
			);

			return {
				message: updated.message,
				data: {
					accessToken: accessJWTToken,
					refreshToken: refreshJWTToken,
				},
			};
		},
		{
			query: 'refreshQuery',
		}
	);
