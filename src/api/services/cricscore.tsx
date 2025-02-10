// /api/services/cricScores.service.js

import axiosInstance from '../interceptors/interceptor'; 
import { CRIC_SCORES_URL } from '../../appconstants/constants';
import { CricScore } from '../types/datatypes';

export const getCricScores = async (): Promise<CricScore[]> => { 
    try {
      const response = await axiosInstance.get<CricScore[]>(CRIC_SCORES_URL);  
      return response.data;  
    } catch (error) {
      console.error('Error fetching cricket scores:', error);
      throw error;  // Rethrow the error for the calling component to handle
    }
  };