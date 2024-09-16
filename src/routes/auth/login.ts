import Elysia from 'elysia';
import { jwtAccessSetup, jwtRefreshSetup } from '@config/jwt.config';
import { loginCommand, updateRefreshToken } from '@/commands/auth';
import { authModel } from '@/models/auth.model';
import { HttpRes } from 'types/http-res';

type ReturnType = {
	user: userRes | null;
	accessToken: string;
	refreshToken: string;
};

export const login = new Elysia()
	.use(authModel)
	.use(jwtAccessSetup)
	.use(jwtRefreshSetup)
	.post(
		'/login',
		async ({
			body,
			set,
			jwtAccess,
			jwtRefresh,
			error,
		}): HttpRes<ReturnType> => {
			// check if account exists
			const accountCommand = await loginCommand(body);
			if (!accountCommand.data) {
				return error(accountCommand.statusCode, {
					message: accountCommand.message,
				});
			}

			// create new access token
			const accessJWTToken = await jwtAccess.sign({
				sub: accountCommand.data.user_id,
				iat: Date.now(),
			});

			// create new fresh token
			const refreshJWTToken = await jwtRefresh.sign({
				sub: accountCommand.data.user_id,
				iat: Date.now(),
			});

			// update refresh token to database by user id
			const updatedAccount = await updateRefreshToken(
				accountCommand.data.user_id,
				refreshJWTToken
			);

			set.status = updatedAccount.statusCode;
			return {
				message: updatedAccount.message,
				data: {
					user: { ...updatedAccount.data!.user },
					accessToken: accessJWTToken,
					refreshToken: refreshJWTToken,
				},
			};
		},
		{
			body: 'loginModel',
		}
	);
