<template>
  <div class="container">
    <div class="alert alert-danger" v-if="error">{{ error.message }}</div>
    <h1>This is an order</h1>
    <pre>{{ orderUuid }}</pre>
    <pre>{{ order }}</pre>
  </div>
</template>

<script>
import { FETCH_ORDERS } from "@/store/actions.type";
import { mapGetters } from "vuex";

export default {
  props: ["orderUuid"],
  data: () => {
    return { error: null, order: null, isLoading: true };
  },
  computed: {
    ...mapGetters(["isAuthenticated"])
  },
  mounted() {
    if (this.isAuthenticated) {
      this.$store
        .dispatch(FETCH_ORDERS)
        .then(orders => {
          this._data.order = orders.filter(
            o => o.OrderUuid === this.orderUuid
          )[0];
        })
        .catch(err => (this.error = err))
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
