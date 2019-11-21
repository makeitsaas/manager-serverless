<template>
  <footer>
    <div class="container">
      <router-link class="logo-font" :to="{ name: 'home', params: {} }">
        Make it SaaS
      </router-link>
      <span class="attribution">
        An independent project about distributed architectures using open source
        technologies
      </span>
    </div>
  </footer>
</template>

<script>
export default {
  name: "RwvFooter"
};
</script>
