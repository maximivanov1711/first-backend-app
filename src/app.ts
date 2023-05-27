import express from "express";
import {db} from "./db";
import {getCoursesRouter} from "../routes/courses/courses";
import {getTestsRouter} from "../routes/tests/tests";

export const app = express()

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use('/courses', getCoursesRouter(db))
app.use('/__test__', getTestsRouter(db))