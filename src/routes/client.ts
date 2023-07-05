import { Express } from 'express';
import  { IClient, ClientModel } from './schemas/Client';
import {
	StatusCodes,
} from 'http-status-codes';
import App from '../app';
import { Model, Schema } from 'mongoose';
export class ClientController {
    private route: string;
    private app: App;
    private express: Express;
    private client: Model<IClient>;
    constructor(app: App, route: string) {
        this.route = route;
        console.log('route', this.route);
        this.app = app;
        this.express = this.app.getAppServer();
        // this.user is a Model object
        this.client = ClientModel(this.app.getClientMongoose());

        this.initRoutes();
        
    }
    private initRoutes(): void {
        
        this.express.get(this.route, async(req, res) => {
            const list =  await this.client.find();
            res.status(StatusCodes.ACCEPTED).json({list});
        });
        
        this.express.post(this.route, async (req, res) => {            
            
            const requestObject = req.body
            const client = this.client.findOne(req.body.email)
            const newUser = new this.client(requestObject);
            console.log(newUser)
            const result = await newUser.save();
            if (result) {
                res.status(StatusCodes.CREATED).json(result);
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
            
        });

        this.express.get(`${this.route}/:id`, async(req, res) => {
            
            const { id } = req.params;
            const findClient = await this.client.findById(id)
            if(!findClient){
                res.status(404).send({message:'no se encontro cliente'})
            }
            
            const list =  await this.client.findById(id);
            res.status(StatusCodes.ACCEPTED).json({list});
        });
        
        this.express.put(`${this.route}/:id`, async(req, res) => {
            const { id } = req.params;
            const findClient = await this.client.findById(id)
            if(!findClient){
                res.status(404).send({message:'no se encontro cliente'})
            }

            const result = await this.client.findByIdAndUpdate(id,req.body,{new:true});
            res.status(200).json({msg: result});
        });

        this.express.delete(`${this.route}/:id`, async(req, res) => {
            const { id } = req.params;
            const findClient = await this.client.findById(id)
            if(!findClient){
                res.status(404).send({message:'no se encontro cliente'})
            }
            const result = await this.client.findByIdAndDelete(id);
            res.status(204).json({msg: 'eliminado correctamente'});
        });
    }
}