import { DefaultUrlSerializer } from '@angular/router';
import { mComment } from './mcomment'; 
export class Post  {
   _id: String;
   uid: String;
   createdAt: Date;
   text: String;
   votes: [{
      uid: String,
      val: Number
   }];
   comments:[mComment]

   deserialze (input: any) {
      Object.assign(this, input)
      return this
   }
}
