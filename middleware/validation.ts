import {Response, Request, NextFunction} from 'express'
import UserSchema from '../model/user.models'
import jwt from 'jsonwebtoken'
export var verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    var authHeader = req.header('Authorization')
    console.log(authHeader)
    var token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res
            .status(401)
            .json({success: false, message: 'Access token not found'})
    }
    try {
        var decoded = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET as string,
		) as {userId: string; iat:number}
        console.log(decoded)
        if (decoded) {
            var user = await UserSchema.findOne({_id: decoded.userId})
            if (!user) {
                return res
                    .status(400)
                    .json({success: false, message: 'user not found'})
            }
        }
        res.locals.userId = decoded.userId
        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({success: false, message: 'Invalid token'})
    }
}
