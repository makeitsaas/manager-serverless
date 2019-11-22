<template>
  <div>
    <div v-if="isAuthenticated">
      <div class="alert alert-danger" v-if="error">
        <pre>{{ error && error.message }}</pre>
      </div>
      <div class="alert alert-info" v-if="isLoading">loading</div>

      <MisOrderPreview
        v-for="(order, index) in orders"
        :key="index"
        :order="order"
      ></MisOrderPreview>
    </div>
    <div class="card" v-if="!isAuthenticated">
      <div class="alert alert-danger">Authentication required</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { FETCH_ORDERS } from "@/store/actions.type";
import MisOrderPreview from "./OrderPreview";
import moment from "moment";

export default {
  name: "MisOrdersList",
  components: {
    MisOrderPreview
  },
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
          this.orders = orders.sort((o1, o2) => {
            const d1 = moment(o1.CreatedAt);
            const d2 = moment(o2.CreatedAt);

            if (d1 > d2) {
              return -1;
            } else if (d1 < d2) {
              return 1;
            } else {
              return 0;
            }
          });
          this.isLoading = false;
        })
        .catch(err => (this.error = err));
    }
  },
  methods: {}
};
</script>
