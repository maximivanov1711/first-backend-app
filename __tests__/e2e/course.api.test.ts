import request from 'supertest'
import {CourseViewModel} from '../../models/view_models/CourseViewModel'
import {HTTP_STATUSES} from '../../src/constants'
import {app} from "../../src/app";

describe('/course', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/-1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('shouldn`t create a course with incorrect input data', async () => {
        await request(app)
            .post('/courses')
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse1: CourseViewModel;
    it('should create a course with correct input data', async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({title: 'New course'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse1 = createResponse.body

        expect(createdCourse1).toEqual({
            id: expect.any(Number),
            title: 'New course'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    })
    let createdCourse2: CourseViewModel;
    it('should create one more course with correct input data', async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({title: 'New course 2'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 'New course 2'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })

    it('shouldn`t update a course with incorrect input data', async () => {
        await request(app)
            .put(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        const getResponseAfterUpdate = await request(app).get('/courses')
        const coursesAfterUpdate = getResponseAfterUpdate.body

        expect(coursesAfterUpdate).toEqual([createdCourse1, createdCourse2])
    })

    it('shouldn`t update a course that does not exist', async () => {
        await request(app)
            .put('/courses/0')
            .send({title: 'New title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should update a course with correct input data', async () => {
        await request(app)
            .put(`/courses/${createdCourse1.id}`)
            .send({title: 'New title'})
            .expect(HTTP_STATUSES.OK_200, {...createdCourse1, title: 'New title'})
    })

    it('should return 404 when trying to delete a course that does not exist', async () => {
        await request(app)
            .delete(`/courses/-1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should delete existing course and return 204', async () => {
        await request(app)
            .delete(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse2])

        await request(app)
            .delete(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })
})