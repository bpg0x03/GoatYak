export class User {
    uid: string
    secret: string

    deserialze (input: any) {
        Object.assign(this, input)
        return this
     }
}
