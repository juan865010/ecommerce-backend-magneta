// import { ROLES } from "../models/Role"

import { Request, Response, NextFunction } from 'express';
import { UserModel } from "../routes/schemas/User";
import mongoose from 'mongoose';

export const checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction) => {
  const User = UserModel(mongoose); 

  const email = await User.findOne({ email: req.body.email });

  if (email) {
    res.status(400).json({ message: 'The email already exists' });
    return;
    }

  next();
};


export const validateDataRegisterLogin = async (req: Request, res: Response, next: NextFunction) => {
  
  const { username, email, password } = req.body
  
  const fields = ['username', 'email', 'password' ];

    const addsFields = Object.keys(req.body).filter(
      (key) => !fields.includes(key)
    );

    if (addsFields.length > 0) {
      res.status(400).send('todos los campos son requeridos');
      return;
    }

    if (!username || !email || !password ) {
      res.status(400).send('todos los campos son requeridos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).send('ingrese un correo valido');
      return;
    }

  next();
};