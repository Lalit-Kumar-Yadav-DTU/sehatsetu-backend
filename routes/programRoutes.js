import express from 'express';
import { createSection } from '../controllers/sectionController.js';
import { createSubSection } from '../controllers/subSectionController.js';

// Cleaned up the duplicate import!
import { getFullProgramDetails, getAllPrograms, getProgramById, createCourse } from '../controllers/programController.js'; 

const router = express.Router();

// 📂 Standard Program Routes (Static)
router.get('/', getAllPrograms); 

// 🛠️ ADMIN DASHBOARD: Create a brand new Course!
router.post('/createCourse', createCourse);

// 📂 Section Routes (For adding Weeks/Modules)
router.post('/addSection', createSection);

// 🎥 SubSection Routes (For uploading Videos)
router.post('/addSubSection', createSubSection);

// 📺 Fetch full data for the Video Player
router.post('/getFullProgramDetails', getFullProgramDetails);


// 👇 DYNAMIC ROUTE MOVED TO THE VERY BOTTOM 👇
// Always keep this at the bottom so it doesn't accidentally catch other routes!
router.get('/:id', getProgramById); 

export default router;