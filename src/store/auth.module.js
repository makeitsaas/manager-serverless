import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  CHECK_AUTH,
  UPDATE_USER
} from "./actions.type";
import { SET_AUTH, PURGE_AUTH, SET_ERROR } from "./mutations.type";
import netlify from "./lib/netlify";

netlify.identity.init();

const state = {
  errors: null,
  user: netlify.identity.currentUser(),
  isAuthenticated: !!netlify.identity.getJWT()
};

console.log(`init auth`, state.user && state.user.email);

// state.user = JSON.stringify(netlify.identity.currentUser());

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  [LOGIN](context, { email, password }) {
    console.log("login");
    return netlify.identity
      .login(email, password)
      .then(() => console.log("login callback"))
      .then(user => context.commit(SET_AUTH, user))
      .catch(error => {
        context.commit(SET_ERROR, [error]);
        throw error;
      });
  },
  [LOGOUT](context) {
    return netlify.identity.logout().then(() => {
      console.log("logout done");
      return context.commit(PURGE_AUTH);
    });
  },
  [REGISTER](context, { email, password }) {
    console.log("register");
    return netlify.identity
      .signup(email, password)
      .then(() => console.log("register callback"))
      .catch(error => {
        context.commit(SET_ERROR, [error]);
        throw error;
      });
    /*return new Promise((resolve, reject) => {
      ApiService.post("users", { user: credentials })
        .then(({ data }) => {
          context.commit(SET_AUTH, data.user);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.errors);
          reject(response);
        });
    });*/
  },
  [CHECK_AUTH](context) {
    console.log(`CHECK_AUTH`);
    if (JwtService.getToken()) {
      ApiService.setHeader();
      // ApiService.get("user")
      netlify.api
        .getMe()
        .then(user => {
          context.commit(SET_AUTH, user);
        })
        .catch(() => {
          // context.commit(SET_ERROR, response.data.errors);
          context.commit(PURGE_AUTH);
        });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  [UPDATE_USER](context, payload) {
    const { email, username, password, image, bio } = payload;
    const user = {
      email,
      username,
      bio,
      image
    };
    if (password) {
      user.password = password;
    }

    return ApiService.put("user", user).then(({ data }) => {
      context.commit(SET_AUTH, data.user);
      return data;
    });
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, user) {
    console.log(`SET_AUTH`, user);
    state.isAuthenticated = true;
    state.user = netlify.identity.currentUser();
    state.errors = {};
    // JwtService.saveToken(state.user.token); => saved using gotrue
  },
  [PURGE_AUTH](state) {
    console.log(`PURGE_AUTH`);
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    // JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
