import {Response, Request, NextFunction} from 'express'
import userModels from '../model/user.models'
import bcrypt from 'bcrypt'

const saltRounds = 10
export const validationUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.body
	if (!user) {
		return res
			.status(400)
			.json({success: false, message: 'route is requite the user data'})
	}
	if (!user.email) {
		return res
			.status(400)
			.json({success: false, message: 'email is requite'})
	}
	if (!user.password) {
		return res
			.status(400)
			.json({success: false, message: 'password is requite'})
	}

	try {
		var userInDB = await userModels.find({email: user.email}).lean()
		if (userInDB.length >= 1) {
			return res
				.status(400)
				.json({success: false, message: 'email already taken'})
		}
		const salt = await bcrypt.genSaltSync(saltRounds)
		const hashPassword: string = await bcrypt.hashSync(user.password, salt)
		const dataSave = {
			email: user.email,
			username: user.email,
			password: hashPassword,
			friend: [],
        }
		const numSlice: number = 3
		var passwordReturnTemp: string[] = [hashPassword.slice(0, numSlice)]
		for (let index = 0; index < hashPassword.length - numSlice; index++) {
			passwordReturnTemp.push('*')
        }
        passwordReturnTemp.push(", password is hash and save in database")
		var DataReturn = {...dataSave, password: passwordReturnTemp.join("")}
		res.locals.dataSave = dataSave
		res.locals.userReturn = DataReturn
		next()
	} catch (error) {
		console.log(error)
		return res
			.status(500)
			.json({success: false, message: 'Internal Server Error'})
	}
}
