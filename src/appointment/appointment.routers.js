import { Router } from "express";
import {
  addAppointment,
} from "./appointment.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router();

api.post("/", validateJwt, addAppointment);


export default api;
