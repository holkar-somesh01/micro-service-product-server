import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: string;
}

export const userProtected = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {

    const user: any = req.headers.authorization
    console.log(user, "USER TOKEN")

    jwt.verify(user, process.env.JWT_KEY as string, async (error: VerifyErrors | null, decoded: any) => {
        if (error) {
            let errorMessage = 'Invalid Token';
            if (error.name === 'TokenExpiredError') {
                errorMessage = 'Token has expired. Please login again.';
            }
            return res.status(401).json({ message: errorMessage });
        }
        req.user = decoded.userId;
        next();
    });
};
