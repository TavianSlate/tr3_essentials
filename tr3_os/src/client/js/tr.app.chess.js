if (!tr) tr = {};
if (!tr.app) tr.app = {};

tr.app.chess = new App({
  name: "Chess",
  iconUrl: "/img/icon-app-chess",
  enabled: false,
  pages: [{
    id: "main",
    header: {
      text: "Chess",
    },
    children: [{
      type: "container",
      margin: 10,
      padding: 10,
      background: "rgba(255, 255, 255, 0.2)",
      radius: 15,
      children: [],
    }],
  }],
});
