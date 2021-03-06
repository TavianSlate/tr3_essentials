if (!tr) tr = {};
if (!tr.controls) tr.controls = {};
if (!tr.controls.pnp2) tr.controls.pnp2 = {};

tr.controls.pnp2.tabControl = function() {
  var c = tr.controls.pnp2;

  return {
    type: "container",
    border: false,
    size: {
      w: 1,
      h: 1,
    },
    children: [{
      type: "tabControl",
      labels: ["Forward", "Inverse"],
      pages: [c.tabForward(), c.tabInverse()],
    }]
  }
}
