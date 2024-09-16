import { SUCCESS_MSG } from 'lib/constant';
import prisma from 'lib/prisma';
import { CommandRes } from 'types/commands';

export async function updateRefreshToken(
	userId: string,
	refreshToken: string
): CommandRes<{ user: userRes }> {
	// update the refresh token in database by user id
	const updatedAccount = await prisma.account.update({
		where: {
			user_id: userId,
		},
		data: {
			refresh_token: refreshToken,
		},
		select: {
			user: {
				select: {
					id: true,
					avatar: true,
					full_name: true,
					phone_number: true,
					role: true,
				},
			},
		},
	});

	return {
		statusCode: 'OK',
		message: SUCCESS_MSG.SUCCESSFUL,
		data: {
			user: {
				...updatedAccount.user,
			},
		},
	};
}

export async function removeRefreshToken(userId: string): CommandRes<null> {
	// remove the refresh token in database by user id
	await prisma.account.update({
		where: {
			id: userId,
		},
		data: {
			refresh_token: null,
		},
	});

	return {
		statusCode: 'OK',
		message: SUCCESS_MSG.SUCCESSFUL,
		data: null,
	};
}
