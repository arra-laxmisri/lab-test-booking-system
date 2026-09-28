import { dbStore, ITest } from '../config/db.js';

export class TestModel {
  static async find(query?: { category?: string; search?: string; available?: boolean }): Promise<ITest[]> {
    let tests = dbStore.getDatabase().tests;

    if (query?.category && query.category !== 'All') {
      tests = tests.filter(t => t.category.toLowerCase() === query.category!.toLowerCase());
    }

    if (query?.search) {
      const q = query.search.toLowerCase();
      tests = tests.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    if (typeof query?.available === 'boolean') {
      tests = tests.filter(t => t.available === query.available);
    }

    return tests;
  }

  static async findById(id: string): Promise<ITest | null> {
    const test = dbStore.getDatabase().tests.find(t => t._id === id);
    return test || null;
  }

  static async create(data: Omit<ITest, '_id'>): Promise<ITest> {
    const newTest: ITest = {
      ...data,
      _id: 'test-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };
    dbStore.getDatabase().tests.push(newTest);
    dbStore.persist();
    return newTest;
  }

  static async updateById(id: string, update: Partial<ITest>): Promise<ITest | null> {
    const tests = dbStore.getDatabase().tests;
    const index = tests.findIndex(t => t._id === id);
    if (index === -1) return null;

    tests[index] = {
      ...tests[index],
      ...update
    };
    dbStore.persist();
    return tests[index];
  }

  static async deleteById(id: string): Promise<boolean> {
    const tests = dbStore.getDatabase().tests;
    const index = tests.findIndex(t => t._id === id);
    if (index === -1) return false;

    tests.splice(index, 1);
    dbStore.persist();
    return true;
  }
}
