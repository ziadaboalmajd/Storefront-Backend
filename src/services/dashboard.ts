import pool from '../database'
import { QueryResult } from 'pg';

export class DashboardQueries {
    // Get all products that have been included in orders
    async productsInOrders(): Promise<{ name: string, price: number, order_id: string }[]> {
        try {
            const results: QueryResult = await pool.query('SELECT name, price, order_id FROM products INNER JOIN order_products ON product.id = order_products.id');
            return results.rows;
        } catch (err) {
            throw new Error(`unable get products and orders: ${err}`)
        }
    }

    // Get all users that have made orders
  async fiveMostExpensive(): Promise<{name: string, price: number}[]> {
    try {
        const results: QueryResult = await pool.query('SELECT name, price FROM products ORDER BY price DESC LIMIT 5');
      return results.rows;
    } catch (err) {
      throw new Error(`unable get products by price: ${err}`)
    } 
  }

    // Get all users that have made orders
  async usersWithOrders(): Promise<{name: string, price: number}[]> {
    try {
        const results: QueryResult = await pool.query('SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id');
      return results.rows;
    } catch (err) {
      throw new Error(`unable get products by price: ${err}`)
    } 
  }
}