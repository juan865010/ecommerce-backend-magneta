import { Express } from 'express';
import  { IRoles, IUser, UserModel } from './schemas/User';
import {
	StatusCodes,
} from 'http-status-codes';
import App from '../app';
import { Model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateDataRegisterLogin } from '../middleware/verifySingup';

export class LoginController {
    private route: string;
    private app: App;
    private express: Express;
    private user: Model<IUser>;

    constructor(app: App, route: string) {
        this.route = route;
        console.log('route', this.route);
        this.app = app;
        this.express = this.app.getAppServer();
        this.user = UserModel(this.app.getClientMongoose());
        this.initRoutes();
        
    }
    private initRoutes(): void {
               
        this.express.post(this.route,validateDataRegisterLogin, async (req, res) => {            
            const { email, password } = req.body;
            const findUser = await this.user.findOne({email})
            if (!findUser) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Credenciales inválidas' });
            }
            const passwordMatch = await bcrypt.compare(password, findUser.password);

            if (!passwordMatch) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Credenciales inválidas' });
              }

            const token = jwt.sign({UserId:findUser._id, role:findUser.roles[0].name},'secretKey', { expiresIn: '2h' })
            
            req.headers.authorization = `Bearer ${token}`

            res.status(StatusCodes.OK).json({token});
            
        });
    }
}