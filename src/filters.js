import Vue from "vue"

Vue.filter("stringify", str => JSON.stringify(str, null, 2))
Vue.filter("prettyDate", (date) =>  {
  date = date.split('-')
  date = new Date(date[2], date[0], - 1, date[1])
  return date.toDateString()
});
