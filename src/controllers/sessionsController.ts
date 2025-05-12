import { Request, Response } from 'express';
import { fetchAvailableSessions, getAvailableCourses } from '../services/sessionsService';


export const getAvailableSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseTypeId, dateTime, instructorId } = req.query;

    if (!dateTime || typeof dateTime !== 'string') {
      res.status(400).json({ message: 'Missing or invalid dateTime' });
      return;
    }

    const sessions = await fetchAvailableSessions({
      courseTypeId: courseTypeId ? Number(courseTypeId) : null,
      dateTime,
      instructorId: instructorId ? String(instructorId) : null,
      tenantId: req.tenantId || 'demo', // fallback to demo
    });

    res.json({sessions});
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAvailableCoursesController = async (req: Request, res: Response) => {
  const tenantId = req.tenantId;

  if (!tenantId) {
    res.status(400).json({ message: 'Missing tenantId' });
    return;
  }

  try {
    const availableCourses = await getAvailableCourses(tenantId);
    res.json({ availableCourses });
  } catch (error) {
    console.error('❌ Failed to fetch available courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};