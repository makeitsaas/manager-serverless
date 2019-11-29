<template>
  <div class="container">
    <div class="alert alert-danger" v-if="error">{{ error.message }}</div>
    <h1>This order is {{ orderStatus }}</h1>
    <hr />
    <div class="card" v-if="report">
      <div class="card-header">
        Steps
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-12 col-xs-12">
            <p class="card-text">
              These are order workflow steps
            </p>
            <table class="table">
              <tbody>
                <tr v-for="(step, index) in report.steps" :key="index">
                  <th scope="row">Step n°{{ step.id }}</th>
                  <td>
                    <div>
                      {{ step.name }}
                      <span v-if="step.children.length"
                        >(children={{ step.children }})</span
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <small class="text-muted">Footer text</small>
      </div>
    </div>
    <div class="card" v-if="report">
      <div class="card-header">
        Pointers
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-12 col-xs-12">
            <p class="card-text">
              These are order workflow pointers
            </p>
            <table class="table">
              <tbody>
                <tr v-for="(pointer, index) in report.pointers" :key="index">
                  <th scope="row">
                    Pointer({{ pointer.id }})
                    <span class="badge badge-primary" v-if="pointer.active"
                      >active</span
                    >
                    <span class="badge badge-secondary">{{
                      pointer.statusName
                    }}</span>
                  </th>
                  <td>
                    <div>
                      step = {{ pointer.stepId }}
                      <span v-if="pointer.contextItem"
                        >(input = <code>{{ pointer.contextItem }}</code
                        >)</span
                      >
                    </div>
                    <pre v-if="pointer.persistenceData">{{
                      pointer.persistenceData
                    }}</pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <small class="text-muted">Footer text</small>
      </div>
    </div>
    <div v-if="report">
      <hr />
      <h3>Code report</h3>
      <pre>{{ report }}</pre>
    </div>
  </div>
</template>

<script>
import { FETCH_ORDERS } from "@/store/actions.type";
import { mapGetters } from "vuex";
import OrderUtilsService from "@/common/order-utils.service";

export default {
  props: ["orderUuid"],
  data: () => {
    return {
      error: null,
      order: null,
      report: null,
      orderStatus: null,
      isLoading: true
    };
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
        .finally(() => {
          this.isLoading = false;
          console.log("order:", this.order);
          if (this.order) {
            const report = this.order.OrderReport;
            this.report = OrderUtilsService.formatReport(report);
            this.orderStatus = OrderUtilsService.getOrderStatusName(report);
          }
        });
    }
  }
};
</script>
