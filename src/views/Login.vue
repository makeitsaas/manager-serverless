<style scoped>
pre {
  background: #ddd;
  padding: 10px 20px;
  white-space: normal;
  word-break: break-word;
}
</style>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <router-link :to="{ name: 'register' }">
              Need an account?
            </router-link>
          </p>
          <ul v-if="errors" class="error-messages">
            <li v-for="(v, k) in errors" :key="k">{{ v.message || v }}</li>
          </ul>
          <form @submit.prevent="onSubmit(email, password)">
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                v-model="email"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                v-model="password"
                placeholder="Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { LOGIN } from "@/store/actions.type";
import * as netlifyIdentity from "netlify-identity-widget";

/*
const loadNetlify = () => {
  netlifyIdentity.init();

  netlifyIdentity.open(); // open the modal
  netlifyIdentity.open("login"); // open the modal to the login tab
  netlifyIdentity.open("signup"); // open the modal to the signup tab

  netlifyIdentity.on("init", user => console.log("init", user));
  netlifyIdentity.on("login", user => console.log("login", user));
  netlifyIdentity.on("logout", () => console.log("Logged out"));
  netlifyIdentity.on("error", err => console.error("Error", err));
  netlifyIdentity.on("open", () => console.log("Widget opened"));
  netlifyIdentity.on("close", () => console.log("Widget closed"));

  // Close the modal
  netlifyIdentity.close();

  // Log out the user
  netlifyIdentity.logout();

  // Access the underlying GoTrue JS client.
  // Note that doing things directly through the GoTrue client brings a risk of getting out of
  // sync between your state and the widget’s state.
  netlifyIdentity.gotrue;
};
*/

export default {
  name: "RwvLogin",
  data() {
    return {
      email: null,
      password: null,
      verifyCurl: null
    };
  },
  methods: {
    onSubmit(email, password) {
      this.$store
        .dispatch(LOGIN, { email, password })
        .then(() => this.$router.push({ name: "home" }));
    },
    logout() {
      netlifyIdentity.logout();
    }
  },
  mounted() {
    console.log("state currentUser", this.currentUser);
    console.log("state isAuthenticated", this.isAuthenticated);
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
