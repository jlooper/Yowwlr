import { getString, setString } from "tns-core-modules/application-settings";

const tokenKey = "token";

export class BackendService {

static isLoggedIn(): boolean {
    return !!getString("token");
  }

  static get token(): string {
    return getString("token");
  }

  static set token(theToken: string) {
    setString("token", theToken);
  }
}
