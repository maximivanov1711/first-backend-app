import {CourseDBModel} from "../models/DB_models/CourseDBModel";

export const db: { courses: CourseDBModel[] } = {
    courses: [
        {id: 1, title: 'Back-end', _secretDBKey: `_secretDBValue 1`},
        {id: 2, title: 'Front-end', _secretDBKey: '_secretDBValue 2'},
        {id: 3, title: 'Automation QA', _secretDBKey: '_secretDBValue 3'},
        {id: 4, title: 'DevOps', _secretDBKey: '_secretDBValue 4'},
    ]
}