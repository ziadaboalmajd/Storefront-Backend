import { orderStore } from '../models/order';

const store = new orderStore();

describe('order test', () => {
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('create method should create a new order', async () => {
        const result = await store.create('2' as any);
        expect(result).toEqual({
            id: 1,
            status: 'open',
            user_id: '2',
        } as any);
    });

    it('index method should return a list of orders', async () => {
        const result = await store.index();
        expect(result).toEqual(
            {
                id: 1,
                status: 'open',
                user_id: '2',
            } as any);
    });
});
