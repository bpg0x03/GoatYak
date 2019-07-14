import { DefaultUrlSerializer } from '@angular/router';

export class Post  {
   _id: String;
   uid: String;
   createdAt: Date;
   text: String;
   votes: [{
      uid: String,
      val: Number
   }];
   comments:[{
      uid: String,
      text: String,
      votes: [{
         uid: String,
         val: Number
      }]
   }]

   deserialze (input: any) {
      Object.assign(this, input)
      return this
   }
}
