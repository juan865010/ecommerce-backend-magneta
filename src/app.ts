import express, {Express} from 'express';
import { parseEnvNumber, parseEnvString } from './utils';
import { UserController } from './routes/users';
import  mongoose, { Mongoose } from 'mongoose';
import * as dotenv from 'dotenv'
import cors from 'cors'
import productRoutes from './routes/schemas/Products';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

export default class App {
    private appServer:Express;
    private port:number = parseEnvNumber('PORT' || '') ;
    private apiVersion:string = parseEnvString('API_VERSION' || '');
    private apiPrefix:string = parseEnvString('API_PREFIX' || '');
    private databasePort: number = parseEnvNumber('DATABASE_PORT' || ''); 
    private databaseHost: string = parseEnvString('DATABASE_HOST' || '');
    private databaseUser: string = parseEnvString('DATABASE_USER' || '');
    private databasePassword: string = parseEnvString('DATABASE_PASSWORD' || '');
    private databaseName: string = parseEnvString('DATABASE_NAME' || '');
    private databaseClient: Mongoose;
    constructor() {
        this.databaseClient = mongoose;
        this.appServer = express();
        this.setupServer();
    }
    //3.Conexión a MongoDB:
    private setupDatabase():void  {
        const connecitonString = 'mongodb://localhost:27017/seminario';

        console.log('connection', connecitonString);
        this.databaseClient.connect(connecitonString);
                this.databaseClient.connection.on('error', (error) => {
            console.log(error);
        });

        this.databaseClient.connection.once('open', () => {
            console.log('Connected to database');
        });
    }
    
    public getClientMongoose():Mongoose {
        return this.databaseClient;
    }

    private setupServer():void {
        this.appServer.use(cors());
        this.appServer.use(express.json());
        this.appServer.use(express.urlencoded({extended: true}));
        this.setupDatabase();
        this.initRoutes('users');
        this.initRoutes('products');
//      this.appServer.use('/api', productRoutes()); 
    }
    private initRoutes(service: string):void {
        const userController = new UserController(this, `/${this.apiVersion}/${this.apiPrefix}/${service}`);  
    }
    
    public getAppServer():Express {
        return this.appServer;
    }
    public getPort():number {
        return this.port;
    }

    
}





