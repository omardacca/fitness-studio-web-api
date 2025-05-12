import { Request, Response } from 'express';
import { findAllCourses } from '../repositories/courseTypeRepository';
import { formatCourseTypeList } from '../formatters/courseTypeFormatter';

export const listCourseTypesController = async (req: Request, res: Response): Promise<void> => {
  const tenantId = req.tenantId;

  if (!tenantId) {
    res.status(400).json({ message: 'Tenant ID is required' });
    return;
  }

  try {
    const rawCourses = await findAllCourses(tenantId);
    const courses = formatCourseTypeList(rawCourses);
    
    res.json({ courses });
  } catch (error) {
    console.error('❌ Error fetching course types:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
