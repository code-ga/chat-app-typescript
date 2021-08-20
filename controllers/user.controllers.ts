import UserSchema from '../model/user.models'
import {Response, Request} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const checkUserLogin = async (req: Request, res: Response) => {
	console.log('checkUserLogin')
	try {
		var user = await UserSchema.findById(res.locals.userId).select([
			'-password',
		])
		if (!user)
			return res
				.status(400)
				.json({success: false, message: 'user not found'})
		res.json({success: true, user})
	} catch (error) {
		console.log(error)
		return res
			.status(500)
			.json({success: false, message: 'Internal Server Error'})
	}
}

export const registerUser = async (req: Request, res: Response) => {
	try {
		// create user
		const newUser = await new UserSchema(res.locals.dataSave)
		await newUser.save()
		const accessToken = jwt.sign(
			{userId: newUser._id},
			process.env.ACCESS_TOKEN_SECRET as string,
		)
		return res.json({
			success: true,
			message: 'user create success full',
			accessToken,
			user: res.locals.userReturn,
		})
	} catch (error) {
		console.log(error)
		return res
			.status(500)
			.json({success: false, message: 'Internal Server Error'})
	}
}

export const LoginUser = async (req: Request, res: Response) => {
	try {
		var user = res.locals.userData
		const userDatabase = await UserSchema.findOne({
			email: user.email,
		})
			.populate('friend')
			.lean()
		if (!userDatabase) {
			return res.status(400).json({
				success: false,
				message: 'incorrect username or email or password',
			})
		}
		var passwordVerify = await bcrypt.compare(
			user.password,
			userDatabase.password,
		)
		if (!passwordVerify) {
			return res.status(400).json({
				success: false,
				message: 'incorrect username or email or password',
			})
		}
		var accessToken = jwt.sign(
			{userId: userDatabase._id},
			process.env.ACCESS_TOKEN_SECRET as string,
		)
		const numSlice: number = 3
		var passwordReturnTemp: string[] = [
			userDatabase.password.slice(0, numSlice),
		]
		for (
			let index = 0;
			index < userDatabase.password.length - numSlice;
			index++
		) {
			passwordReturnTemp.push('*')
		}
		passwordReturnTemp.push(', password is hash and save in database')
		return res.status(200).json({
			success: true,
			accessToken,
			message: 'user login successfully',
			userInfo: {
				email: userDatabase.email,
				username: userDatabase.username,
				password: passwordReturnTemp.join(''),
				friend: userDatabase.friend,
			},
		})
	} catch (error) {
		console.log(error)
		return res
			.status(500)
			.json({success: false, message: 'Internal Server Error'})
	}
}
