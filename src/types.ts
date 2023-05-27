import {Request} from 'express'

export type GenericRequest<T> = Request<
    T extends { params: infer P } ? P : {},
    {},
    T extends { body: infer B } ? B : {},
    T extends { query: infer Q } ? Q : {}
>