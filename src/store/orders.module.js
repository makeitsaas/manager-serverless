import OrderService from "@/common/order.service";
import { FETCH_ORDERS } from "./actions.type";

const state = {
  orders: []
};

const getters = {
  orders(state) {
    return state.orders;
  }
};

const actions = {
  async [FETCH_ORDERS]() {
    return await OrderService.scan();
  }
};

const mutations = {};

export default {
  state,
  actions,
  mutations,
  getters
};
