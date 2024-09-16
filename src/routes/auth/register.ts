import { Elysia } from 'elysia';
import { registerCommand } from '@/commands/auth';
import { authModel } from '@/models/auth.model';
import { HttpRes } from 'types/http-res';

type RegisterRes = {
	id: string;
};

export const register = new Elysia().use(authModel).post(
	'/register',
	async ({ body, set, error }): HttpRes<RegisterRes> => {
		const accountCommand = await registerCommand(body);

		if (!accountCommand.data) {
			return error(accountCommand.statusCode, {
				message: accountCommand.message,
			});
		}

		set.status = accountCommand.statusCode;
		return {
			message: accountCommand.message,
			data: {
				id: accountCommand.data.id,
			},
		};
	},
	{
		body: 'registerModel',
	}
);
