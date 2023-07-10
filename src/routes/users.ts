import { Express } from 'express';
import  { IRoles, IUser, UserModel } from '../routes/schemas/User';
import {
	StatusCodes,
} from 'http-status-codes';
import App from '../app';
import { Model, Schema } from 'mongoose';
export class UserController {
    private route: string;
    private app: App;
    private express: Express;
    private user: Model<IUser>;
    constructor(app: App, route: string) {
        this.route = route;
        console.log('route', this.route);
        this.app = app;
        this.express = this.app.getAppServer();
        // this.user is a Model object
        this.user = UserModel(this.app.getClientMongoose());

        this.initRoutes();
        
    }
    private initRoutes(): void {
        
        this.express.get(this.route, async(req, res) => {
            const list =  await this.user.find();
            res.status(StatusCodes.ACCEPTED).json({list});
        });
        
        this.express.post(this.route, async (req, res) => {            
            const roles: any = {name: 'user', description: 'user', permissions: ['user']};
            const rolesList = [];
            rolesList.push(roles);
            const requestObject = {...req.body, roles: rolesList};
            console.log('requestObject', requestObject);
            const newUser = new this.user(requestObject);
            const result = await newUser.save();
            if (result) {
                res.status(StatusCodes.CREATED).json(result);
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
            
        });
        
        this.express.put(`${this.route}/:id`, async(req, res) => {
            const { email } = req.body;
            const { id } = req.params;
            const result = await this.user.findOneAndUpdate({_id: id}, {email: email});
            res.status(StatusCodes.OK).json({msg: result});
        });

        this.express.delete(`${this.route}/:id`, async(req, res) => {
            const { id } = req.params;
            const result = await this.user.findOneAndDelete({_id: id});
            res.status(StatusCodes.OK).json({msg: result});
        });
    }
}