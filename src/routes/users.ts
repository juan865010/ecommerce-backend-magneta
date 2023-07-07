import { Express } from 'express';
import  { IRoles, IUser, UserModel } from '../routes/schemas/User';
import {StatusCodes,} from 'http-status-codes';
import App from '../app';
import { Model, Schema } from 'mongoose';
import Product from './schemas/Products';
export class UserController {
    private route: string;
    private app: App;
    private express: Express;
    private product: typeof Product;
    private user: Model<IUser>;
    constructor(app: App, route: string) {
        this.route = route;
        console.log('route', this.route);
        this.app = app;
        this.express = this.app.getAppServer();
        this.product = Product;
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

        //4.Rutas y controladores de la API REST:
        this.express.get('/products', async (req,res) => {
            try {
              const products = await this.product.find();
              res.status(StatusCodes.OK).json(products);
            } catch (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error al obtener los productos',
              });
            }
          });
      
          // GET /products/:id
          this.express.get('/products/:id', async (req, res) => {
            try {
              const product = await this.product.findById(req.params.id);
              if (product) {
                res.status(StatusCodes.OK).json(product);
              } else {
                res.status(StatusCodes.NOT_FOUND).json({ error: 'Producto no encontrado' });
              }
            } catch (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error al obtener el producto',
              });
            }
          });
      
          // POST /products
          this.express.post('/products', async (req, res) => {
            try {
              const newProduct = new this.product(req.body);
              const savedProduct = await newProduct.save();
              res.status(StatusCodes.CREATED).json(savedProduct);
            } catch (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error al crear el producto',
              });
            }
          });
      
          // PUT /products/:id
          this.express.put('/products/:id', async (req, res) => {
            try {
              const updatedProduct = await this.product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
              );
              if (updatedProduct) {
                res.status(StatusCodes.OK).json(updatedProduct);
              } else {
                res.status(StatusCodes.NOT_FOUND).json({ error: 'Producto no encontrado' });
              }
            } catch (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error al actualizar el producto',
              });
            }
          });
      
          // DELETE /products/:id
          this.express.delete('/products/:id', async (req, res) => {
            try {
              const deletedProduct = await this.product.findByIdAndDelete(req.params.id);
              if (deletedProduct) {
                res.status(StatusCodes.OK).json({ message: 'Producto eliminado correctamente' });
              } else {
                res.status(StatusCodes.NOT_FOUND).json({ error: 'Producto no encontrado' });
              }
            } catch (error) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Error al eliminar el producto',
              });
            }
          });
    }
}