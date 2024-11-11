import "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: string;
    }
    interface Request {
      user: any;
    }
    interface Response {
      user: any;
    }
  }
}

//https://stackoverflow.com/questions/44383387/typescript-error-property-user-does-not-exist-on-type-request