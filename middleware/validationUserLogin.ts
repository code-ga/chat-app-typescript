import {Response, Request, NextFunction} from 'express'
export const validationUserLogin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.body
	if (!user.email) {
		return res
			.status(400)
			.json({success: false, message: 'missing email or password'})
	}
	if (!user.password) {
		return res
			.status(400)
			.json({success: false, message: 'missing email or password'})
    }
    const userData = { email: user.email, password: user.password }
    res.locals.userData = userData
    next()
}
