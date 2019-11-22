<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">Make it SaaS</h1>
        <p>A place to launch your applications.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <img
              class="card-img-top"
              src="/img/icons/apple-touch-icon-180x180.png"
              alt="Card image cap"
            />
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <button @click="doSomething" class="btn btn-primary">
                Do Something
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <MisOrdersList></MisOrdersList>
        </div>
      </div>
      <!-- Feed wrapper -->
      <!--div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="isAuthenticated" class="nav-item">
                <router-link
                  :to="{ name: 'home-my-feed' }"
                  class="nav-link"
                  active-class="active"
                >
                  Your Feed
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'home' }"
                  exact
                  class="nav-link"
                  active-class="active"
                >
                  Global Feed
                </router-link>
              </li>
              <li class="nav-item" v-if="tag">
                <router-link
                  :to="{ name: 'home-tag', params: { tag } }"
                  class="nav-link"
                  active-class="active"
                >
                  <i class="ion-pound"></i> {{ tag }}
                </router-link>
              </li>
            </ul>
          </div>
          <router-view></router-view>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <RwvTag v-for="(tag, index) in tags" :name="tag" :key="index">
              </RwvTag>
            </div>
          </div>
        </div>
      </div-->
      <!-- end Feed wrapper -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RwvTag from "@/components/VTag";
import MisOrdersList from "@/components/OrdersList";
import { FETCH_TAGS } from "@/store/actions.type";

export default {
  name: "home",
  components: {
    MisOrdersList,
    RwvTag
  },
  methods: {
    doSomething() {
      alert("You rock!");
    }
  },
  mounted() {
    this.$store.dispatch(FETCH_TAGS);
  },
  computed: {
    ...mapGetters(["isAuthenticated", "tags"]),
    tag() {
      return this.$route.params.tag;
    }
  }
};
</script>
