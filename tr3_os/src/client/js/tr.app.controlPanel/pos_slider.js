function pos_Slider(id) {
  return {
    type: "container",
    size: {
      w: .334,
      h: 25
    },
    children: [{
      type: "container",
      border: false,
      children: [{
        id: id + "slider",
        type: "slider",

        onInput: function(val) {
          var app = this.getApp();
          var page = app.getCurrentPage();
          var select = page.getChild("select-" + id);
          var sliderVal = page.getChild(id + "slider").element.value();

          var val = 0;
          if (select.element.value() == "EFFORT") {
            val = sliderVal;
            tr.data.socket.emit("/tr3/joints/" + id + "/control/effort", val);
          } else if (select.element.value() == "SERVO") {
            val = sliderVal * Math.PI * 2.0;
            tr.data.socket.emit("/tr3/joints/" + id + "/control/position", val);
          }

          var label = page.getChild(id + "sliderl");
          label.text = val.toFixed(2);
        },

        onChange: function(val) {
          var app = this.getApp();
          var page = app.getCurrentPage();
          var select = page.getChild("select-" + id);
          if (select.element.value() == "EFFORT") {
            var val = 0;

            var slider = page.getChild(id + "slider");
            slider.element.value(val);
            tr.data.socket.emit("/tr3/joints/" + id + "/control/effort", val);

            var label = page.getChild(id + "sliderl");
            label.text = val.toFixed(2);
          }
        },

        min: -1,
        max: 1,
        val: 0,
        step: 0.01,
        align: {
          v: "CENTER",
          h: "CENTER"
        },
      }],
    }]
  }
}
