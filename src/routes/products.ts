import { Express } from 'express';
import  { IProducts, ProductsModel } from '../routes/schemas/Products';
import {
	StatusCodes,
} from 'http-status-codes';
import App from '../app';
import { Model, Schema } from 'mongoose';
import { VerifyRol } from '../middleware/verifyRol';
export class ProductsController {
    private route: string;
    private app: App;
    private express: Express;
    private product: Model<IProducts>;

    
    constructor(app: App, route: string) {
        this.route = route;
        console.log('route', this.route);
        this.app = app;
        this.express = this.app.getAppServer();
        // this.user is a Model object
        this.product = ProductsModel(this.app.getClientMongoose());

        this.initRoutes();
        
    }
    private initRoutes(): void {
        this.express.get(this.route,VerifyRol(['user']), async(req:any, res:any) => {
            const list =  await this.product.find();
            res.status(StatusCodes.ACCEPTED).json({list});
        });

        this.express.get(`${this.route}/:id`,VerifyRol(['user']),async(req, res)=>{
            const { id } = req.params;
            const result = await this.product.findById(id)
            if(!result){
                res.status(StatusCodes.NOT_FOUND).json({msg: 'user not found'});    
            }
            res.status(StatusCodes.OK).json({result});

        })
        
        this.express.post(this.route, VerifyRol(['admin']), async (req, res) => {            
            const requestObject = req.body
            
            const newProduct = new this.product(requestObject);
            const result = await newProduct.save();
            if (result) {
                res.status(StatusCodes.ACCEPTED).json(result);
                return;
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
            
        });
        
        this.express.put(`${this.route}/:id`,VerifyRol(['admin']),  async(req, res) => {
            const { id } = req.params;
            const requestObject = req.body
          
            const findProduct = await this.product.findById(id)
            if(!findProduct){
              res.status(StatusCodes.BAD_REQUEST).send({message:'producto no encontrado'});
              return;
            }
            const result = await this.product.findByIdAndUpdate(id,requestObject,{new:true});
            res.status(StatusCodes.OK).json({result});
        });

        this.express.delete(`${this.route}/:id`,VerifyRol(['admin']), async(req, res) => {
            const { id } = req.params;
            const result = await this.product.findByIdAndDelete(id);
            res.status(StatusCodes.OK).send({message:'eliminado correctamente'});
        });
    }
}