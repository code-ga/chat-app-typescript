import jwt from 'jsonwebtoken'

export const verifyUserToken = (tokenUser: string) => {
	const authHeader = tokenUser
	const token = authHeader && authHeader.split(' ')[1]
	if (!token) {
		return false
	}
	try {
		const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
	} catch (error) {
		console.log(error)
		return false
	}
}
