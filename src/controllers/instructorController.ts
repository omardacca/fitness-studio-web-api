// src/controllers/instructorController.ts
import { Request, Response } from 'express';
import { InstructorRepository } from '../repositories/instructorRepository';
import { formatInstructorList } from '../formatters/instructorFormatter';

const instructorRepository = new InstructorRepository();

export const listInstructorsController = async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.tenantId;

  if (!tenantId) {
    res.status(400).json({ message: 'TenantId required.' });
    return;
  }

  try {
    const instructors = await instructorRepository.findAll(tenantId);
    res.json({ instructors: formatInstructorList(instructors) });
  } catch (error) {
    console.error('❌ Error fetching instructors:', error);
    res.status(500).json({ message: 'Failed to fetch instructors.' });
  }
};
