
/* =====================================================
   POCKETLAB MATHEMATICS
   STEM FOR IMPACT 2026
   COMPLETE maths.js
   PHYSICS-STYLE UNIFORM DESIGN
   ===================================================== */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const TAU = Math.PI * 2;

  const LABS = [
    {
      id: "graph",
      icon: "📈",
      title: "Graph Explorer",
      desc: "Explore linear, quadratic and sine functions.",
      formula: "Linear: y = mx + c; Quadratic: y = ax² + bx + c",
      explanation: "A mathematical graph illustrates how one variable changes with another. Change the coefficients to observe different curves.",
      controls: [
        ["kind", "Graph Type", 1, 3, 1, 1, ""],
        ["a", "Coefficient a", 1, 5, 2, 0.5, ""],
        ["b", "Coefficient b", -5, 5, 1, 0.5, ""]
      ],
      quiz: [
        ["What is the graph of a linear function?", "Straight line", "Circle", "Parabola", "Ellipse"],
        ["What shape does a quadratic function produce?", "Parabola", "Square", "Triangle", "Cube"],
        ["Which function is periodic?", "Sine", "Linear", "Quadratic", "Constant"],
        ["What does m mean in y = mx + c?", "Slope", "Radius", "Area", "Volume"],
        ["What is the y-intercept of y = 2x + 3?", "3", "2", "5", "0"]
      ]
    },
    {
      id: "quadratic",
      icon: "📉",
      title: "Quadratic Equations",
      desc: "Visualize roots, the vertex and the discriminant.",
      formula: "x = (−b ± √(b² − 4ac)) / 2a",
      explanation: "A quadratic graph is a parabola. The discriminant b² − 4ac determines the number of distinct real roots.",
      controls: [
        ["a", "Coefficient a", 1, 5, 1, 1, ""],
        ["b", "Coefficient b", -8, 8, -2, 1, ""],
        ["c", "Coefficient c", -8, 8, -3, 1, ""]
      ],
      quiz: [
        ["What is the highest power in a quadratic equation?", "2", "1", "3", "4"],
        ["A quadratic graph is a...", "Parabola", "Circle", "Straight line", "Hyperbola always"],
        ["What is the discriminant?", "b² − 4ac", "a + b", "2a", "b² + 4ac"],
        ["A positive discriminant gives...", "Two distinct real roots", "No real roots", "One repeated root", "Four roots"],
        ["What is the vertex?", "Turning point", "Always the origin", "Y-axis", "Radius"]
      ]
    },
    {
      id: "geometry",
      icon: "📐",
      title: "Interactive Geometry",
      desc: "Explore the area and circumference of circles.",
      formula: "Area = πr²; Circumference = 2πr",
      explanation: "The radius determines the size of a circle. Doubling the radius doubles the circumference but multiplies the area by four.",
      controls: [
        ["radius", "Radius", 1, 10, 5, 0.5, " units"]
      ],
      quiz: [
        ["What is the area of a circle?", "πr²", "2πr", "r²", "πd²"],
        ["What is the circumference formula?", "2πr", "πr²", "r³", "2r²"],
        ["The diameter is...", "Twice the radius", "Half the radius", "Equal to area", "Equal to volume"],
        ["If radius doubles, area becomes...", "Four times", "Twice", "Half", "Eight times"],
        ["Approximately what is π?", "3.14", "2.14", "4.13", "1.41"]
      ]
    },
    {
      id: "trig",
      icon: "📊",
      title: "Trigonometry Simulator",
      desc: "Explore sine, cosine and tangent on a unit circle.",
      formula: "sin θ = opposite/hypotenuse; cos θ = adjacent/hypotenuse",
      explanation: "Trigonometric functions relate angles to ratios of sides in right triangles. The unit circle also shows sine and cosine as coordinates.",
      controls: [
        ["angle", "Angle", 0, 360, 45, 5, "°"]
      ],
      quiz: [
        ["sin θ is...", "Opposite/Hypotenuse", "Adjacent/Hypotenuse", "Opposite/Adjacent", "Hypotenuse/Opposite"],
        ["cos 0° equals...", "1", "0", "-1", "2"],
        ["sin 90° equals...", "1", "0", "-1", "0.5"],
        ["tan 45° equals...", "1", "0", "2", "Undefined"],
        ["Which units are commonly used for angles?", "Degrees and radians", "Metres only", "Litres", "Kilograms"]
      ]
    },
    {
      id: "pythagoras",
      icon: "📏",
      title: "Pythagoras Theorem",
      desc: "Change the sides of a right triangle.",
      formula: "a² + b² = c²",
      explanation: "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.",
      controls: [
        ["a", "Side a", 2, 12, 3, 1, " units"],
        ["b", "Side b", 2, 12, 4, 1, " units"]
      ],
      quiz: [
        ["Pythagoras theorem is...", "a² + b² = c²", "a + b = c", "ab = c", "a² − b² = c²"],
        ["The longest side is called...", "Hypotenuse", "Radius", "Diameter", "Base always"],
        ["For sides 3 and 4, hypotenuse is...", "5", "6", "7", "12"],
        ["The theorem applies to...", "Right triangles", "All circles", "All quadrilaterals", "All triangles equally"],
        ["A right angle measures...", "90°", "45°", "180°", "60°"]
      ]
    },
    {
      id: "probability",
      icon: "🎲",
      title: "Probability Laboratory",
      desc: "Run animated coin tosses and compare outcomes.",
      formula: "Experimental P(H) = Heads / Total tosses",
      explanation: "Probability measures the likelihood of an event. For a fair coin, the theoretical probability of heads is 1/2. Experimental values may differ.",
      controls: [
        ["speed", "Tosses per second", 1, 10, 3, 1, ""]
      ],
      quiz: [
        ["Probability of heads for a fair coin?", "1/2", "1", "0", "1/4"],
        ["Probability must lie between...", "0 and 1", "1 and 10", "-5 and 5", "2 and 5"],
        ["What is an impossible event's probability?", "0", "1", "0.5", "2"],
        ["What is a certain event's probability?", "1", "0", "0.5", "10"],
        ["More coin tosses often bring experimental probability closer to...", "Theoretical probability", "Always zero", "Always one", "Negative one"]
      ]
    },
    {
      id: "statistics",
      icon: "📊",
      title: "Statistics Visualizer",
      desc: "Explore bar charts, mean, median and range.",
      formula: "Mean = Sum of observations / Number of observations",
      explanation: "Statistics helps describe data. Mean is an arithmetic average, median is the middle value of sorted data, and range is maximum minus minimum.",
      controls: [
        ["value", "Change third data value", 1, 20, 8, 1, ""]
      ],
      quiz: [
        ["What is the mean?", "Arithmetic average", "Largest value", "Smallest value", "Range"],
        ["What is the median?", "Middle sorted value", "Always largest value", "Total sum", "Count"],
        ["What is the range?", "Maximum − Minimum", "Maximum + Minimum", "Sum/Count", "Median/2"],
        ["Mean of 2, 4 and 6 is...", "4", "6", "3", "12"],
        ["Which graph compares categories?", "Bar chart", "Only a circle", "Number line only", "None"]
      ]
    },
    {
      id: "transform",
      icon: "🔄",
      title: "Geometric Transformations",
      desc: "Translate, rotate and scale a shape.",
      formula: "Rotation: x′ = x cosθ − y sinθ; y′ = x sinθ + y cosθ",
      explanation: "Transformations change the position, size or orientation of shapes. Translation shifts, rotation turns, and scaling changes size.",
      controls: [
        ["rotation", "Rotation", 0, 360, 45, 5, "°"],
        ["scale", "Scale", 0.5, 2, 1, 0.1, "×"],
        ["shift", "Horizontal Translation", -5, 5, 0, 1, " units"]
      ],
      quiz: [
        ["Which transformation turns a shape?", "Rotation", "Translation", "Reflection only", "Addition"],
        ["Which transformation changes size?", "Scaling", "Translation", "Rotation", "Reflection"],
        ["Translation means...", "Moving without turning or resizing", "Always rotating", "Changing colour", "Finding area"],
        ["A 90° rotation is...", "Quarter turn", "Half turn", "Full turn", "Three full turns"],
        ["A scale factor of 2...", "Doubles side lengths", "Halves lengths", "Only moves shape", "Makes area unchanged"]
      ]
    },
    {
      id: "calculus",
      icon: "📈",
      title: "Calculus — Derivatives",
      desc: "Watch tangent lines change along a curve.",
      formula: "If f(x) = x², then f′(x) = 2x",
      explanation: "A derivative measures instantaneous rate of change. Its value represents the slope of the tangent line at a point.",
      controls: [
        ["x", "Position x", -5, 5, 2, 0.5, ""]
      ],
      quiz: [
        ["Derivative of x² is...", "2x", "x", "x³", "2"],
        ["A derivative represents...", "Instantaneous rate of change", "Only total area", "Only volume", "Probability"],
        ["Derivative of a constant is...", "0", "1", "x", "∞"],
        ["Slope of tangent to y=x² at x=3?", "6", "3", "9", "12"],
        ["At x=0, derivative of x² is...", "0", "1", "2", "-1"]
      ]
    },
    {
      id: "fractions",
      icon: "🍕",
      title: "Fractions Visualizer",
      desc: "Compare fractions using coloured circular sectors.",
      formula: "Fraction = Numerator / Denominator",
      explanation: "Fractions represent parts of a whole. A fraction can be displayed as a portion of a circle divided into equal sectors.",
      controls: [
        ["num", "Numerator", 0, 10, 2, 1, ""],
        ["den", "Denominator", 1, 10, 5, 1, ""]
      ],
      quiz: [
        ["In 3/4, the numerator is...", "3", "4", "7", "1"],
        ["In 3/4, the denominator is...", "4", "3", "7", "1"],
        ["1/2 equals...", "0.5", "0.25", "2", "0.1"],
        ["Which is equivalent to 1/2?", "2/4", "1/4", "3/4", "1/3"],
        ["A proper fraction has...", "Numerator smaller than denominator", "Larger numerator always", "Denominator zero", "No numerator"]
      ]
    }
  ];

  const labById = Object.fromEntries(
    LABS.map(lab => [lab.id, lab])
  );

  let active = null;
  let animationId = null;
  let previousTime = 0;
  let originalChildren = [];

  function safe(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  /* =========================================
     SAME VISUAL STYLE AS PHYSICS
     ========================================= */

  function installStyles() {
    if ($("pmathStyles")) return;

    const style = document.createElement("style");
    style.id = "pmathStyles";

    style.textContent = `
      .pmath-card {
        min-height:375px;
        padding:15px;
        display:flex;
        flex-direction:column;
        gap:13px;
        box-sizing:border-box;
        color:#eff7ff;
        background:linear-gradient(145deg,#112640,#0b192e);
        border:1px solid #315b83;
        border-radius:16px;
      }
      .pmath-card .pmath-preview {
        height:145px;
        border-radius:12px;
        border:1px solid #287eac;
        background:radial-gradient(circle,#174e77,#071a32);
        display:grid;
        place-items:center;
      }
      .pmath-card .pmath-orb {
        width:112px;
        height:112px;
        border-radius:50%;
        border:1px solid #2a6a96;
        box-shadow:0 0 35px #138cda44;
        display:grid;
        place-items:center;
        font-size:53px;
      }
      .pmath-card .pmath-tag {
        color:#42efb9;
        font-size:11px;
        font-weight:800;
        letter-spacing:.04em;
      }
      .pmath-card h3 {
        margin:0;
        font-size:17px;
        color:#ffffff;
      }
      .pmath-card p {
        margin:0;
        font-size:13px;
        line-height:1.6;
        color:#acc2d8;
      }
      .pmath-card .pmath-footer {
        margin-top:auto;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:8px;
      }
      .pmath-card small {
        font-size:10px;
        color:#adc6dc;
      }
      .pmath-card button {
        padding:11px 16px;
        border-radius:9px;
        border:1px solid #69bfff;
        background:linear-gradient(90deg,#168dff,#2962df);
        color:white;
        font-size:13px;
        font-weight:800;
        cursor:pointer;
        white-space:nowrap;
        box-shadow:0 0 12px #138dff44;
      }
      #pmathWorkspace {
        max-width:1450px;
        margin:auto;
        padding:18px 12px;
        color:#f2f7ff;
      }
      #pmathBack {
        display:inline-block;
        padding:8px 0;
        margin-bottom:20px;
        border:0;
        background:transparent;
        color:#4ae7f3;
        font-size:14px;
        font-weight:800;
        cursor:pointer;
      }
      .pmath-eyebrow {
        font-size:11px;
        color:#47e8f3;
        letter-spacing:.17em;
        font-weight:800;
      }
      #pmathWorkspace h1 {
        font-size:clamp(27px,3vw,40px);
        margin:15px 0;
      }
      .pmath-intro {
        color:#afc5d9;
        margin-bottom:28px;
      }
      .pmath-layout {
        display:grid;
        grid-template-columns:minmax(0,1.6fr) minmax(320px,1fr);
        align-items:start;
        gap:22px;
      }
      .pmath-panel {
        min-width:0;
        border:1px solid #315c80;
        border-radius:19px;
        padding:23px;
        background:linear-gradient(145deg,#152741,#0e1c32);
      }
      .pmath-head {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:8px;
        padding-bottom:17px;
        margin-bottom:16px;
        border-bottom:1px solid #294a69;
        font-size:17px;
        font-weight:800;
      }
      .pmath-live {
        color:#47eabb;
        font-size:11px;
        font-weight:800;
      }
      #pmathCanvas {
        width:100%;
        height:auto;
        display:block;
        background:#0b2544;
        border-radius:15px;
        border:1px solid #287ba7;
      }
      .pmath-buttons {
        margin-top:15px;
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:10px;
      }
      .pmath-btn {
        padding:12px 17px;
        border-radius:9px;
        border:1px solid #69bfff;
        color:white;
        background:#2678e5;
        font-weight:800;
        cursor:pointer;
      }
      .pmath-btn:disabled {
        opacity:.4;
        cursor:not-allowed;
      }
      .pmath-start {background:#06ae9e}
      .pmath-pause {background:#245789}
      .pmath-stop {background:#d5404b}
      .pmath-reset {background:#35546e}
      .pmath-control {margin:17px 0 26px}
      .pmath-control label {
        display:block;
        margin-bottom:12px;
        font-size:13px;
        font-weight:700;
        color:#c4d9ec;
      }
      .pmath-control input {
        width:100%;
        accent-color:#208eff;
        cursor:pointer;
      }
      .pmath-readings {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:11px;
        background:#102d4a;
        border:1px solid #2b6285;
        padding:15px;
        border-radius:14px;
      }
      .pmath-reading {
        min-height:83px;
        padding:13px;
        border:1px solid #2e698f;
        border-radius:11px;
        background:#0e2b47;
        overflow-wrap:anywhere;
      }
      .pmath-reading small {
        display:block;
        font-size:12px;
        color:#bfd3e6;
      }
      .pmath-reading strong {
        display:block;
        font-size:19px;
        margin-top:12px;
        color:#47e6f0;
      }
      .pmath-formula {
        margin-top:22px;
        padding:19px;
        border:1px solid #2b7494;
        border-radius:13px;
        background:#102e49;
      }
      .pmath-formula h3 {color:#65ede8}
      #pmathFormula {
        display:block;
        font-size:20px;
        color:#ffdd79;
        line-height:1.7;
        overflow-wrap:anywhere;
      }
      .pmath-complete {
        display:block;
        width:100%;
        margin-top:15px;
        padding:14px;
        border:0;
        border-radius:9px;
        background:linear-gradient(90deg,#937afa,#6955e1);
        color:#fff;
        font-weight:800;
        cursor:pointer;
      }
      .pmath-bottom {
        margin-top:20px;
        padding:23px;
        background:#102742;
        border:1px solid #2b6a90;
        border-radius:17px;
        line-height:1.7;
      }
      .pmath-bottom h3 {color:#65f0e7}
      .pmath-option {
        display:block;
        width:100%;
        padding:14px;
        margin:8px 0;
        text-align:left;
        border-radius:9px;
        border:1px solid #4185ad;
        background:#1c4366;
        color:white;
        cursor:pointer;
      }
      .pmath-option:disabled {cursor:default}
      .pmath-chat {
        padding:13px;
        margin:9px 0;
        border-radius:9px;
        background:#1d4465;
        white-space:pre-wrap;
      }
      #pmathAskText {
        box-sizing:border-box;
        width:100%;
        min-height:85px;
        padding:12px;
        border:1px solid #39749a;
        background:#091f35;
        color:white;
        border-radius:10px;
        resize:vertical;
      }
      @media(max-width:900px) {
        .pmath-layout {grid-template-columns:1fr}
        .pmath-panel {padding:14px}
      }
    `;

    document.head.appendChild(style);
  }

  /* =========================================
     CREATE UNIFORM MATHS CARDS
     ========================================= */

  function createCards() {
    const page = $("laboratory");
    if (!page) return;

    const existingCards = [
      ...page.querySelectorAll(".experiment-card")
    ];

    // Find the original Graph Explorer.
    const original = existingCards.find(card =>
      card.dataset.category === "mathematics" &&
      /Graph Explorer/i.test(card.textContent)
    );

    let grid = original?.parentElement ||
      existingCards[0]?.parentElement;

    if (!grid) {
      grid = $("pmathFallback");

      if (!grid) {
        grid = document.createElement("div");
        grid.id = "pmathFallback";
        grid.style.cssText =
          "display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:16px";
        page.appendChild(grid);
      }
    }

    LABS.forEach(lab => {
      let card = $("pmathCard-" + lab.id);

      if (!card && lab.id === "graph" && original) {
        card = original;
      }

      if (!card) {
        card = document.createElement("article");
        grid.appendChild(card);
      }

      card.id = "pmathCard-" + lab.id;
      card.className = "experiment-card pmath-card";
      card.dataset.category = "mathematics";
      card.dataset.recommended =
        "primary middle secondary senior college";

      card.innerHTML = `
        <div class="pmath-preview">
          <div class="pmath-orb">${lab.icon}</div>
        </div>

        <span class="pmath-tag">● ANIMATED LAB</span>

        <h3>${safe(lab.title)}</h3>
        <p>${safe(lab.desc)}</p>

        <div class="pmath-footer">
          <small>Mathematics · Live Animation</small>
          <button type="button" data-pmath="${lab.id}">
            ▶ Start
          </button>
        </div>
      `;
    });

    updateFilter();
  }

  function updateFilter() {
    const subject = $("experimentFilter")?.value || "all";

    document.querySelectorAll(".pmath-card")
      .forEach(card => {
        const visible =
          subject === "all" || subject === "mathematics";

        card.classList.toggle("hidden", !visible);
        card.style.display = visible ? "flex" : "none";
      });
  }

  /* =========================================
     EXPERIMENT WORKSPACE
     ========================================= */

  function pause() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    previousTime = 0;
    if (active) active.running = false;
  }

  function restore() {
    pause();

    originalChildren.forEach(item => {
      item.node.style.display = item.display;
    });

    originalChildren = [];
    $("pmathWorkspace")?.remove();
    active = null;
  }

  function createWorkspace() {
    const page = $("experimentWorkspace");
    if (!page) return false;
    if ($("pmathWorkspace")) return true;

    originalChildren = Array.from(page.children).map(node => ({
      node,
      display: node.style.display
    }));

    originalChildren.forEach(item => {
      item.node.style.display = "none";
    });

    const root = document.createElement("div");
    root.id = "pmathWorkspace";

    root.innerHTML = `
      <button id="pmathBack" type="button">
        ← Back to Laboratory
      </button>

      <div class="pmath-eyebrow">
        INTERACTIVE VIRTUAL EXPERIMENT
      </div>

      <h1 id="pmathTitle"></h1>
      <p class="pmath-intro" id="pmathDescription"></p>

      <div class="pmath-layout">
        <section class="pmath-panel">
          <div class="pmath-head">
            <span>Simulation Workspace</span>
            <span class="pmath-live">● INTERACTIVE</span>
          </div>

          <canvas id="pmathCanvas"
            width="1000" height="500"></canvas>

          <div class="pmath-buttons">
            <button class="pmath-btn pmath-start"
              data-pmath-action="start">▶ Start</button>

            <button class="pmath-btn pmath-pause"
              data-pmath-action="pause">⏸ Pause</button>

            <button class="pmath-btn pmath-stop"
              data-pmath-action="stop">■ Stop</button>

            <button class="pmath-btn pmath-reset"
              data-pmath-action="reset">↻ Reset</button>
          </div>
        </section>

        <section class="pmath-panel">
          <div class="pmath-head">
            <span>Experiment Controls</span>
            <span class="pmath-live">● LIVE</span>
          </div>

          <div id="pmathControls"></div>
          <div class="pmath-readings" id="pmathReadings"></div>

          <p style="font-size:12px;color:#aec4d9">
            Adjust the controls to investigate the
            mathematical relationships.
          </p>

          <div class="pmath-formula">
            <h3>📐 Experiment Formula</h3>
            <strong id="pmathFormula"></strong>
            <p id="pmathFormulaNote"></p>
          </div>

          <button class="pmath-complete"
            id="pmathComplete">
            Complete Experiment ✓
          </button>
        </section>
      </div>

      <section class="pmath-bottom">
        <h3>📖 Mathematics Behind the Experiment</h3>
        <p id="pmathScience"></p>
      </section>

      <section class="pmath-bottom">
        <h3>🧠 Five Quick MCQs</h3>

        <p id="pmathQuizProgress"></p>
        <h3 id="pmathQuizTitle"></h3>
        <div id="pmathQuizOptions"></div>
        <p id="pmathQuizFeedback"></p>

        <button class="pmath-btn"
          id="pmathNext" disabled>
          Next question →
        </button>

        <hr style="border:0;border-top:1px solid #315b7c;margin:25px 0">

        <h3>💬 Ask PocketLab Tutor</h3>
        <p>Offline Mathematics help about this experiment.</p>

        <div id="pmathChat"></div>

        <form id="pmathTutorForm">
          <textarea id="pmathAskText" required
            maxlength="500"
            placeholder="Ask about the formula, variables or results..."></textarea>

          <button type="submit" class="pmath-btn">
            ➤ Send
          </button>
        </form>
      </section>
    `;

    page.appendChild(root);

    $("pmathBack").onclick = () => {
      restore();

      if (typeof navigate === "function") {
        navigate("laboratory");
      } else {
        document.querySelectorAll(".page")
          .forEach(page => page.classList.remove("active"));

        $("laboratory")?.classList.add("active");
      }
    };

    root.addEventListener("click", event => {
      const button = event.target.closest("[data-pmath-action]");
      if (!button) return;

      const action = button.dataset.pmathAction;

      if (action === "start") play();
      if (action === "pause") pause();

      if (action === "stop") {
        pause();

        if (active) {
          active.time = 0;
          active.tosses = 0;
          active.heads = 0;
        }

        draw();
      }

      if (action === "reset") {
        reset();
      }
    });

    $("pmathNext").onclick = nextQuestion;

    $("pmathTutorForm").onsubmit = event => {
      event.preventDefault();
      answerStudent();
    };

    $("pmathComplete").onclick = () => {
      if (!active) return;

      try {
        localStorage.setItem(
          "pocketlab-maths-" + active.lab.id,
          "complete"
        );
      } catch (_) {}

      $("pmathComplete").textContent =
        "Experiment Completed ✓";
    };

    return true;
  }

  function openLab(id) {
    const lab = labById[id];
    if (!lab) return;

    pause();
    if (!createWorkspace()) return;

    active = {
      lab,
      p: {},
      time: 0,
      running: false,
      quizIndex: 0,
      score: 0,
      answered: false,
      tosses: 0,
      heads: 0
    };

    lab.controls.forEach(control => {
      active.p[control[0]] = control[4];
    });

    $("pmathTitle").textContent = lab.title;
    $("pmathDescription").textContent = lab.desc;
    $("pmathFormula").textContent = lab.formula;
    $("pmathFormulaNote").textContent = lab.explanation;
    $("pmathScience").textContent = lab.explanation;
    $("pmathChat").innerHTML = "";

    $("pmathComplete").textContent =
      "Complete Experiment ✓";

    const controls = $("pmathControls");
    controls.innerHTML = "";

    lab.controls.forEach(
      ([key, label, min, max, value, step, unit]) => {
        const group = document.createElement("div");
        group.className = "pmath-control";

        const title = document.createElement("label");
        const input = document.createElement("input");

        input.type = "range";
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = value;

        const updateTitle = () => {
          let display = input.value + unit;

          if (lab.id === "graph" && key === "kind") {
            display = ["", "Linear", "Quadratic", "Sine"][+input.value];
          }

          title.textContent = label + ": " + display;
        };

        input.oninput = () => {
          if (!active) return;

          active.p[key] = Number(input.value);

          if (lab.id === "fractions") {
            active.p.num = Math.min(
              active.p.num, active.p.den
            );
          }

          updateTitle();
          draw();
        };

        updateTitle();
        group.append(title, input);
        controls.appendChild(group);
      }
    );

    showQuestion();
    draw();

    if (typeof navigate === "function") {
      navigate("experimentWorkspace");
    } else {
      document.querySelectorAll(".page")
        .forEach(page => page.classList.remove("active"));

      $("experimentWorkspace")?.classList.add("active");
    }
  }

  /* =========================================
     ANIMATION ENGINE
     ========================================= */

  function play() {
    if (!active || active.running) return;

    active.running = true;
    previousTime = 0;
    animationId = requestAnimationFrame(tick);
  }

  function tick(timestamp) {
    if (!active || !active.running) return;

    if (previousTime) {
      const dt = Math.min(
        (timestamp - previousTime) / 1000,
        0.05
      );

      const previous = active.time;
      active.time += dt;

      if (active.lab.id === "probability") {
        const speed = active.p.speed;

        const before = Math.floor(previous * speed);
        const after = Math.floor(active.time * speed);

        for (let i = before; i < after; i++) {
          active.tosses++;

          if (Math.random() < 0.5) {
            active.heads++;
          }
        }
      }
    }

    previousTime = timestamp;

    draw();
    animationId = requestAnimationFrame(tick);
  }

  function reset() {
    if (!active) return;

    const id = active.lab.id;
    pause();
    openLab(id);
  }

  /* =========================================
     MATHEMATICAL VISUALIZATIONS
     ========================================= */

  function draw() {
    if (!active) return;

    const canvas = $("pmathCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const s = active;
    const p = s.p;
    const t = s.time;

    const W = 1000;
    const H = 500;

    ctx.clearRect(0, 0, W, H);

    const background = ctx.createRadialGradient(
      500, 240, 30, 500, 240, 650
    );

    background.addColorStop(0, "#164971");
    background.addColorStop(1, "#07182f");

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#2e628044";
    ctx.lineWidth = 1;

    for (let x = 0; x < W; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    for (let y = 0; y < H; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    function circle(x, y, radius, fill, stroke = "#a5eaff") {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function line(x, y, xx, yy, color = "#89eaff", width = 3) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(xx, yy);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    function text(value, x, y, size = 21, color = "#effaff") {
      ctx.font = `bold ${size}px Arial`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(String(value), x, y);
    }

    function reading(label, value) {
      return `
        <div class="pmath-reading">
          <small>${safe(label)}</small>
          <strong>${safe(value)}</strong>
        </div>
      `;
    }

    function axes(scale = 45) {
      line(90, 250, 910, 250, "#70b4e3", 2);
      line(500, 70, 500, 435, "#70b4e3", 2);

      text("x", 929, 257, 17);
      text("y", 500, 57, 17);

      return {
        X: value => 500 + value * scale,
        Y: value => 250 - value * scale
      };
    }

    function plot(fn, color = "#64eaff", scale = 45) {
      const a = axes(scale);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 5;

      let started = false;

      for (let x = -9; x <= 9; x += 0.035) {
        const y = fn(x);
        const px = a.X(x);
        const py = a.Y(y);

        if (!Number.isFinite(py) || Math.abs(py) > 5000) {
          started = false;
          continue;
        }

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }

      ctx.stroke();
    }

    let readings = "";

    /* GRAPH EXPLORER */

    if (s.lab.id === "graph") {
      text("FUNCTION GRAPH EXPLORER",
        500, 42, 26, "#91efff");

      let equation;

      if (p.kind === 1) {
        equation = x => p.a * x + p.b;
      } else if (p.kind === 2) {
        equation = x => p.a * x * x + p.b * x;
      } else {
        equation = x => p.a * Math.sin(x) + p.b;
      }

      plot(equation, "#66eeff");

      const markerX = Math.sin(t) * 4;
      const markerY = equation(markerX);

      circle(
        500 + markerX * 45,
        250 - markerY * 45,
        10,
        "#ffe477"
      );

      readings += reading("Function",
        ["", "Linear", "Quadratic", "Sine"][p.kind]);

      readings += reading("Coefficient a", p.a);
      readings += reading("Coefficient b", p.b);
      readings += reading("f(0)", equation(0).toFixed(2));
    }

    /* QUADRATIC EQUATIONS */

    if (s.lab.id === "quadratic") {
      text("QUADRATIC EQUATION",
        500, 42, 26, "#91efff");

      const fn = x => p.a * x * x + p.b * x + p.c;

      plot(fn, "#6af0ff", 40);

      const D = p.b * p.b - 4 * p.a * p.c;
      const vertexX = -p.b / (2 * p.a);
      const vertexY = fn(vertexX);

      circle(
        500 + vertexX * 40,
        250 - vertexY * 40,
        9,
        "#ffe27b"
      );

      readings += reading("Discriminant", D.toFixed(2));
      readings += reading("Vertex x", vertexX.toFixed(2));
      readings += reading("Vertex y", vertexY.toFixed(2));
      readings += reading("Real roots",
        D > 0 ? "2 distinct" : D === 0 ? "1 repeated" : "None");
    }

    /* GEOMETRY */

    if (s.lab.id === "geometry") {
      text("AREA AND CIRCUMFERENCE",
        500, 42, 26, "#91efff");

      const r = p.radius;
      const radiusPx = r * 19;

      circle(500, 260, radiusPx, "#226da877", "#62e6ff");
      line(500, 260, 500 + radiusPx, 260, "#ffe17c", 5);

      text("r = " + r, 500 + radiusPx / 2,
        245, 19, "#ffe17c");

      readings += reading("Radius", r + " units");
      readings += reading("Diameter", (2 * r).toFixed(2));
      readings += reading("Area", (PI * r * r).toFixed(2));
      readings += reading("Circumference",
        (2 * PI * r).toFixed(2));
    }

    /* TRIGONOMETRY */

    if (s.lab.id === "trig") {
      text("TRIGONOMETRY UNIT CIRCLE",
        500, 42, 26, "#91efff");

      const radius = 165;
      const theta = p.angle * PI / 180;

      circle(500, 270, radius, "#155b8b22", "#69e5ff");

      line(290, 270, 710, 270, "#8dc4e9", 2);
      line(500, 90, 500, 455, "#8dc4e9", 2);

      const px = 500 + radius * Math.cos(theta);
      const py = 270 - radius * Math.sin(theta);

      line(500, 270, px, py, "#ffe17b", 5);
      line(px, py, px, 270, "#ff6b9f", 3);
      line(500, 270, px, 270, "#67e6d6", 3);
      circle(px, py, 10, "#ffe17b");

      readings += reading("Angle", p.angle + "°");
      readings += reading("sin θ",
        Math.sin(theta).toFixed(3));
      readings += reading("cos θ",
        Math.cos(theta).toFixed(3));

      readings += reading("tan θ",
        Math.abs(Math.cos(theta)) < 1e-10
          ? "Undefined"
          : Math.tan(theta).toFixed(3));
    }

    /* PYTHAGORAS */

    if (s.lab.id === "pythagoras") {
      text("PYTHAGORAS THEOREM",
        500, 42, 26, "#91efff");

      const factor = 230 / Math.max(p.a, p.b, 1);

      const ax = 330;
      const ay = 410;
      const bx = ax + p.a * factor;
      const cy = ay - p.b * factor;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, ay);
      ctx.lineTo(ax, cy);
      ctx.closePath();

      ctx.fillStyle = "#2779b455";
      ctx.fill();
      ctx.strokeStyle = "#70edff";
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.strokeRect(ax, ay - 22, 22, 22);

      const hyp = Math.sqrt(p.a * p.a + p.b * p.b);

      text("a = " + p.a, (ax + bx) / 2, ay + 28, 20);
      text("b = " + p.b, ax - 55, (ay + cy) / 2, 20);
      text("c = " + hyp.toFixed(2), (ax + bx) / 2,
        (ay + cy) / 2 - 18, 20, "#ffe17b");

      readings += reading("Side a", p.a);
      readings += reading("Side b", p.b);
      readings += reading("Hypotenuse", hyp.toFixed(3));
      readings += reading("a² + b²",
        p.a * p.a + p.b * p.b);
    }

    /* PROBABILITY */

    if (s.lab.id === "probability") {
      text("COIN TOSS PROBABILITY",
        500, 42, 26, "#91efff");

      const result = s.tosses === 0
        ? "?"
        : (s.heads + (s.tosses - s.heads)) % 2 === 0
          ? "H" : "T";

      const width = 125 + Math.abs(Math.sin(t * 9)) * 35;

      ctx.save();
      ctx.translate(500, 230);
      ctx.scale(width / 155, 1);
      circle(0, 0, 125, "#e4b848", "#ffe59d");
      text(result, 0, 16, 60, "#573b15");
      ctx.restore();

      const tails = s.tosses - s.heads;

      readings += reading("Total tosses", s.tosses);
      readings += reading("Heads", s.heads);
      readings += reading("Tails", tails);

      readings += reading("Experimental P(H)",
        s.tosses
          ? (s.heads / s.tosses).toFixed(3)
          : "—");
    }

    /* STATISTICS */

    if (s.lab.id === "statistics") {
      text("STATISTICS BAR CHART",
        500, 42, 26, "#91efff");

      const values = [4, 7, p.value, 12, 6];
      const labels = ["A", "B", "C", "D", "E"];

      values.forEach((value, i) => {
        const h = value * 15;
        const x = 180 + i * 142;

        ctx.fillStyle = ["#52c4fa", "#48d5ae",
          "#ffe078", "#aa83f4", "#ff879e"][i];

        ctx.fillRect(x, 395 - h, 85, h);

        text(String(value), x + 42, 385 - h, 19);
        text(labels[i], x + 42, 425, 19);
      });

      const sorted = [...values].sort((a, b) => a - b);
      const total = values.reduce((a, b) => a + b, 0);

      readings += reading("Mean", (total / 5).toFixed(2));
      readings += reading("Median", sorted[2]);
      readings += reading("Range",
        Math.max(...values) - Math.min(...values));
      readings += reading("Total", total);
    }

    /* TRANSFORMATIONS */

    if (s.lab.id === "transform") {
      text("GEOMETRIC TRANSFORMATIONS",
        500, 42, 26, "#91efff");

      const theta = p.rotation * PI / 180;

      // Original shape
      ctx.beginPath();
      ctx.moveTo(250, 330);
      ctx.lineTo(370, 330);
      ctx.lineTo(310, 205);
      ctx.closePath();
      ctx.fillStyle = "#5f90df55";
      ctx.fill();
      ctx.strokeStyle = "#71b9ff";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Transformed shape
      const points = [
        [-60, 60], [60, 60], [0, -65]
      ];

      ctx.beginPath();

      points.forEach(([x, y], i) => {
        const xx = (x * Math.cos(theta) -
          y * Math.sin(theta)) * p.scale;

        const yy = (x * Math.sin(theta) +
          y * Math.cos(theta)) * p.scale;

        const sx = 700 + p.shift * 20 + xx;
        const sy = 265 + yy;

        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });

      ctx.closePath();
      ctx.fillStyle = "#56e0bc66";
      ctx.fill();
      ctx.strokeStyle = "#6cf4d5";
      ctx.lineWidth = 5;
      ctx.stroke();

      text("Original", 310, 395, 20);
      text("Transformed", 700, 395, 20);

      readings += reading("Rotation", p.rotation + "°");
      readings += reading("Scale factor", p.scale + "×");
      readings += reading("Translation", p.shift);
      readings += reading("Area scale", (p.scale ** 2).toFixed(2) + "×");
    }

    /* CALCULUS */

    if (s.lab.id === "calculus") {
      text("DERIVATIVES AND TANGENTS",
        500, 42, 26, "#91efff");

      const scale = 35;

      plot(x => x * x, "#64e9ff", scale);

      const x = p.x;
      const y = x * x;
      const slope = 2 * x;

      const X = value => 500 + value * scale;
      const Y = value => 250 - value * scale;

      line(
        X(x - 3), Y(y - slope * 3),
        X(x + 3), Y(y + slope * 3),
        "#ffe171", 5
      );

      circle(X(x), Y(y), 10, "#ffe171");

      readings += reading("x", x);
      readings += reading("f(x)", y.toFixed(2));
      readings += reading("f′(x)", slope.toFixed(2));
      readings += reading("Tangent slope", slope.toFixed(2));
    }

    /* FRACTIONS */

    if (s.lab.id === "fractions") {
      text("FRACTIONS VISUALIZER",
        500, 42, 26, "#91efff");

      const den = p.den;
      const num = Math.min(p.num, den);
      const radius = 170;

      for (let i = 0; i < den; i++) {
        const start = -PI / 2 + i * TAU / den;
        const end = start + TAU / den;

        ctx.beginPath();
        ctx.moveTo(500, 260);
        ctx.arc(500, 260, radius, start, end);
        ctx.closePath();

        ctx.fillStyle =
          i < num ? "#45d5e4" : "#183b61";

        ctx.fill();
        ctx.strokeStyle = "#e6f9ff";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      text(num + " / " + den, 500, 470, 29, "#ffe17b");

      readings += reading("Numerator", num);
      readings += reading("Denominator", den);
      readings += reading("Decimal", (num / den).toFixed(3));
      readings += reading("Percentage",
        (num / den * 100).toFixed(1) + "%");
    }

    readings += reading("Status",
      s.running ? "Running" : "Ready");

    $("pmathReadings").innerHTML = readings;
  }

  /* =========================================
     FIVE SEQUENTIAL MCQs
     ========================================= */

  function showQuestion() {
    if (!active) return;

    const s = active;

    if (s.quizIndex >= 5) {
      $("pmathQuizProgress").textContent =
        "Quiz completed";

      $("pmathQuizTitle").textContent =
        "🏆 Final Score: " + s.score + "/5";

      $("pmathQuizOptions").innerHTML = "";
      $("pmathQuizFeedback").textContent =
        s.score === 5
          ? "Excellent! All answers correct."
          : "Review and try again.";

      $("pmathNext").textContent = "Try Again ↻";
      $("pmathNext").disabled = false;
      return;
    }

    const q = s.lab.quiz[s.quizIndex];

    $("pmathQuizProgress").textContent =
      `Question ${s.quizIndex + 1} of 5 · Score ${s.score}/5`;

    $("pmathQuizTitle").textContent = q[0];
    $("pmathQuizOptions").innerHTML = "";
    $("pmathQuizFeedback").textContent =
      "Choose one answer.";

    s.answered = false;

    $("pmathNext").disabled = true;
    $("pmathNext").textContent =
      s.quizIndex === 4
        ? "See Score →"
        : "Next question →";

    const choices = q.slice(1);
    const shift = s.quizIndex % choices.length;

    const ordered = choices.slice(shift).concat(
      choices.slice(0, shift)
    );

    ordered.forEach((answer, i) => {
      const button = document.createElement("button");

      button.className = "pmath-option";
      button.type = "button";
      button.textContent = "ABCD"[i] + ". " + answer;

      button.onclick = () => {
        if (s.answered) return;

        s.answered = true;

        const correct = answer === q[1];
        if (correct) s.score++;

        $("pmathQuizFeedback").textContent =
          correct
            ? "✅ Correct answer!"
            : "❌ Correct answer: " + q[1];

        $("pmathQuizOptions")
          .querySelectorAll("button")
          .forEach(option => {
            option.disabled = true;

            if (option.textContent.slice(3) === q[1]) {
              option.style.background = "#176d54";
            } else if (option === button) {
              option.style.background = "#853d51";
            }
          });

        $("pmathNext").disabled = false;
      };

      $("pmathQuizOptions").appendChild(button);
    });
  }

  function nextQuestion() {
    if (!active) return;

    if (active.quizIndex >= 5) {
      active.quizIndex = 0;
      active.score = 0;
      showQuestion();
      return;
    }

    if (!active.answered) return;

    active.quizIndex++;
    showQuestion();
  }

  /* =========================================
     MATHEMATICS TUTOR
     ========================================= */

  function answerStudent() {
    if (!active) return;

    const input = $("pmathAskText");
    const question = input.value.trim();

    if (!question) return;

    const lower = question.toLowerCase();
    const lab = active.lab;

    let answer = lab.explanation;

    if (/formula|equation|rule|theorem/.test(lower)) {
      answer = lab.formula;
    } else if (/how|why|explain|what/.test(lower)) {
      answer = lab.explanation;
    }

    if (lab.id === "pythagoras" &&
        /hypotenuse|side|calculate/.test(lower)) {
      const p = active.p;

      answer = `For sides ${p.a} and ${p.b}, ` +
        `the hypotenuse is √(${p.a ** 2} + ${p.b ** 2}) = ` +
        Math.sqrt(p.a ** 2 + p.b ** 2).toFixed(3);
    }

    if (lab.id === "geometry" &&
        /area|circumference|radius/.test(lower)) {
      answer = `For radius ${active.p.radius}, ` +
        `area = ${(PI * active.p.radius ** 2).toFixed(2)} ` +
        `and circumference = ${(2 * PI * active.p.radius).toFixed(2)}.`;
    }

    if (lab.id === "calculus" &&
        /derivative|slope|tangent/.test(lower)) {
      answer = `The derivative of x² is 2x. ` +
        `At x = ${active.p.x}, the tangent slope is ${2 * active.p.x}.`;
    }

    const student = document.createElement("div");
    student.className = "pmath-chat";
    student.textContent = "Student: " + question;

    const reply = document.createElement("div");
    reply.className = "pmath-chat";
    reply.textContent = "PocketLab Tutor: " + answer;

    $("pmathChat").append(student, reply);
    input.value = "";
  }

  /* =========================================
     STARTUP AND NAVIGATION
     ========================================= */

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-pmath]");

    if (button) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openLab(button.dataset.pmath);
      return;
    }

    if (
      active &&
      event.target.closest(
        ".experiment-card [data-experiment]"
      )
    ) {
      restore();
    }
  }, true);

  document.addEventListener("click", event => {
    const nav = event.target.closest("[data-page]");

    if (
      active &&
      nav &&
      nav.dataset.page !== "experimentWorkspace"
    ) {
      restore();
    }
  }, true);

  function initialize() {
    installStyles();
    createCards();

    const filter = $("experimentFilter");

    if (filter) {
      filter.addEventListener("change", updateFilter);
      filter.addEventListener("input", updateFilter);
    }

    console.log(
      "✅ PocketLab Mathematics ready: 10 experiments"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();

/* POCKETLAB MATHS - PI CONSTANT FIX */
window.PI = Math.PI;
