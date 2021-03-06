if (!tr) tr = {};
if (!tr.controls) tr.controls = {};
if (!tr.controls.pnp2) tr.controls.pnp2 = {};
if (!tr.controls.pnp2.program_Tools) tr.controls.pnp2.program_Tools = {};
var p = tr.controls.pnp2.program_Tools;

p.Program_Setup = function(app) {
  app.currentProgram = 0;
  app.programs = [];
  p.LoadPrograms(app)
  app.robotState = p.getCurrentProgram(app).getCurrentWaypoint().positions;
  p.updateUI(app);
};

p.programRun = function(app) {
  if (app.programMode == 1) {
    var prog = p.getCurrentProgram(app);
    var wp = prog.getCurrentWaypoint();
    var pos = wp.positions;
    var wpDuration = wp.speed; // seconds

    var startPos = app.waypointStartPos;

    var time = new Date();
    var duration = (time - app.waypointStart) / 1000.0;
    var durationComplete = (duration / wpDuration)

    if (wpDuration == 0) {
      durationComplete = 1.0;
    }

    for (var i = 0; i < app.robotState.length; i++) {
      app.robotState[i] = (pos[i] - startPos[i]) * durationComplete + startPos[i];
    }

    p.updateUI(app);

    if (duration >= wpDuration) {
      if (prog.waypoints.length - 1 <= prog.currentWaypoint) {
        p.programMode = 0;
      } else {
        p.waypointStart = new Date();
        p.waypointStartPos = Object.assign([], pos);
        prog.currentWaypoint += 1;
      }
    }
  } else {
    var pos = p.getCurrentProgram(app).getCurrentWaypoint().positions;
    app.waypointStart = new Date();
    app.waypointStartPos = Object.assign([], pos);
    app.robotState = Object.assign([], pos);
    p.updateUI(app);
  };
};

p.LoadPrograms = function(app) {
  app.programs.push(new tr.controls.pnp2.program({
    id: 0,
    name: "Program 0",
    waypoints: [{
      positions: [0, 0, 0, 0, 0],
      speed: 1
    }, {
      positions: [0, .85, .46, .25, .3],
      speed: 3
    }, {
      positions: [.5, .4, .8, .6, .8],
      speed: 5
    }]
  }));

  app.programs.push(new tr.controls.pnp2.program({
    id: 1,
    name: "Program 1",
    waypoints: [{
      positions: [0, 0, .2, .2, .4],
      speed: 3
    }, {
      positions: [.2, .7, 1, .9, .7],
      speed: 6
    }, {
      positions: [.5, .4, .6, .4, .8],
      speed: 2
    }]
  }));
};

p.addProgram = function(app) {
  var id = 0;
  for (var i = 0; i < app.programs.length; i++) {
    if (app.programs[i].id >= id) {
      id = app.programs[i].id + 1;
    }
  }

  app.programs.push(new tr.controls.pnp2.program({
    id: id,
    waypoints: [{
      positions: [0, 0, 0, 0, 0],
      speed: 1
    }]
  }));

  p.updateUI(app);
};

p.removeProgram = function(app) {
  var i = app.currentProgram;
  app.programs.splice(i, 1);
  if (app.programs.length == 0) {
    p.addProgram(app)
  }
  app.currentProgram = 0;
  p.updateUI(app);
}

p.changeProgram = function(app, name) {
  for (var i = 0; i < app.programs.length; i++) {
    if (app.programs[i].name == name) {
      app.currentProgram = i;
      p.updateUI(app);
    }
  }
};

p.getCurrentProgram = function(app) {
  return app.programs[app.currentProgram];
};

p.programStart = function(app) {
  var prog = p.getCurrentProgram(app);
  prog.currentWaypoint = 0;
  var wp = prog.getCurrentWaypoint().positions;
  app.waypointStartPos = Object.assign([], wp);
  if (prog.waypoints.length > 2) {
    prog.currentWaypoint += 1;
    app.programMode = 1;
  }
};

p.programStartFrom = function(app) {
  var prog = p.getCurrentProgram(app);
  var wp = prog.getCurrentWaypoint().positions;
  app.waypointStartPos = Object.assign([], wp);
  if (prog.currentWaypoint < prog.waypoints.length - 1) {
    prog.currentWaypoint += 1;
    app.programMode = 1
  } else {
    app.programMode = 0;
  }
};

