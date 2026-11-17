
/*
  POCKETLAB 3.0 — SHARED 3D ENGINE
  FIXED: rolling car wheels + reactive bulb glow

  3D: circuit, motion, projectile, plant
  Other experiments: existing script.js fallback

  Three.js currently loads from CDN.
*/

(() => {
  "use strict";

  const THREE_URL =
    "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

  let THREE = null;
  let loading = false;
  let active = null;
  let checkQueued = false;

  const $ = s => document.querySelector(s);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const css = document.createElement("style");
  css.textContent = `
    #simulationCanvas:has(.p3-root) {
      padding:0!important;
      overflow:hidden!important;
      background:#071323!important;
      border-radius:16px;
    }
    .p3-root {
      background:#071323;
      color:white;
      font-family:Arial,sans-serif;
      overflow:hidden;
      border-radius:16px;
    }
    .p3-view {
      height:420px;
      width:100%;
      position:relative;
      overflow:hidden;
      touch-action:none;
    }
    .p3-view canvas {
      display:block;
      width:100%;
      height:100%;
      cursor:grab;
      touch-action:none;
    }
    .p3-heading {
      position:absolute;
      left:17px;
      top:17px;
      z-index:2;
      pointer-events:none;
      text-shadow:0 2px 8px #000;
    }
    .p3-heading small {
      color:#60e7ff;
      font-size:10px;
      font-weight:800;
      letter-spacing:1.4px;
    }
    .p3-heading strong {
      display:block;
      margin-top:7px;
      font-size:19px;
    }
    .p3-status {
      position:absolute;
      top:17px;
      right:17px;
      z-index:2;
      color:#7fffc4;
      border:1px solid #32795f;
      background:#103c31;
      border-radius:20px;
      padding:8px 11px;
      font-size:10px;
      font-weight:bold;
      pointer-events:none;
    }
    .p3-panel {
      background:#0b1b31;
      padding:16px;
      border-top:1px solid #29415d;
    }
    .p3-reading {
      text-align:center;
      color:#70eaff;
      font-size:27px;
      font-weight:900;
      margin:4px 0 15px;
    }
    .p3-metrics {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:9px;
    }
    .p3-metric {
      background:#162b47;
      border:1px solid #2d4a6a;
      padding:11px 6px;
      text-align:center;
      border-radius:10px;
    }
    .p3-metric small {
      display:block;
      color:#a7bad3;
      font-size:10px;
      margin-bottom:6px;
    }
    .p3-metric strong {
      font-size:13px;
      overflow-wrap:anywhere;
    }
    .p3-actions {
      display:flex;
      flex-wrap:wrap;
      justify-content:center;
      gap:8px;
      margin-top:14px;
    }
    .p3-actions button {
      background:#244364;
      color:white;
      border:1px solid #456c94;
      border-radius:9px;
      padding:9px 13px;
      font-size:11px;
      font-weight:bold;
      cursor:pointer;
    }
    .p3-help {
      text-align:center;
      color:#9eb4cd;
      font-size:11px;
      margin:12px 0 0;
    }
    @media(max-width:600px) {
      .p3-view {height:330px}
      .p3-heading strong {font-size:15px}
      .p3-reading {font-size:22px}
    }
  `;
  document.head.appendChild(css);

  // -----------------------------------
  // EXPERIMENT DETECTION
  // -----------------------------------

  function currentKey() {
    const workspace = $("#experimentWorkspace");

    if (!workspace?.classList.contains("active")) {
      return "";
    }

    const title = (
      $("#activeExperimentTitle")?.textContent || ""
    ).toLowerCase();

    if (title.includes("advanced circuit")) return "";
    if (title.includes("electric circuit")) return "circuit";
    if (title.includes("force and motion")) return "motion";
    if (title.includes("projectile")) return "projectile";
    if (title.includes("plant growth")) return "plant";

    return "";
  }

  function control(name, fallback) {
    const area = $("#experimentControls");
    if (!area) return fallback;

    const input = [...area.querySelectorAll("input,select")]
      .find(el =>
        el.id === name ||
        el.name === name ||
        (el.id || "").toLowerCase().includes(name)
      );

    if (!input) return fallback;

    const n = Number(input.value);
    return Number.isFinite(n) ? n : fallback;
  }

  // -----------------------------------
  // 3D HELPERS
  // -----------------------------------

  function material(color, opts = {}) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness:0.52,
      metalness:0.08,
      ...opts
    });
  }

  function add(parent, geometry, mat, x=0, y=0, z=0) {
    const m = new THREE.Mesh(geometry, mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  function box(p,w,h,d,color,x=0,y=0,z=0) {
    return add(
      p,
      new THREE.BoxGeometry(w,h,d),
      material(color),
      x,y,z
    );
  }

  function ball(p,r,color,x=0,y=0,z=0) {
    return add(
      p,
      new THREE.SphereGeometry(r,32,24),
      material(color),
      x,y,z
    );
  }

  function cyl(p,r1,r2,h,color,x=0,y=0,z=0) {
    return add(
      p,
      new THREE.CylinderGeometry(r1,r2,h,40),
      material(color),
      x,y,z
    );
  }

  function pipe(p,points,r,color,options={}) {
    const curve = new THREE.CatmullRomCurve3(
      points.map(v => new THREE.Vector3(...v))
    );

    const object = add(
      p,
      new THREE.TubeGeometry(curve,72,r,10,false),
      material(color,options)
    );

    return {object,curve};
  }

  function label(p,text,x,y,z,color="#ffffff") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const c = canvas.getContext("2d");
    c.fillStyle = color;
    c.font = "bold 42px Arial";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text,256,64,500);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map:texture,
        transparent:true,
        depthWrite:false
      })
    );

    sprite.position.set(x,y,z);
    sprite.scale.set(1.9,.48,1);
    p.add(sprite);

    return sprite;
  }

  function glowSprite(parent,x,y,z) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    const c = canvas.getContext("2d");
    const gradient = c.createRadialGradient(
      128,128,5,128,128,128
    );

    gradient.addColorStop(0,"rgba(255,255,235,1)");
    gradient.addColorStop(.12,"rgba(255,246,160,.95)");
    gradient.addColorStop(.32,"rgba(255,190,55,.58)");
    gradient.addColorStop(.65,"rgba(255,125,20,.16)");
    gradient.addColorStop(1,"rgba(255,110,0,0)");

    c.fillStyle = gradient;
    c.fillRect(0,0,256,256);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map:texture,
        transparent:true,
        opacity:0,
        blending:THREE.AdditiveBlending,
        depthWrite:false,
        depthTest:false
      })
    );

    sprite.position.set(x,y,z);
    sprite.scale.set(2.6,2.6,1);
    sprite.renderOrder = 10;
    parent.add(sprite);

    return sprite;
  }

  // -----------------------------------
  // CIRCUIT — REACTIVE GLOW
  // -----------------------------------

  function circuitScene(scene) {
    const root = new THREE.Group();
    scene.add(root);

    box(root,5.8,.18,3.6,0x1d344e,0,.1,0);

    // Battery
    box(root,.9,1.2,.78,0x138b96,-2,.83,0);
    box(root,.82,.13,.72,0x263b51,-2,1.49,0);

    cyl(root,.09,.09,.13,0xe9edf4,-2.22,1.61,0);
    cyl(root,.09,.09,.13,0xe9edf4,-1.78,1.61,0);

    label(root,"BATTERY",-2,.48,.52);

    // Resistor
    const resistor = cyl(
      root,.24,.24,1.06,0xe0bb87,0,.63,-1
    );
    resistor.rotation.z = Math.PI/2;

    [
      [-.33,0x8b3425],
      [-.12,0x1e2228],
      [.12,0xd46b2d],
      [.33,0xd9bd58]
    ].forEach(([offset,color]) => {
      const stripe = cyl(
        root,.246,.246,.065,color,offset,.63,-1
      );
      stripe.rotation.z = Math.PI/2;
    });

    label(root,"RESISTOR",0,1.32,-1);

    // Socket
    cyl(root,.32,.36,.32,0x8495a7,2,.51,0);
    cyl(root,.24,.27,.13,0xb4beca,2,.74,0);

    // Bulb glass: clear even when off
    const glass = add(
      root,
      new THREE.SphereGeometry(.52,48,32),
      new THREE.MeshPhysicalMaterial({
        color:0xe2f3ff,
        transparent:true,
        opacity:.18,
        roughness:.08,
        metalness:0,
        depthWrite:false,
        side:THREE.FrontSide
      }),
      2,1.22,0
    );

    // Inner illuminated bulb volume
    const innerMaterial = new THREE.MeshBasicMaterial({
      color:0xffcc5a,
      transparent:true,
      opacity:0,
      depthWrite:false
    });

    const inner = add(
      root,
      new THREE.SphereGeometry(.43,32,24),
      innerMaterial,
      2,1.22,0
    );

    inner.castShadow = false;

    // Filament with actual emissive response
    const filamentMaterial = new THREE.MeshStandardMaterial({
      color:0x594a39,
      emissive:0xffc04a,
      emissiveIntensity:0,
      roughness:.4
    });

    const filament = pipe(root,[
      [1.83,1.04,.02],
      [1.89,1.36,.02],
      [1.96,1.14,.02],
      [2.03,1.37,.02],
      [2.10,1.14,.02],
      [2.17,1.04,.02]
    ],.027,0x594a39);

    filament.object.material.dispose();
    filament.object.material = filamentMaterial;

    const halo = glowSprite(root,2,1.22,.12);

    const bulbLight = new THREE.PointLight(
      0xffc76a,0,7,2
    );
    bulbLight.position.set(2,1.22,0);
    root.add(bulbLight);

    label(root,"LIGHT BULB",2,2.06,0);

    // Wires
    const paths = [
      [
        [-2.22,1.61,0],
        [-2.22,1.65,-1],
        [-.56,1.65,-1],
        [-.56,.63,-1]
      ],
      [
        [.56,.63,-1],
        [1.4,.63,-1],
        [1.4,.52,0],
        [2,.52,0]
      ],
      [
        [2,.35,0],
        [2,.35,1.3],
        [-1.78,.35,1.3],
        [-1.78,1.61,0]
      ]
    ];

    const electrons = [];

    paths.forEach(points => {
      const wire = pipe(
        root,points,.048,0x2fc6e8,
        {metalness:.3,roughness:.3}
      );

      for (let i=0;i<5;i++) {
        const dot = ball(root,.05,0xffed85);
        dot.material.dispose();
        dot.material = new THREE.MeshBasicMaterial({
          color:0xffe77a
        });

        electrons.push({
          dot,
          curve:wire.curve,
          offset:i/5
        });
      }
    });

    function electrical() {
      const voltage = Math.max(
        0,control("voltage",9)
      );

      const resistance = Math.max(
        .01,control("resistance",6)
      );

      const current = voltage/resistance;
      const power = voltage*current;

      return {
        voltage,resistance,current,power
      };
    }

    return {
      update(t) {
        const e = electrical();

        /*
          A reference power controls the visual
          brightness of this educational bulb.
          This is not a thermal filament model.
        */
        const brightness = clamp(
          e.power/15,0,1
        );

        // OFF -> dim orange -> bright warm white
        filamentMaterial.color.setRGB(
          .28 + brightness*.72,
          .18 + brightness*.82,
          .10 + brightness*.76
        );

        filamentMaterial.emissiveIntensity =
          brightness*5;

        innerMaterial.opacity =
          brightness*.48;

        innerMaterial.color.setRGB(
          1,
          .47 + brightness*.48,
          .12 + brightness*.70
        );

        halo.material.opacity =
          brightness*.92;

        const haloSize =
          1.6 + brightness*2.3;

        halo.scale.set(
          haloSize,haloSize,1
        );

        bulbLight.intensity =
          brightness*22;

        glass.material.opacity =
          .15 + brightness*.11;

        electrons.forEach(p => {
          const speed = clamp(
            e.current*.12,0,2
          );

          p.dot.visible = e.current > 0;

          const u = (
            t*speed+p.offset
          )%1;

          p.dot.position.copy(
            p.curve.getPointAt(u)
          );
        });
      },

      info() {
        const e = electrical();

        return {
          reading:`${e.current.toFixed(2)} A`,
          metrics:[
            ["Voltage",`${e.voltage} V`],
            ["Resistance",`${e.resistance} Ω`],
            ["Bulb power",`${e.power.toFixed(2)} W`]
          ]
        };
      }
    };
  }

  // -----------------------------------
  // CAR — REAL WHEEL ROLLING
  // -----------------------------------

  function motionScene(scene) {
    const root = new THREE.Group();
    scene.add(root);

    // Road
    box(root,14,.18,3.6,0x293b4c,0,.05,0);

    for(let x=-6;x<7;x+=1.5) {
      box(root,.78,.012,.065,0xf4d57d,x,.15,1.15);
    }

    const car = new THREE.Group();
    root.add(car);

    box(car,2.45,.5,1.12,0x3972e7,0,.75,0);
    box(car,1.45,.48,1.04,0x1f477f,-.15,1.2,0);
    box(car,1.34,.09,1.07,0x9db7f5,-.15,1.48,0);

    box(car,.85,.31,.015,0x80d5f7,-.16,1.2,.53);
    box(car,.85,.31,.015,0x80d5f7,-.16,1.2,-.53);

    ball(car,.11,0xffefb2,1.23,.78,.4);
    ball(car,.11,0xffefb2,1.23,.78,-.4);

    const wheelRadius = .34;
    const wheels = [];

    [-.8,.8].forEach(x => {
      [-.64,.64].forEach(z => {
        /*
          Wheel pivot rotates around world Z,
          which is the axle for this side view.
        */
        const pivot = new THREE.Group();
        pivot.position.set(x,.4,z);
        car.add(pivot);

        const tire = cyl(
          pivot,wheelRadius,wheelRadius,.18,
          0x10151c
        );

        tire.rotation.x = Math.PI/2;

        const hub = cyl(
          pivot,.15,.15,.19,0xaab8ca
        );

        hub.rotation.x = Math.PI/2;

        // Visible spokes make rotation obvious
        for(let i=0;i<5;i++) {
          const angle = i*Math.PI*2/5;

          const spoke = box(
            pivot,.045,.19,.015,
            0xe5edf8,
            Math.sin(angle)*.17,
            Math.cos(angle)*.17,
            z>0 ? .105 : -.105
          );

          spoke.rotation.z = -angle;
        }

        wheels.push(pivot);
      });
    });

    return {
      update(t) {
        const force = control("force",20);
        const mass = Math.max(
          .01,control("mass",5)
        );

        const acceleration = force/mass;

        // Loop a four-second motion demonstration.
        const demoTime = (t*.35)%4;
        const displacement =
          .5*acceleration*demoTime*demoTime;

        // Wrap the visible car position.
        const trackLength = 8;
        const visibleDistance =
          ((displacement%trackLength)+trackLength)
          %trackLength;

        car.position.x =
          -4+visibleDistance;

        /*
          Pure rolling without slipping:
          angle = distance / radius.
          Use the same displacement that
          controls the car's position.
        */
        const wheelAngle =
          -displacement/wheelRadius;

        wheels.forEach(w => {
          w.rotation.z = wheelAngle;
        });
      },

      info() {
        const force = control("force",20);
        const mass = Math.max(
          .01,control("mass",5)
        );
        const a = force/mass;

        return {
          reading:`${a.toFixed(2)} m/s²`,
          metrics:[
            ["Force",`${force} N`],
            ["Mass",`${mass} kg`],
            ["Speed at 4 s",`${(a*4).toFixed(2)} m/s`]
          ]
        };
      }
    };
  }

  // -----------------------------------
  // PROJECTILE
  // -----------------------------------

  function projectileScene(scene) {
    const root = new THREE.Group();
    scene.add(root);

    box(root,12,.16,4,0x254235,0,.04,0);

    cyl(root,.45,.55,.28,0x71869d,-4,.3,0);

    const barrel = cyl(
      root,.19,.22,1.2,0x859bb5,-4,.9,0
    );

    const projectile = ball(
      root,.21,0xffa340
    );

    const trail = [];

    for(let i=0;i<14;i++) {
      const dot = ball(root,.045,0x66e6ff);
      trail.push(dot);
    }

    function point(t,speed,angle) {
      const rad = angle*Math.PI/180;

      return new THREE.Vector3(
        -4+speed*Math.cos(rad)*t*.16,
        .45+(
          speed*Math.sin(rad)*t-
          4.905*t*t
        )*.16,
        0
      );
    }

    return {
      update(t) {
        const speed = control("speed",20);
        const angle = control("angle",45);
        const rad = angle*Math.PI/180;

        const flight = Math.max(
          .01,2*speed*Math.sin(rad)/9.81
        );

        const elapsed = (t*.65)%flight;

        barrel.rotation.z =
          -(Math.PI/2-rad);

        projectile.position.copy(
          point(elapsed,speed,angle)
        );

        trail.forEach((dot,i) => {
          dot.position.copy(
            point(
              Math.max(0,elapsed-i*.07),
              speed,angle
            )
          );
        });
      },

      info() {
        const speed = control("speed",20);
        const angle = control("angle",45);
        const rad = angle*Math.PI/180;

        const range =
          speed*speed*Math.sin(2*rad)/9.81;

        const height =
          Math.pow(speed*Math.sin(rad),2)/19.62;

        const time =
          2*speed*Math.sin(rad)/9.81;

        return {
          reading:`${range.toFixed(2)} m`,
          metrics:[
            ["Range",`${range.toFixed(2)} m`],
            ["Height",`${height.toFixed(2)} m`],
            ["Flight",`${time.toFixed(2)} s`]
          ]
        };
      }
    };
  }

  // -----------------------------------
  // PLANT
  // -----------------------------------

  function plantScene(scene) {
    const root = new THREE.Group();
    scene.add(root);

    cyl(root,.73,.5,1,0xb96c4c,0,.56,0);
    cyl(root,.78,.75,.15,0xd88b61,0,1.09,0);
    cyl(root,.69,.69,.03,0x38281d,0,1.17,0);

    const growing = new THREE.Group();
    growing.position.y = 1.18;
    root.add(growing);

    pipe(growing,[
      [0,0,0],
      [.05,.5,0],
      [-.05,1,0],
      [.04,1.5,0],
      [0,2.1,0]
    ],.052,0x388d42);

    const leaves = [];

    for(let i=0;i<12;i++) {
      const group = new THREE.Group();
      group.position.y = .28+i*.15;
      group.rotation.y = i*2.4;
      growing.add(group);

      const size = .68+(i%3)*.13;
      const shape = new THREE.Shape();

      shape.moveTo(0,0);
      shape.bezierCurveTo(
        size*.2,size*.35,
        size*.8,size*.38,
        size,0
      );
      shape.bezierCurveTo(
        size*.8,-size*.38,
        size*.2,-size*.35,
        0,0
      );

      const leaf = add(
        group,
        new THREE.ShapeGeometry(shape,24),
        material(
          i%2 ? 0x39b35c : 0x69d775,
          {side:THREE.DoubleSide}
        )
      );

      leaf.rotation.z = .28;
      leaf.rotation.x = -.32;

      leaves.push(group);
    }

    ball(growing,.12,0x9bed9d,0,2.16,0);

    return {
      update(t) {
        const sun = control("sunlight",70);
        const water = control("water",60);

        const growth =
          clamp(sun/70,0,1)*
          clamp(1-Math.abs(water-60)/60,0,1);

        growing.scale.setScalar(
          .35+growth*.65
        );

        growing.rotation.z =
          Math.sin(t*.7)*.025;

        leaves.forEach((leaf,i) => {
          leaf.rotation.x =
            Math.sin(t+i)*.04;
        });
      },

      info() {
        const sun = control("sunlight",70);
        const water = control("water",60);

        const growth = Math.round(
          100*
          clamp(sun/70,0,1)*
          clamp(1-Math.abs(water-60)/60,0,1)
        );

        return {
          reading:`${growth}% Growth`,
          metrics:[
            ["Sunlight",`${sun}%`],
            ["Water",`${water}%`],
            ["Growth index",`${growth}%`]
          ]
        };
      }
    };
  }

  const builders = {
    circuit:circuitScene,
    motion:motionScene,
    projectile:projectileScene,
    plant:plantScene
  };

  // -----------------------------------
  // THREE.JS WORLD
  // -----------------------------------

  function createWorld(view,key) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x081729);

    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(view.clientWidth,1)/
        Math.max(view.clientHeight,1),
      .1,100
    );

    const renderer = new THREE.WebGLRenderer({
      antialias:true
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio||1,2)
    );

    renderer.setSize(
      Math.max(view.clientWidth,1),
      Math.max(view.clientHeight,1)
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.4;

    view.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(
      0xc8e8ff,0x263b35,2.2
    ));

    const sun = new THREE.DirectionalLight(
      0xfff1db,3
    );

    sun.position.set(4,8,5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024,1024);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    scene.add(sun);

    const blue = new THREE.PointLight(
      0x3aaaff,20,12
    );
    blue.position.set(-4,3,-3);
    scene.add(blue);

    const floor = add(
      scene,
      new THREE.PlaneGeometry(30,30),
      material(0x13283c)
    );

    floor.rotation.x = -Math.PI/2;
    floor.receiveShadow = true;

    return {
      scene,
      camera,
      renderer,
      simulation:builders[key](scene)
    };
  }

  // -----------------------------------
  // LIFECYCLE
  // -----------------------------------

  function dispose() {
    if (!active) return;

    const old = active;
    active = null;

    cancelAnimationFrame(old.frame);
    old.resizeObserver?.disconnect();
    old.abort.abort();

    old.world.scene.traverse(object => {
      object.geometry?.dispose();

      if(object.material) {
        const materials = Array.isArray(
          object.material
        )
          ? object.material
          : [object.material];

        materials.forEach(m => {
          m.map?.dispose();
          m.dispose();
        });
      }
    });

    old.world.renderer.dispose();
  }

  function mount(key) {
    const canvas = $("#simulationCanvas");
    if(!canvas) return;

    if(
      active &&
      active.key===key &&
      active.root.isConnected
    ) return;

    dispose();

    const root = document.createElement("div");
    root.className = "p3-root";

    root.innerHTML = `
      <div class="p3-view">
        <div class="p3-heading">
          <small>POCKETLAB 3.0 · REAL 3D LAB</small>
          <strong></strong>
        </div>
        <div class="p3-status">● INTERACTIVE 3D</div>
      </div>

      <div class="p3-panel">
        <div class="p3-reading"></div>
        <div class="p3-metrics"></div>

        <div class="p3-actions">
          <button data-action="pause">⏸ Pause</button>
          <button data-action="plus">＋ Zoom</button>
          <button data-action="minus">－ Zoom</button>
          <button data-action="reset">↺ Reset</button>
        </div>

        <p class="p3-help">
          Drag to rotate 360° · Scroll to zoom ·
          Change sliders to test the experiment
        </p>
      </div>
    `;

    canvas.replaceChildren(root);

    root.querySelector(".p3-heading strong")
      .textContent =
        $("#activeExperimentTitle")?.textContent ||
        "3D Experiment";

    const view = root.querySelector(".p3-view");
    const world = createWorld(view,key);

    const state = {
      key,
      root,
      world,
      angle:.55,
      elevation:.35,
      distance:key==="motion"?10:7,
      paused:false,
      simulationTime:0,
      lastTime:null,
      frame:0,
      resizeObserver:null,
      abort:new AbortController()
    };

    active = state;

    function refresh() {
      if(active!==state) return;

      const info = world.simulation.info();

      root.querySelector(".p3-reading")
        .textContent = info.reading;

      root.querySelector(".p3-metrics")
        .innerHTML = info.metrics.map(
          ([name,v]) => `
            <div class="p3-metric">
              <small>${name}</small>
              <strong>${v}</strong>
            </div>
          `
        ).join("");

      // Apply changed controls immediately,
      // even when animation is paused.
      world.simulation.update(
        state.simulationTime
      );

      world.renderer.render(
        world.scene,world.camera
      );
    }

    const element = world.renderer.domElement;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    element.addEventListener("pointerdown",e => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;

      element.setPointerCapture(e.pointerId);
      element.style.cursor = "grabbing";
    });

    element.addEventListener("pointermove",e => {
      if(!dragging) return;

      state.angle -= (e.clientX-lastX)*.009;

      state.elevation = clamp(
        state.elevation+
          (e.clientY-lastY)*.005,
        .05,1.35
      );

      lastX = e.clientX;
      lastY = e.clientY;
    });

    function stopDrag() {
      dragging = false;
      element.style.cursor = "grab";
    }

    element.addEventListener("pointerup",stopDrag);
    element.addEventListener("pointercancel",stopDrag);

    element.addEventListener("wheel",e => {
      e.preventDefault();

      state.distance = clamp(
        state.distance+e.deltaY*.006,
        3,17
      );
    },{passive:false});

    root.addEventListener("click",e => {
      const button = e.target.closest(
        "[data-action]"
      );

      if(!button) return;

      const action = button.dataset.action;

      if(action==="pause") {
        state.paused = !state.paused;
        button.textContent = state.paused
          ? "▶ Play"
          : "⏸ Pause";
      }

      if(action==="plus") {
        state.distance = clamp(
          state.distance-.6,3,17
        );
      }

      if(action==="minus") {
        state.distance = clamp(
          state.distance+.6,3,17
        );
      }

      if(action==="reset") {
        state.angle = .55;
        state.elevation = .35;
        state.distance =
          key==="motion"?10:7;

        state.simulationTime = 0;
        state.paused = false;

        const pause = root.querySelector(
          '[data-action="pause"]'
        );

        if(pause) pause.textContent = "⏸ Pause";
      }
    });

    const controls = $("#experimentControls");

    controls?.addEventListener(
      "input",refresh,
      {signal:state.abort.signal}
    );

    controls?.addEventListener(
      "change",refresh,
      {signal:state.abort.signal}
    );

    const resizeObserver = new ResizeObserver(() => {
      if(active!==state) return;

      const w = Math.max(view.clientWidth,1);
      const h = Math.max(view.clientHeight,1);

      world.camera.aspect = w/h;
      world.camera.updateProjectionMatrix();
      world.renderer.setSize(w,h);
    });

    resizeObserver.observe(view);
    state.resizeObserver = resizeObserver;

    function animate(now) {
      if(active!==state) return;

      if(
        !root.isConnected ||
        currentKey()!==key
      ) {
        dispose();
        return;
      }

      state.frame = requestAnimationFrame(
        animate
      );

      if(state.lastTime===null) {
        state.lastTime = now;
      }

      const dt = Math.min(
        (now-state.lastTime)/1000,
        .05
      );

      state.lastTime = now;

      if(!state.paused) {
        state.simulationTime += dt;
      }

      world.simulation.update(
        state.simulationTime
      );

      const d = state.distance;
      const horizontal =
        d*Math.cos(state.elevation);

      world.camera.position.set(
        Math.sin(state.angle)*horizontal,
        1.5+d*Math.sin(state.elevation),
        Math.cos(state.angle)*horizontal
      );

      world.camera.lookAt(
        0,key==="plant"?1.7:.9,0
      );

      world.renderer.render(
        world.scene,world.camera
      );
    }

    refresh();

    state.frame = requestAnimationFrame(
      animate
    );
  }

  // -----------------------------------
  // LOAD + CONNECT TO EXISTING APP
  // -----------------------------------

  async function loadThree() {
    if(THREE||loading) return;

    loading = true;

    try {
      THREE = await import(THREE_URL);
      scheduleCheck();
    } catch(error) {
      loading = false;
      console.error(
        "PocketLab: Three.js failed to load",
        error
      );
    }
  }

  function check() {
    const key = currentKey();

    if(!key) {
      if(active) dispose();
      return;
    }

    if(!THREE) {
      loadThree();
      return;
    }

    if(
      active &&
      active.key===key &&
      active.root.isConnected
    ) return;

    mount(key);
  }

  function scheduleCheck() {
    if(checkQueued) return;

    checkQueued = true;

    requestAnimationFrame(() => {
      checkQueued = false;
      check();
    });
  }

  function init() {
    const canvas = $("#simulationCanvas");

    if(!canvas) {
      console.warn(
        "PocketLab: #simulationCanvas not found"
      );
      return;
    }

    new MutationObserver(scheduleCheck).observe(
      canvas,{childList:true}
    );

    const title = $("#activeExperimentTitle");

    if(title) {
      new MutationObserver(scheduleCheck).observe(
        title,{
          childList:true,
          subtree:true,
          characterData:true
        }
      );
    }

    document.addEventListener("click",e => {
      if(
        e.target.closest("[data-experiment]") ||
        e.target.closest("[data-page]") ||
        e.target.closest("[data-pl40-launch]")
      ) {
        scheduleCheck();
      }
    });

    scheduleCheck();

    console.info(
      "PocketLab 3D: rolling wheels and bulb glow ready"
    );
  }

  if(document.readyState==="loading") {
    document.addEventListener(
      "DOMContentLoaded",init
    );
  } else {
    init();
  }

})();
