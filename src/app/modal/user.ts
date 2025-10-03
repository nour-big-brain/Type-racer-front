import { Result } from "./result";

export interface User {
     idUser ?: number;
     username : string;
     email? : string;
     password : string;
     results?: Result[]; 
}
