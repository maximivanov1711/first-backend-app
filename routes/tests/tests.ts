import {HTTP_STATUSES} from "../../src/constants";
import express from "express";
import {DBModel} from "../../models/DB_models/DBModel";

export const getTestsRouter = (db: DBModel) => {
    const router = express.Router()

    router.delete('/data', (req, res) => {
        db.courses = []
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router
}