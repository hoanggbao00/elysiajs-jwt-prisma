import Elysia, { Static, t } from 'elysia';
import { ERROR_MSG } from 'lib/constant';

// register model
const registerModel = t.Object({
	full_name: t.String({
		maxLength: 60,
		minLength: 1,
		error: ERROR_MSG.NAME_INVALID,
	}),
	password: t.String({ minLength: 6, error: ERROR_MSG.PASSWORD_INVALID }),
	phone_number: t.String({
		minLength: 10,
		maxLength: 10,
		error: ERROR_MSG.PHONE_INVALID,
	}),
});

export type TRegisterModel = Static<typeof registerModel>;

// login model
const loginModel = t.Object({
	phone_number: t.String({ minLength: 5, error: ERROR_MSG.PHONE_INVALID }),
	password: t.String({
		minLength: 6,
		error: ERROR_MSG.PASSWORD_INVALID,
	}),
});

export type TLoginModel = Static<typeof loginModel>;

// refresh query
const refreshQuery = t.Object({
	id: t.String({error: 'Refresh Token Not Provided'}),
});

// export all
export const authModel = new Elysia().model({
	registerModel: registerModel,
	loginModel: loginModel,
	refreshQuery: refreshQuery,
});
