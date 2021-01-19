import Axios from "axios";
import Config from "./Config";

Axios.defaults.withCredentials = true;

export default {
  toApiAddr: function(url) {
    return Config.instance().api + url;
  },
  apiExecute: function(method, url, data, onSuccess, onError) {
    const executeConf = {
      method: method,
      url: this.toApiAddr(url),
    };
    if (method === "GET") {
      executeConf.params = data;
    } else {
      executeConf.data = data;
    }
    Axios(executeConf)
      .then(function(resp) {
        if (!resp.data || typeof resp.data.code !== "number") {
          console.log("unknown resp: " + resp);
          return;
        }
        if (resp.data.code === -10000) {
          window.location.href =
            Config.instance().loginPage +
            "?returnUrl=" +
            encodeURI(window.location.href);
          return;
        }
        if (resp.data.code > 0) {
          console.log(
            "encounter biz error code: " +
              resp.data.code +
              ", msg: " +
              resp.data.msg
          );
        }
        onSuccess(resp.data.code, resp.data.msg, resp.data.data, resp.headers);
      })
      .catch(function(e) {
        if (onError) {
          onError(e);
        }
      });
  },
  apiGet: function(url, data, onSuccess, onError) {
    this.apiExecute("GET", url, data, onSuccess, onError);
  },
  apiPost: function(url, data, onSuccess, onError) {
    this.apiExecute("POST", url, data, onSuccess, onError);
  },
  getQueryVariable: function(name) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] === name) {
        return pair[1];
      }
    }
    return null;
  },
  revertToQuery: function(criteria) {
    const kvs = [];
    for (let k in criteria) {
      const v = criteria[k];
      if (typeof v == "undefined" || isNaN(v) || (!v && v !== 0)) {
        continue;
      }
      kvs.push(k + "=" + encodeURIComponent(v));
    }
    return kvs.join("&");
  },
};
