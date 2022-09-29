import express, { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Product, productStore } from '../models/products';

const productRoutes = (app: express.Application) => {
    app.get('/products/', index);
    app.get('/products/:id', show);
    app.post('/products/', create);
}

const store = new productStore();

const index = async (req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.json(products);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const products = await store.show(req.params.id);
        res.json(products);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const product: Product = {
        name: req.body.name,
        price: req.body.price
    };
    try {
        const authorizationHeader: string = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
    } catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
    try {
        const newOrder = await store.create(product);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};


export default productRoutes;