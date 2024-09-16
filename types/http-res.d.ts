import { error, StatusMap } from 'elysia';

interface BasicHttpError {
	response: { readonly message: string };
	_type: { [typeof StatusMap]: { readonly message: string } };
	error: Error;
	[ELYSIA_RESPONSE]: keyof StatusMap;
}

interface BasicHttpRes<T> {
	message: string;
	data: T | null;
}

type HttpRes<T> = Promise<BasicHttpError | BasicHttpRes<T>>;
