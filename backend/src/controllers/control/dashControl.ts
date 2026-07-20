import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../services/dashService';

export const getDashboardMetrics = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const payload = await DashboardService.getDashboardSummary();
    
    res.status(200).json({
      success: true,
      data: payload
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard metrics'
    });
  }
};