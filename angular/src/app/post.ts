export class Post {
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
}
