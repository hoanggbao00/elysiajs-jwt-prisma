import { ERROR_MSG, SUCCESS_MSG } from 'lib/constant';
import prisma from 'lib/prisma';
import { CommandRes } from 'types/commands';

export async function checkUserExists(
	userId: string
): CommandRes<{ user: userRes }> {
	// check if user exists
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			id: true,
			avatar: true,
			full_name: true,
			phone_number: true,
			role: true,
		},
	});

	if (!user) {
		return {
			statusCode: 'Bad Request',
			message: ERROR_MSG.USER_NOT_FOUND,
			data: null,
		};
	}

	return {
		statusCode: 'OK',
		message: SUCCESS_MSG.SUCCESSFUL,
		data: { user: user },
	};
}
