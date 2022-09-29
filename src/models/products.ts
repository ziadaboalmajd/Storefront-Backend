import pool from '../database';
import { QueryResult } from 'pg';

export type Product = {
    id?: string;
    name: string;
    price: string;
}; 

export class productStore {
    async index(): Promise<Product> {
        try {
            const response: QueryResult = await
                pool.query('SELECT * FROM products BY id ASC');
            const Products = response.rows[0];
            return Products
        } catch (err) {
            throw new Error(`unable to ge products: ${err}`);
        }
    };
    async show(id: string): Promise<Product> {
        try {
            const response: QueryResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
            const Product = response.rows[0];
            return Product;
        } catch (err) {
            throw new Error(`unable to ge products: ${err}`);
        }
    };
    async create(Product: Product): Promise<Product> {
        try {
            const response: QueryResult = await pool.query('INSERT INTO products (name, price) VALUES ($1, $2)', [Product.name, Product.price]);
            const reuslt: QueryResult = await pool.query(`SELECT name, price FROM products WHERE name = $1;`, [Product.name]);
            const Products = reuslt.rows[0];
            return Products
        } catch (err) {
            throw new Error(`unable to ge products : ${err}`);
        }
    };
}