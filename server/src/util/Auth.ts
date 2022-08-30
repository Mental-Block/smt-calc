import { compare, genSalt, hash } from "bcryptjs";

export default class Auth {
    static async comparePassword(password: string, confirmPassword: string) {
      return  await compare (password, confirmPassword);
    }

    static async genSalt(){
     return await genSalt()
    }

    static async hash(password: string, salt: string | number){
      return hash(password, salt)
    }
}