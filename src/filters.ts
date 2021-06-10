import Vue from "vue";

Vue.filter("stringify", (str) => JSON.stringify(str, null, 2));
