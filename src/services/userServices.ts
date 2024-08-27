import { FromJsonToUser } from "../helpers/convertors";
import { User } from "../models/user";

export class UserServices {
   async getCurrentUser(): Promise<User> {
      const response = await fetch("/data.json");
      const jsonFile = await response.json();
      return FromJsonToUser(jsonFile.currentUser);
   }
}