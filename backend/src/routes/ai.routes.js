import express from "express";
import {suggestDepartments}
from "../ai/ai.controller.js";

const router = express.Router();

router.post("/suggest-departments",suggestDepartments);

export default router;