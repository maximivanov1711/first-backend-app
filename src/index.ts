import {APP_PORT} from './constants'
import {app} from './app'

app.listen(APP_PORT, () => {
    console.log(`Example app listening on port ${APP_PORT}`)
})