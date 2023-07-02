import { Express } from 'express';
import  { IRoles, IUser, UserModel } from '../routes/schemas/User';
import {
	StatusCodes,
} from 'http-status-codes';
import App from '../app';
import { Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { checkDuplicateUsernameOrEmail, validateDataRegisterLogin } from '../middleware/verifySingup';

export class RegisterController {
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
        
        this.express.post(this.route,checkDuplicateUsernameOrEmail,validateDataRegisterLogin, async (req, res) => {            
            const roles: any = {name: 'user', description: 'user', permissions: ['user']};
            const rolesList = [];
            rolesList.push(roles);
            
            const { email, password, username } = req.body
            const findUser = await this.user.findOne({email})

            if (findUser) {
              return res.status(400).json({ message: 'user already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const requestObject = {...req.body, roles: rolesList, password:hashedPassword};
            const newUser = new this.user(requestObject);
            const result = await newUser.save();
            if (result) {
                res.status(StatusCodes.CREATED).json(result);
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({}); 
        });
    }
}