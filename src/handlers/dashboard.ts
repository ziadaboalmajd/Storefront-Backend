import express, { Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { DashboardQueries } from '../services/dashboard'

const dashboardRoutes = (app: express.Application) => {
  app.get('/five-most-expensive', fiveMostExpensive)
  app.get('/products-in-orders', productsInOrders)
  app.get('/users-with-orders', usersWithOrders)
}

const dashboard = new DashboardQueries()

const fiveMostExpensive = async (_req: Request, res: Response) => {
  try {
    const users = await dashboard.fiveMostExpensive()
    res.json(users)
  } catch (err) {
    res.status(400);
    res.json(err);
  }
}

const usersWithOrders = async (req: Request, res: Response) => {
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
    const users = await dashboard.usersWithOrders()
    res.json(users)
  } catch (err) {
    res.status(400);
    res.json(err);
  }
}

const productsInOrders = async (_req: Request, res: Response) => {
  try {
    const products = await dashboard.productsInOrders()
    res.json(products)
  } catch (err) {
    res.status(400);
    res.json(err);
  }
}

export default dashboardRoutes