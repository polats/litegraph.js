//event related nodes
(function(global) {
    var LiteGraph = global.LiteGraph;

    // 🌿 : kelp = add 🦐 to make 🏝
    {
    function Kelp() {
      this.emoji = "🌿"

      this.properties =
      {
        interval: 1000,
        event: "tick",
        min: 0,
        max: 1,
        value: 0,
        color: "#AAF"
      };

      this.addInput("🌞", LiteGraph.EVENT);

      this.minLife = 0;
      this.maxLife = 1;
      this.life = this.maxLife;
      this.lifeDec = 0.005;

      this.barColor = "#ff6b6b";
      this.interval = 1000;
      this.size = [100, 100];
      this.last_interval = 1000;
      this.triggered = false;
      this.tooltip = "sustain with 🌞"

      this.dying = false;
      this.dyingCountdown = 0;
      this.ticksToDie = 2;

      this.minEvo = 0;
      this.maxEvo = 25;
      this.evoInc = 1;
      this.evoPoints = this.minEvo;

    }

    Kelp.title = "Kelp";

    Kelp.prototype.onStart = function() {
        this.time = 0;
    };

    Kelp.on_color = "#ff6b6b";
    Kelp.off_color = "#222";
    Kelp.markers_color = "#666";
    Kelp.evo_color = "#ffee00";

    Kelp.prototype.onDrawForeground = function(ctx) {

      //life
      ctx.lineWidth = 1;
      ctx.fillStyle = this.barColor;
      var v =
          (this.life - this.minLife) /
          (this.maxLife - this.minLife);
      v = Math.min(1, v);
      v = Math.max(0, v);
      ctx.fillRect(2, 2, (this.size[0] - 4) * v, this.size[1] - 4);

      // evo
      ctx.fillStyle = Cell.evo_color;
      v =
          (this.evoPoints - this.minEvo) /
          (this.maxEvo - this.minEvo);
      v = Math.min(1, v);
      v = Math.max(0, v);
      ctx.fillRect(2, this.size[1] - 10, (this.size[0] - 4) * v, 8);


      // emoj
        var x = this.size[0] * 0.5;
        var h = this.size[1];

        ctx.textAlign = "center";
        ctx.font = (h * 0.7).toFixed(1) + "px Arial";
        ctx.fillStyle = "#EEE";
        ctx.fillText(
            this.dying ?  "💀" : this.emoji,
            x,
            h * 0.75
        );
    };

    Kelp.prototype.onDrawBackground = function(ctx) {
      this.boxcolor = this.triggered
          ? Kelp.on_color
          : Kelp.off_color;
      this.triggered = false;

      if( this.mouseOver )
      {
        ctx.fillStyle = "#AAA";
        ctx.fillText( this.tooltip, 0, this.size[1] + 14 );
      }
    };

    Kelp.prototype.onExecute = function() {
        var dt = this.graph.elapsed_time * 1000; //in ms

        var trigger = this.time == 0;

        this.time += dt;

        this.last_interval = Math.max(
            1,
            this.getInputOrProperty("interval") | 0
        );

        if (
            !trigger &&
            (this.time < this.last_interval || isNaN(this.last_interval))
        ) {
            if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
                this.setOutputData(1, false);
            }
            return;
        }

        this.triggered = true;
        this.time = this.time % this.last_interval;

        // Start Tick

        // if connected, start evolving
        if (this.getOutputNodes(0) != null)
        {
          this.evoPoints += (this.evoInc * this.getOutputNodes(0).length);

          // has hit evolution point
          if (this.evoPoints >= this.maxEvo)
          {
            var oceanNode = this.getInputNode(0);
            var planktonNode = LiteGraph.createNode('game3/Plankton');

            planktonNode.size = [100, 100];
            planktonNode.pos = [this.pos[0], this.pos[1]];
            oceanNode.connect(0, planktonNode, 0);

            // add
            this.graph.add(planktonNode);

            // delete old
            this.graph.remove(this);
          }
        }


        else if (this.getInputNode(1) === null)// start dying if no sun
        {
          this.life -= this.lifeDec;
          if (this.life < this.minLife) {
            if (!this.dying)
            {
              this.dying = true;
              this.dyingCountdown = this.ticksToDie;
            }
            else {
              this.dyingCountdown -= 1;
              if (this.dyingCountdown <= 0)
                this.graph.remove(this);
            }
          }
        }

        this.trigger(this.emoji, this.properties.event);

        if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
            this.setOutputData(1, true);
        }
    };

    Kelp.prototype.onAction = function(action, param) {


    };

    LiteGraph.registerNodeType("game3/Kelp", Kelp);
    }



    // 🦐 : animal that sustains itself with sunlight
    {
    function Plankton() {
      this.emoji = "🦐"

      this.properties =
      {
        interval: 1000,
        event: "tick",
        min: 0,
        max: 1,
        value: 0,
        color: "#AAF"
      };

      this.addInput("🌞", LiteGraph.EVENT);

      this.minLife = 0;
      this.maxLife = 1;
      this.life = this.maxLife;
      this.lifeDec = 0.005;

      this.barColor = "#ff6b6b";
      this.interval = 1000;
      this.size = [100, 100];
      this.last_interval = 1000;
      this.triggered = false;
      this.tooltip = "sustain with 🌞"

      this.dying = false;
      this.dyingCountdown = 0;
      this.ticksToDie = 2;

      this.minEvo = 0;
      this.maxEvo = 25;
      this.evoInc = 1;
      this.evoPoints = this.minEvo;

    }

    Plankton.title = "Plankton";

    Plankton.prototype.onStart = function() {
        this.time = 0;
    };

    Plankton.on_color = "#ff6b6b";
    Plankton.off_color = "#222";
    Plankton.markers_color = "#666";
    Plankton.evo_color = "#ffee00";

    Plankton.prototype.onDrawForeground = function(ctx) {

      //life
      ctx.lineWidth = 1;
      ctx.fillStyle = this.barColor;
      var v =
          (this.life - this.minLife) /
          (this.maxLife - this.minLife);
      v = Math.min(1, v);
      v = Math.max(0, v);
      ctx.fillRect(2, 2, (this.size[0] - 4) * v, this.size[1] - 4);

      // evo
      ctx.fillStyle = Cell.evo_color;
      v =
          (this.evoPoints - this.minEvo) /
          (this.maxEvo - this.minEvo);
      v = Math.min(1, v);
      v = Math.max(0, v);
      ctx.fillRect(2, this.size[1] - 10, (this.size[0] - 4) * v, 8);


      // emoj
        var x = this.size[0] * 0.5;
        var h = this.size[1];

        ctx.textAlign = "center";
        ctx.font = (h * 0.7).toFixed(1) + "px Arial";
        ctx.fillStyle = "#EEE";
        ctx.fillText(
            this.dying ?  "💀" : this.emoji,
            x,
            h * 0.75
        );
    };

    Plankton.prototype.onDrawBackground = function(ctx) {
      this.boxcolor = this.triggered
          ? Plankton.on_color
          : Plankton.off_color;
      this.triggered = false;

      if( this.mouseOver )
      {
        ctx.fillStyle = "#AAA";
        ctx.fillText( this.tooltip, 0, this.size[1] + 14 );
      }
    };

    Plankton.prototype.onExecute = function() {
        var dt = this.graph.elapsed_time * 1000; //in ms

        var trigger = this.time == 0;

        this.time += dt;

        this.last_interval = Math.max(
            1,
            this.getInputOrProperty("interval") | 0
        );

        if (
            !trigger &&
            (this.time < this.last_interval || isNaN(this.last_interval))
        ) {
            if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
                this.setOutputData(1, false);
            }
            return;
        }

        this.triggered = true;
        this.time = this.time % this.last_interval;

        // Start Tick

        // if connected, start evolving
        if (this.getOutputNodes(0) != null)
        {
          this.evoPoints += (this.evoInc * this.getOutputNodes(0).length);

          // has hit evolution point
          if (this.evoPoints >= this.maxEvo)
          {
            var oceanNode = this.getInputNode(0);
            var planktonNode = LiteGraph.createNode('game3/Plankton');

            planktonNode.size = [100, 100];
            planktonNode.pos = [this.pos[0], this.pos[1]];
            oceanNode.connect(0, planktonNode, 0);

            // add
            this.graph.add(planktonNode);

            // delete old
            this.graph.remove(this);
          }
        }


        else if (this.getInputNode(1) === null)// start dying if no sun
        {
          this.life -= this.lifeDec;
          if (this.life < this.minLife) {
            if (!this.dying)
            {
              this.dying = true;
              this.dyingCountdown = this.ticksToDie;
            }
            else {
              this.dyingCountdown -= 1;
              if (this.dyingCountdown <= 0)
                this.graph.remove(this);
            }
          }
        }

        this.trigger(this.emoji, this.properties.event);

        if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
            this.setOutputData(1, true);
        }
    };

    Plankton.prototype.onAction = function(action, param) {


    };

    LiteGraph.registerNodeType("game3/Plankton", Plankton);
    }


    // 🦠 : building block of life
    {
    function Cell() {
      this.emoji = "🦠"


      this.properties =
      {
        interval: 1000,
        event: "tick",
        min: 0,
        max: 1,
        value: 0,
        color: "#AAF"
      };

      this.addOutput("🦠", LiteGraph.EVENT);
      this.addInput("🦠", LiteGraph.EVENT);
      this.addInput("🌞", LiteGraph.EVENT);

      this.minLife = 0;
      this.maxLife = 1;
      this.life = this.maxLife;
      this.lifeDec = 0.025;

      this.barColor = "#ff6b6b";
      this.interval = 1000;
      this.size = [100, 100];
      this.last_interval = 1000;
      this.triggered = false;
      this.tooltip = "🦠 consume other 🦠"

      this.dying = false;
      this.dyingCountdown = 0;
      this.ticksToDie = 2;

      this.minEvo = 0;
      this.maxEvo = 25;
      this.evoInc = 1;
      this.evoPoints = this.minEvo;

      this.minSunEvo = 0;
      this.maxSunEvo = 25;
      this.sunEvoInc = 1;
      this.sunEvoPoints = this.minSunEvo;

    }

    Cell.title = "Cell";

    Cell.prototype.onStart = function() {
        this.time = 0;
    };

    Cell.on_color = "#ff6b6b";
    Cell.off_color = "#222";
    Cell.markers_color = "#666";
    Cell.sun_evo_color = "#ffee00";
    Cell.evo_color = "#7b9ef0";

    Cell.prototype.onDrawForeground = function(ctx) {

      //life
      ctx.lineWidth = 1;
      ctx.fillStyle = this.barColor;
      var v =
          (this.life - this.minLife) /
          (this.maxLife - this.minLife);
      v = Math.min(1, v);
      v = Math.max(0, v);
      ctx.fillRect(2, 2, (this.size[0] - 4) * v, this.size[1] - 4);

      // evo
      ctx.fillStyle = Cell.evo_color;
      v =
          (this.evoPoints - this.minEvo) /
          (this.maxEvo - this.minEvo);
      v = Math.min(1, v);
      v = Math.max(0, v);
      ctx.fillRect(2, this.size[1] - 10, (this.size[0] - 4) * v, 8);


      // sunEvo
      ctx.fillStyle = Cell.sun_evo_color;
      v =
          (this.sunEvoPoints - this.minSunEvo) /
          (this.maxSunEvo - this.minSunEvo);
      v = Math.min(1, v);
      v = Math.max(0, v);
      ctx.fillRect(2, this.size[1] - 10, (this.size[0] - 4) * v, 8);


      // emoj
        var x = this.size[0] * 0.5;
        var h = this.size[1];

        ctx.textAlign = "center";
        ctx.font = (h * 0.7).toFixed(1) + "px Arial";
        ctx.fillStyle = "#EEE";
        ctx.fillText(
            this.dying ?  "💀" : this.emoji,
            x,
            h * 0.75
        );
    };

    Cell.prototype.onDrawBackground = function(ctx) {
      this.boxcolor = this.triggered
          ? Cell.on_color
          : Cell.off_color;
      this.triggered = false;

      if( this.mouseOver )
      {
        ctx.fillStyle = "#AAA";
        ctx.fillText( this.tooltip, 0, this.size[1] + 14 );
      }
    };

    Cell.prototype.onExecute = function() {
        var dt = this.graph.elapsed_time * 1000; //in ms

        var trigger = this.time == 0;

        this.time += dt;

        this.last_interval = Math.max(
            1,
            this.getInputOrProperty("interval") | 0
        );

        if (
            !trigger &&
            (this.time < this.last_interval || isNaN(this.last_interval))
        ) {
            if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
                this.setOutputData(1, false);
            }
            return;
        }

        this.triggered = true;
        this.time = this.time % this.last_interval;

        // Start Tick

        // if connected, start evolving
        if (this.getOutputNodes(0) != null)
        {
          this.evoPoints += (this.evoInc * this.getOutputNodes(0).length);

          // has hit evolution point
          if (this.evoPoints >= this.maxEvo)
          {
            var oceanNode = this.getInputNode(0);
            var planktonNode = LiteGraph.createNode('game3/Plankton');

            planktonNode.size = [100, 100];
            planktonNode.pos = [this.pos[0], this.pos[1]];
            planktonNode.time = 0;
            oceanNode.connect(0, planktonNode, 0);

            // add
            this.graph.add(planktonNode);

            // delete old
            this.graph.remove(this);
          }
        }

        else if (this.getInputNode(1) === null)// start dying
        {
          this.life -= this.lifeDec;
          if (this.life < this.minLife) {
            if (!this.dying)
            {
              this.dying = true;
              this.dyingCountdown = this.ticksToDie;
            }
            else {
              this.dyingCountdown -= 1;
              if (this.dyingCountdown <= 0)
                this.graph.remove(this);
            }
          }
        }

        this.trigger(this.emoji, this.properties.event);

        if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
            this.setOutputData(1, true);
        }
    };

    Cell.prototype.onAction = function(action, param) {
      if (action === '🌞')
      {
        this.sunEvoPoints += this.sunEvoInc;

        // has hit evolution point
        if (this.sunEvoPoints >= this.maxSunEvo)
        {
          var oceanNode = this.getInputNode(0);
          var kelpNode = LiteGraph.createNode('game3/Kelp');

          kelpNode.size = [100, 100];
          kelpNode.pos = [this.pos[0], this.pos[1]];
          kelpNode.time = 0;
          oceanNode.connect(0, kelpNode, 0);

          // add
          this.graph.add(kelpNode);

          // delete old
          this.graph.remove(this);
        }
      }

    };

    LiteGraph.registerNodeType("game3/Cell", Cell);
    }


    // 🌊: add 🌞 for life!
    {
    //Show value inside the debug console
    function Ocean() {
      this.emoji = "🌊"

      this.properties =
      {
        interval: 1000,
        event: "tick",
        min: 0,
        max: 1,
        value: 0,
        color: "#AAF"
      };

      this.addInput("🌞", LiteGraph.EVENT);

      this.MAX_SPAWNS = 5;
      this.min = 0;
      this.max = 1;
      this.value = 0;
      this.valueInc = 0.2;
      this.tooltip = "Can create " + this.MAX_SPAWNS + " 🦠"

      this.barColor = "#5b7ef0";
      this.interval = 1000;
      this.size = [100, 100];
      this.last_interval = 1000;
      this.triggered = false;

    }

    Ocean.title = "Ocean";

    Ocean.prototype.onStart = function() {
        this.time = 0;
    };

    Ocean.on_color = "#5b7ef0";
    Ocean.off_color = "#222";
    Ocean.markers_color = "#666";

    Ocean.prototype.onDrawForeground = function(ctx) {
      //border
      ctx.lineWidth = 1;
      ctx.fillStyle = this.barColor;
      var v =
          (this.value - this.min) /
          (this.max - this.min);
      v = Math.min(1, v);
      v = Math.max(0, v);
      ctx.fillRect(2, 2, (this.size[0] - 4) * v, this.size[1] - 4);

        var x = this.size[0] * 0.5;
        var h = this.size[1];

        ctx.textAlign = "center";
        ctx.font = (h * 0.7).toFixed(1) + "px Arial";
        ctx.fillStyle = "#EEE";
        ctx.fillText(
            this.emoji,
            x,
            h * 0.75
        );
    };

    Ocean.prototype.onDrawBackground = function(ctx) {
        this.boxcolor = this.triggered
            ? Ocean.on_color
            : Ocean.off_color;
        this.triggered = false;

        if( this.mouseOver )
        {
          ctx.fillStyle = "#AAA";
          ctx.fillText( this.tooltip, 0, this.size[1] + 14 );
        }
    };

    Ocean.prototype.onExecute = function() {
        var dt = this.graph.elapsed_time * 1000; //in ms

        var trigger = this.time == 0;

        this.time += dt;
        this.last_interval = Math.max(
            1,
            this.getInputOrProperty("interval") | 0
        );

        if (
            !trigger &&
            (this.time < this.last_interval || isNaN(this.last_interval))
        ) {
            if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
                this.setOutputData(1, false);
            }
            return;
        }

        this.triggered = true;
        this.time = this.time % this.last_interval;
        this.trigger("on_tick", this.properties.event);
        if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
            this.setOutputData(1, true);
        }
    };

    Ocean.prototype.onAction = function(action, param) {

      if (action === '🌞')
      {
        this.value += this.valueInc;

        if (this.value > this.max)
        {
            // spawn 🦠
            // can only spawn a max of X
            this.value = this.max;
            for (var i = 0; i < this.MAX_SPAWNS; i++)
            {
              if (this.getOutputNodes(i) === null)
                // spawn here
                {

                  if (this.getOutputData(i) === null)
                  {
                    this.addOutput("🦠", LiteGraph.EVENT);
                  }

                  var newNode = LiteGraph.createNode("game3/Cell");

                  // reset
                  this.value = this.min;
                  this.size = [100, 100];

                  newNode.pos =
                    [
                      this.pos[0] + this.size[0] + 80,
                      this.pos[1] + ((this.size[1] + 50) * i)
                  ];
                  newNode.time = 0;
                  this.connect(i, newNode, 0);
                  this.graph.add(newNode);

                  break;
                }
            }
          }
      }
    };

    LiteGraph.registerNodeType("game3/Ocean", Ocean);
    }


    // 🌞: source of all the things?!
    {
    //Show value inside the debug console
    function Sunlight() {
      this.emoji = "🌞"
      this.tooltip = "Connect me to 🌊"

      this.addProperty("interval", 1000);
      this.addProperty("event", this.emoji);
      this.addOutput(this.emoji, LiteGraph.EVENT);

      this.size = [100, 100];
      this.last_interval = 1000;
      this.triggered = false;

    }

    Sunlight.title = "Sunlight";

    Sunlight.prototype.onStart = function() {
        this.time = 0;
    };

    Sunlight.on_color = "#ffee00";
    Sunlight.off_color = "#222";
    Sunlight.markers_color = "#666";

    Sunlight.prototype.onDrawForeground = function(ctx) {
        var x = this.size[0] * 0.5;
        var h = this.size[1];

        ctx.textAlign = "center";
        ctx.font = (h * 0.7).toFixed(1) + "px Arial";
        ctx.fillStyle = "#EEE";
        ctx.fillText(
            this.emoji,
            x,
            h * 0.75
        );
    };

    Sunlight.prototype.onDrawBackground = function(ctx) {
        this.boxcolor = this.triggered
            ? Sunlight.on_color
            : Sunlight.off_color;
        this.triggered = false;

        if( this.mouseOver )
        {
          ctx.fillStyle = "#AAA";
          ctx.fillText( this.tooltip, 0, this.size[1] + 14 );
        }
    };

    Sunlight.prototype.onExecute = function() {
        var dt = this.graph.elapsed_time * 1000; //in ms

        var trigger = this.time == 0;

        this.time += dt;

        this.last_interval = Math.max(
            1,
            this.getInputOrProperty("interval") | 0
        );

        if (
            !trigger &&
            (this.time < this.last_interval || isNaN(this.last_interval))
        ) {
            if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
                this.setOutputData(1, false);
            }
            return;
        }

        this.triggered = true;
        this.time = this.time % this.last_interval;
        this.trigger(this.emoji, this.properties.event);
        if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
            this.setOutputData(1, true);
        }
    };

    LiteGraph.registerNodeType("game3/Sunlight", Sunlight);
    }

  })(this);
