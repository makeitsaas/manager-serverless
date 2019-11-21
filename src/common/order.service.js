import Vue from "vue";
import JwtService from "@/common/jwt.service";
import netlify from "@/store/lib/netlify";

const generateConfig = () => ({
  baseURL: netlify.identity.getNetlifyBaseUrl(),
  headers: {
    Authorization: `Bearer ${JwtService.getToken()}`
  }
});

export const OrderService = {
  test() {
    return Vue.axios.get(`.netlify/functions/test`, generateConfig());
  },
  scan() {
    const config = generateConfig();
    console.log(JwtService.getToken());
    console.log("config", config);
    return Vue.axios.get(`.netlify/functions/orders-scan`, config);
  }
};

export default OrderService;
