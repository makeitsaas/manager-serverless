import * as netlifyIdentity from "netlify-identity-widget";
import axios from "axios";

const identity = {
  init() {
    netlifyIdentity.on(
      "init",
      user => (console.log("[IDENTITY] init", user), (this.user = user))
    );
    netlifyIdentity.on(
      "login",
      user => (console.log("[IDENTITY] login", user), (this.user = user))
    );
    netlifyIdentity.on("logout", () => console.log("[IDENTITY] Logged out"));
    netlifyIdentity.on("error", err => console.error("[IDENTITY] Error", err));
    netlifyIdentity.on("open", () => console.log("[IDENTITY] Widget opened"));
    netlifyIdentity.on("close", () => console.log("[IDENTITY] Widget closed"));

    netlifyIdentity.init();
  },
  currentUser() {
    const token = this.getJWT();
    if (!token) {
      return null;
    }

    try {
      return JSON.parse(atob(token.split(`.`)[1]));
    } catch (e) {
      console.error("Error parsing jwt", token);
      return null;
    }
  },
  login(email, password) {
    return netlifyIdentity.gotrue.login(email, password, true);
  },
  signup(email, password) {
    return netlifyIdentity.gotrue.signup(email, password);
  },
  logout() {
    const gotrueUser = netlifyIdentity.gotrue.currentUser();
    if (gotrueUser) {
      return gotrueUser.logout();
    } else {
      console.log("no current user");
      return Promise.resolve();
    }
  },
  getJWT() {
    const gotrueUser = netlifyIdentity.currentUser();

    if (gotrueUser && gotrueUser.token) {
      return gotrueUser.token.access_token;
    }
  }
};

const api = {
  getMe() {
    return axios
      .get(`https://cocky-bohr-71d33d.netlify.com/.netlify/identity/user`)
      .then(response => {
        console.log(`get me response`, response);
        return response.data;
      });
  }
};

window.netlifyIdentity = netlifyIdentity;

export default {
  identity,
  api
};
