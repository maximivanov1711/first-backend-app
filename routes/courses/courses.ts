import express, {Response} from "express";
import {CourseDBModel} from "../../models/DB_models/CourseDBModel";
import {CourseViewModel} from "../../models/view_models/CourseViewModel";
import {DBModel} from "../../models/DB_models/DBModel";
import {GenericRequest} from "../../src/types";
import {QueryCoursesRequestModel} from "../../models/request_models/queryCoursesRequestModel";
import {GetCourseRequestModel} from "../../models/request_models/GetCourseRequestModel";
import {HTTP_STATUSES} from "../../src/constants";
import {CreateCourseRequestModel} from "../../models/request_models/CreateCourseRequestModel";
import {DeleteCourseRequestModel} from "../../models/request_models/DeleteCourseRequestModel";
import {UpdateCourseRequestModel} from "../../models/request_models/UpdateCourseRequestModel";

const mapDBCourseToViewCourse = (dbCourse: CourseDBModel): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const getCoursesRouter = (db: DBModel) => {
    const router = express.Router()

    router.get('/', (
        req: GenericRequest<QueryCoursesRequestModel>,
        res: Response<CourseViewModel[]>
    ) => {
        let foundCourses = db.courses

        if (req.query.title) {
            foundCourses = db.courses.filter(c => c.title.indexOf(req.query.title) >= 0)
        }

        res.json(foundCourses.map(mapDBCourseToViewCourse))
    })
    router.get('/:id', (
        req: GenericRequest<GetCourseRequestModel>,
        res: Response<CourseViewModel>
    ) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id)

        if (foundCourse) res.json(mapDBCourseToViewCourse(foundCourse))
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })
    router.post('/', (
        req: GenericRequest<CreateCourseRequestModel>,
        res: Response<CourseViewModel>
    ) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        const newCourseId = +(new Date())
        const newCourse: CourseDBModel = {
            id: newCourseId,
            title: req.body.title,
            _secretDBKey: '_secretDBKey ' + newCourseId
        }

        db.courses.push(newCourse)

        res.status(HTTP_STATUSES.CREATED_201)
        res.json(mapDBCourseToViewCourse(newCourse))
    })
    router.delete('/:id', (
        req: GenericRequest<DeleteCourseRequestModel>,
        res
    ) => {
        const origLength = db.courses.length

        db.courses = db.courses.filter(c => c.id != +req.params.id)

        if (db.courses.length === origLength) res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        else res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    router.put('/:id', (
        req: GenericRequest<UpdateCourseRequestModel>,
        res: Response<CourseViewModel>
    ) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        const foundCourse = db.courses.find(c => c.id === +req.params.id)

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        foundCourse.title = req.body.title

        res.status(HTTP_STATUSES.OK_200)
        res.json(mapDBCourseToViewCourse(foundCourse))
    })

    return router
}