/* Ed's Auto Glass — redesign concept.
   Three independent behaviours, each a no-op if its markup is absent,
   so the same file serves the home page and the town pages. */
(function(){
  "use strict";

  /* ---------------------------------------------------------
     Open / closed, computed in the shop's own timezone so the
     badge is right for a customer calling from another state.
     --------------------------------------------------------- */
  function shopNow(){
    return new Date(new Date().toLocaleString("en-US",{timeZone:"America/New_York"}));
  }

  function refreshHours(){
    var badge = document.getElementById("status");
    var now = shopNow(), day = now.getDay(), hour = now.getHours();
    var open = day >= 1 && day <= 5 && hour >= 9 && hour < 17;

    if(badge){
      badge.setAttribute("data-open", open ? "yes" : "no");
      var text = document.getElementById("statusText");
      if(text) text.textContent = open ? "Open now · til 5pm" : "Closed · opens 9am";
    }
    var row = document.querySelector('.hours tr[data-day="' + day + '"]');
    if(row) row.setAttribute("data-today","");
  }

  /* ---------------------------------------------------------
     Repair-or-replace estimator. Same three questions an
     estimator asks in the bay; any one disqualifier wins.
     --------------------------------------------------------- */
  function estimator(){
    var verdict = document.getElementById("verdict");
    if(!verdict) return;

    var flag  = document.getElementById("vFlag");
    var title = document.getElementById("vTitle");
    var body  = document.getElementById("vBody");
    var why   = document.getElementById("vWhy");

    var LABEL = {
      size:  {small:"under a quarter", mid:"quarter to dollar bill", big:"longer than a dollar bill"},
      loc:   {open:"open area", sight:"driver's line of sight", edge:"within 2″ of the edge"},
      count: {few:"1–2 chips", many:"3+ chips"}
    };

    var REPAIRABLE = "Damage this size holds resin well. We drill the impact point, draw the air out " +
      "under vacuum, cure it under UV, and the structural strength comes back. You'll still see a faint " +
      "mark where the chip was — that's normal and it stays put.";

    function pick(name){
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }

    function reasonToReplace(size, loc, count){
      if(size === "big")   return "Past about six inches, resin can't restore the strength the laminate lost.";
      if(loc === "edge")   return "Damage near the edge sits where the glass carries load, and cracks run from there fast.";
      if(count === "many") return "Three or more repairs in one pane leave too much distortion to see through comfortably.";
      if(loc === "sight" && size !== "small")
        return "A repair leaves a small permanent blemish. In front of the driver, at this size, that's not worth living with.";
      return null;
    }

    function evaluate(){
      var size = pick("size"), loc = pick("loc"), count = pick("count");
      var reason = reasonToReplace(size, loc, count);

      if(reason){
        verdict.setAttribute("data-mode","replace");
        flag.textContent  = "Replacement likely";
        title.textContent = "New glass, usually 2–3 hours";
        body.textContent  = reason + " We'll identify the exact glass your vehicle takes, quote parts, " +
          "labor and calibration as one number, and tell you the safe drive-away time before you go.";
      } else {
        verdict.setAttribute("data-mode","repair");
        flag.textContent  = "Repairable";
        title.textContent = "Resin injection, about 30 minutes";
        body.textContent  = REPAIRABLE;
      }
      why.textContent = "Based on: " + LABEL.size[size] + " · " + LABEL.loc[loc] + " · " + LABEL.count[count];
    }

    Array.prototype.forEach.call(
      document.querySelectorAll(".qset input"),
      function(input){ input.addEventListener("change", evaluate); }
    );
    evaluate();
  }

  /* ---------------------------------------------------------
     Hero: a star break propagating across the glass. Drawn once
     on load, held static for anyone who asked for reduced motion.
     --------------------------------------------------------- */
  function starBreak(){
    var canvas = document.getElementById("crack");
    if(!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext("2d");
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lines = [], origin = {x:0, y:0};

    function arm(x, y, angle, length, width){
      var pts = [{x:x, y:y}], step = 7, n = Math.max(3, Math.round(length / step));
      for(var i = 0; i < n; i++){
        angle += (Math.random() - 0.5) * 0.45;
        x += Math.cos(angle) * step;
        y += Math.sin(angle) * step;
        pts.push({x:x, y:y});
      }
      return {pts:pts, w:width};
    }

    function seed(){
      var box = canvas.parentElement.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = box.width  * dpr;
      canvas.height = box.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var narrow = window.innerWidth <= 880;
      origin = narrow
        ? {x: box.width * 0.78, y: box.height * 0.13}
        : {x: box.width * 0.80, y: box.height * 0.26};
      var reach = narrow ? 0.55 : 1;

      lines = [];
      var arms = 7;
      for(var i = 0; i < arms; i++){
        var a = (i / arms) * Math.PI * 2 + Math.random() * 0.5;
        lines.push(arm(origin.x, origin.y, a, (40 + Math.random() * 150) * reach, 1.25));
        if(Math.random() > 0.45){
          lines.push(arm(origin.x, origin.y, a + (Math.random() - 0.5) * 0.6, (25 + Math.random() * 70) * reach, 0.7));
        }
      }
    }

    function render(progress){
      var box = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, box.width, box.height);
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineCap = "round";

      lines.forEach(function(line){
        var upto = Math.max(2, Math.floor(line.pts.length * progress));
        ctx.globalAlpha = 0.16 * line.w;
        ctx.lineWidth = line.w;
        ctx.beginPath();
        ctx.moveTo(line.pts[0].x, line.pts[0].y);
        for(var i = 1; i < upto; i++) ctx.lineTo(line.pts[i].x, line.pts[i].y);
        ctx.stroke();
      });

      ctx.globalAlpha = 0.20;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.10;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    seed();
    if(still){
      render(1);
    } else {
      var start = null, duration = 1500;
      requestAnimationFrame(function frame(ts){
        if(start === null) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        render(1 - Math.pow(1 - p, 3));
        if(p < 1) requestAnimationFrame(frame);
      });
    }

    var resizeTimer;
    window.addEventListener("resize", function(){
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){ seed(); render(1); }, 180);
    });
  }

  refreshHours();
  estimator();
  starBreak();
})();
