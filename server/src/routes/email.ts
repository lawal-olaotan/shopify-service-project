
import express from 'express';
import {scheduleEmail} from "../controllers/scheduleEmail.ts";

/**
 *
 */
const router = express.Router();

router.post('/',scheduleEmail)


export default router