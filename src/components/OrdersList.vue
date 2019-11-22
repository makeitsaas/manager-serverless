<template>
  <div>
    <div v-if="isAuthenticated">
      <div class="alert alert-danger" v-if="error">
        <pre>{{ error && error.message }}</pre>
      </div>
      <div class="alert alert-info" v-if="isLoading">loading</div>
      <div v-if="!isLoading">
        <pre>{{ orders }}</pre>
      </div>
    </div>
    <div v-if="!isAuthenticated">
      <div class="alert alert-danger">Authentication required</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { FETCH_ORDERS } from "@/store/actions.type";

export default {
  name: "MisOrdersList",
  data: () => {
    return {
      isLoading: true,
      orders: [],
      error: null
    };
  },
  props: {},
  computed: {
    ...mapGetters(["isAuthenticated"])
  },
  mounted() {
    if (this.isAuthenticated) {
      this.$store
        .dispatch(FETCH_ORDERS)
        .then(orders => {
          this.orders = orders;
          this.isLoading = false;
        })
        .catch(err => (this.error = err));
    }
  },
  methods: {}
};
</script>
