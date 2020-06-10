import Vue from "vue";
import moment from "moment";

Vue.filter("stringify", str => JSON.stringify(str, null, 2));
Vue.filter("prettyDate", (date) =>  {
  return moment(date, "DD-MM-YYYY").format("MMMM Do, YYYY");
});
