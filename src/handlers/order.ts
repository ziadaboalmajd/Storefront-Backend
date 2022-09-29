import express, { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Order, orderStore } from '../models/order';

const orderRoutes = (app: express.Application) => {
    app.get('/orders/', index);
    app.get('/orders/:id', show);
    app.post('/orders/', create);
    app.post('/orders/:id/products', addProduct);
}

const store = new orderStore();

const index = async (req: Request, res: Response) => {
    try {
        const orders = await store.index();
        res.json(orders);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const order = await store.show(req.params.id);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const order: Order = {
        userId: req.body.userId,
        status: "active"
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
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const addProduct = async (req: Request, res: Response) => {
    const quantity: number = parseInt(req.body.quantity);
    const orderId: string = req.params.id;
    const productId: string = req.body.productId;
    const addedProduct = await store.addProduct(quantity, orderId, productId);
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
        res.json(addedProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

export default orderRoutes;