p.programStop = function(app) {
  app.programMode = 0;
};

p.programRun = function(app) {
  if (app.programMode == 1) {
    var prog = p.getCurrentProgram(app);
    var wp = prog.getCurrentWaypoint();
    var pos = wp.positions;
    var wpDuration = wp.speed; // seconds
    var page = app._app.getCurrentPage();

    var startPos = app.waypointStartPos;

    var time = new Date();
    var duration = (time - app.waypointStart) / 1000.0;
    var durationComplete = (duration / wpDuration)

    if (wpDuration == 0) {
      durationComplete = 1.0;
      page.getChild("durcurrent").text = (durationComplete * 100).toFixed(0) + "%";
    }

    for (var i = 0; i < app.robotState.length; i++) {
      app.robotState[i] = (pos[i] - startPos[i]) * durationComplete + startPos[i];
      page.getChild("a" + i + "currentpos").text = app.robotState[i].toFixed(2) + "°";
      page.getChild("durcurrent").text = (durationComplete * 100).toFixed(0) + "%";
    }

    p.updateUI(app);

    if (duration >= wpDuration) {
      page.getChild("durcurrent").text = ("100") + "%";
      if (prog.waypoints.length - 1 <= prog.currentWaypoint) {
        app.programMode = 0;
        page.getChild("durcurrent").text = ("---") + "%";
      } else {
        app.waypointStart = new Date();
        app.waypointStartPos = Object.assign([], pos);
        prog.currentWaypoint += 1;
      }
    }
  } else {
    var pos = p.getCurrentProgram(app).getCurrentWaypoint().positions;
    app.waypointStart = new Date();
    app.waypointStartPos = Object.assign([], pos);
    app.robotState = Object.assign([], pos);
    p.updateUI(app);
  }
};

p.updateUI = function(app) {
  var prog = p.getCurrentProgram(app);
  var positions = prog.getCurrentWaypoint().positions;
  var speed = prog.getCurrentWaypoint().speed;

  var page = app._app.getCurrentPage();
  var tr2 = page.getChild('tr');
  //console.log(tr2);
  //  console.log(app.robotState);
  tr2.state.a0 = app.robotState[0];
  tr2.state.a1 = app.robotState[1];
  tr2.state.a2 = app.robotState[2];
  tr2.state.a3 = app.robotState[3];
  tr2.state.a4 = app.robotState[4];

  page.getChild('dwaypoint').text = prog.currentWaypoint;
  // page.getChild('dspeed').text = Math.round(speed * 100) / 100;
  page.getChild("a0targetpos").text = positions[0].toFixed(2) + "°";
  page.getChild("a1targetpos").text = positions[1].toFixed(2) + "°";
  page.getChild("a2targetpos").text = positions[2].toFixed(2) + "°";
  page.getChild("a3targetpos").text = positions[3].toFixed(2) + "°";
  page.getChild("a4targetpos").text = positions[4].toFixed(2) + "°";
  page.getChild("durtotal").text = speed.toFixed(2) + " -Seconds";

  p.updateSelect(app);
};

p.updateSelect = function(app) {
  var page = app._app.pages[0];
  var sel = page.getChild('progselect');
  var options = sel.options;


  var opts = [];
  var update = false;
  for (i = 0; i < app.programs.length; i++) {
    opts.push(app.programs[i].name);

    if (options.length - 1 < i) {
      update = true;
    } else if (opts[i] != options[i]) {
      update = true;
    }
  }

  if (update) {
    page.getChild('progselect').setOptions(opts);
  }
};

p.sliderchanged = function(app) {
  var page = app._app.getCurrentPage();
  var pos_array = [];

  pos_array[0] = (page.getChild("a0slider").element.value() * 2 * Math.PI);
  pos_array[1] = (page.getChild("a1slider").element.value() * 2 * Math.PI);
  pos_array[2] = (page.getChild("a2slider").element.value() * 2 * Math.PI);
  pos_array[3] = (page.getChild("a3slider").element.value() * 2 * Math.PI);
  pos_array[4] = (page.getChild("a4slider").element.value() * 2 * Math.PI);

  p.getCurrentProgram(app).setPositions(pos_array, app);

};
