import { DefaultUrlSerializer } from '@angular/router';

export class mComment  {
    _id: String;
    uid: String;
    text: String;
    votes: [{
        uid: String,
        val: Number
    }]
}
