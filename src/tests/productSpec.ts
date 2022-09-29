import { productStore } from '../models/products';

const store = new productStore();

describe('product model', () => {
    it('should have a create method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

});

it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual(
        {
            name: 'test_product1',
            price: '500',
        })
    });


