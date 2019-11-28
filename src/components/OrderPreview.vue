<template>
  <div class="card">
    <div class="card-header">
      Order {{ order.OrderUuid }}
      <span class="badge badge-secondary">In progress</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <!--<div class="alert alert-secondary" role="alert">
            Order in progress
          </div>-->
          <!--                  <h5 class="card-title">Special title treatment</h5>-->
          <p class="card-text">
            This is demo view of an deployment order
          </p>
          <table class="table">
            <tbody>
              <tr>
                <th scope="row">CreatedAt</th>
                <td>{{ order.CreatedAt | date }}</td>
              </tr>
              <tr>
                <th scope="row">UpdatedAt</th>
                <td>{{ order.UpdatedAt | date }}</td>
              </tr>
              <tr>
                <th scope="row">Report</th>
                <td>
                  <div class="report">{{ order.OrderReport }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="alert alert-info" role="alert">
            <i class="ion-information-circled"></i>&nbsp; Url of the updated
            environment will be available here
          </div>

          <router-link
            class="btn btn-primary"
            :to="{
              name: 'order-detail',
              params: { orderUuid: order.OrderUuid }
            }"
          >
            View progress
          </router-link>
          <button
            disabled
            class="btn btn-secondary"
            type="button"
            title="Not implement yet"
          >
            Relaunch
          </button>
        </div>
        <div class="col-md-6">
          <pre>{{ order.OrderContent.trim() }}</pre>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <small class="text-muted"
        >Last updated {{ order.UpdatedAt | lastModified }}</small
      >
    </div>
  </div>
</template>

<style scoped>
pre {
  background: #f0f0f0;
  padding: 0.5em 1em;
}

button,
a {
  margin-right: 0.5em;
}

table {
  width: 100%;
}

.report {
  /*max-width: 400px;*/
  overflow: hidden;
  max-height: 100px;
  /*white-space: nowrap;*/
  text-overflow: ellipsis;
}
</style>

<script>
import moment from "moment";

export default {
  name: "MisOrderPreview",
  props: {
    order: { type: Object, required: true }
  },
  filters: {
    date: utcDate => {
      return moment(utcDate).format("DD/MM/YYYY [at] hh:mm:ss");
    },
    lastModified: utcDate => {
      const hours = moment().diff(utcDate, "hours");
      const minutes = moment().diff(utcDate, "minutes");

      if (minutes === 0) {
        return `few seconds ago`;
      } else if (minutes < 60) {
        return `${minutes} minutes ago`;
      } else if (hours < 49) {
        return `${hours} hours ago`;
      } else {
        return `on  ${moment(utcDate).format("DD/MM/YYYY")}`;
      }
    }
  }
};
</script>
