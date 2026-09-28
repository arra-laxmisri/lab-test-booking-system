import { Request, Response } from 'express';
import { TestModel } from '../models/Test.js';

export class TestController {
  static async getTests(req: Request, res: Response): Promise<void> {
    try {
      const { category, search, available, sort } = req.query;

      let tests = await TestModel.find({
        category: category as string,
        search: search as string,
        available: available !== undefined ? available === 'true' : undefined
      });

      // Sorting
      if (sort === 'price-asc') {
        tests = [...tests].sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        tests = [...tests].sort((a, b) => b.price - a.price);
      } else if (sort === 'popular') {
        tests = [...tests].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      }

      res.json({
        count: tests.length,
        tests
      });
    } catch (err: any) {
      console.error('getTests error:', err);
      res.status(500).json({ message: 'Unable to retrieve lab tests at this time.' });
    }
  }

  static async getTestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const test = await TestModel.findById(id);

      if (!test) {
        res.status(404).json({ message: 'Requested laboratory test was not found.' });
        return;
      }

      res.json({ test });
    } catch (err: any) {
      console.error('getTestById error:', err);
      res.status(500).json({ message: 'Unable to retrieve test details.' });
    }
  }

  static async createTest(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, category, price, sampleType, reportTime, preparation, parameters, available } = req.body;

      if (!name || !description || !category || price === undefined || !sampleType || !reportTime) {
        res.status(400).json({ message: 'Please provide all required fields: name, description, category, price, sampleType, and reportTime.' });
        return;
      }

      const newTest = await TestModel.create({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: Number(price),
        sampleType: sampleType.trim(),
        reportTime: reportTime.trim(),
        preparation: preparation?.trim() || 'No specific fasting or preparation required.',
        parameters: Array.isArray(parameters) ? parameters : [],
        available: available !== undefined ? Boolean(available) : true,
        popular: false
      });

      res.status(201).json({
        message: 'Diagnostic test created successfully.',
        test: newTest
      });
    } catch (err: any) {
      console.error('createTest error:', err);
      res.status(500).json({ message: 'Failed to create test catalog entry.' });
    }
  }

  static async updateTest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await TestModel.updateById(id, req.body);

      if (!updated) {
        res.status(404).json({ message: 'Test not found to update.' });
        return;
      }

      res.json({
        message: 'Diagnostic test updated successfully.',
        test: updated
      });
    } catch (err: any) {
      console.error('updateTest error:', err);
      res.status(500).json({ message: 'Failed to update test catalog entry.' });
    }
  }

  static async deleteTest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await TestModel.deleteById(id);

      if (!deleted) {
        res.status(404).json({ message: 'Test not found to delete.' });
        return;
      }

      res.json({ message: 'Diagnostic test removed successfully.' });
    } catch (err: any) {
      console.error('deleteTest error:', err);
      res.status(500).json({ message: 'Failed to delete test.' });
    }
  }
}
