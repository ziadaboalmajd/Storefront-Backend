import  pool  from '../database';
import { QueryResult } from 'pg';

export type Order = {
    orderId?: number;
    status: string;
    userId: number;
};

export class orderStore {
    async index(): Promise<Order> {
        try {
            const response: QueryResult = await
                pool.query('SELECT * FROM order_products ORDER BY id ASC');
            const orders = response.rows[0];
            return orders
        } catch (err) {
            throw new Error(`unable to ge products: ${err}`);
        }
    };
    async show(id: string): Promise<Order> {
        try {
            const response: QueryResult = await pool.query('SELECT * FROM order_products WHERE id = $1', [id]);
            const order = response.rows[0];
            return order;
        } catch (err) {
            throw new Error(`unable to ge products: ${err}`);
        }
    };
    async create(order: Order): Promise<Order> {
        try {
            const response: QueryResult = await pool.query('INSERT INTO orders ( status, user_id) VALUES ($1, $2)', [order.status, order.userId]);
            const reuslt: QueryResult = await pool.query(`SELECT user_id, status FROM orders WHERE user_id = $1;`, [order.userId]);
            const orders = reuslt.rows[0];
            return orders
        } catch (err) {
            throw new Error(`unable to ge products : ${err}`);
        }
    };
    async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
        try {
            const response: QueryResult = await pool.query('INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2 ,$3 )', [ quantity, orderId, productId]);
            const reuslt: QueryResult = await pool.query(`SELECT * FROM order_products`);
            const order: any = reuslt.rows;
            return order
        } catch (err) {
            throw new Error(`unable to ge products: ${err}`);
        }
    };
}

