import { offendingFields } from './prisma';

describe('common/utils/prisma', () => {
    describe('offendingFields', () => {
        it('should return an empty string if fields is empty', () => {
            expect(offendingFields([])).toBe('');
        });
        it('should return the item if fields is only one item', () => {
            expect(offendingFields(['item'])).toBe('item');
        });
        it('should return item1 and item2 if fields is two items', () => {
            expect(offendingFields(['item1', 'item2'])).toBe('item1 and item2');
        });
        it('should return item1, item2 and item3 if fields is three items', () => {
            expect(offendingFields(['item1', 'item2', 'item3'])).toBe(
                'item1, item2 and item3'
            );
        });
    });
});
