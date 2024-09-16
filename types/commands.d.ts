import { StatusMap } from "elysia";

interface BasicCommandRes<T> {
	statusCode: number | keyof StatusMap;
	message: string;
	data: T | null;
}

type CommandRes<T> = Promise<BasicCommandRes<T>>;