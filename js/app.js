/* Simulator Logic for Ultimate Life Simulator */

/* Global Player Object and Variables */
var player = {
  name: "",
  age: 0,
  health: 100,
  happiness: 50,
  wealth: 1000,
  education: "None",
  career: "None",
  intelligence: 0,
  creativity: 0,
  social: 0,
  married: false,
  children: 0,
  history: [] // Array for timeline events
};
var pendingDecision = false;

/* Event Pools for Different Life Aspects */
var educationEvents = [];
var careerEvents = [];
var relationshipEvents = [];
var healthEvents = [];
var travelEvents = [];
var randomEvents = [];

/* Utility: Random Element Selector */
function chooseRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* Initialize Event Pools with Sample Events */
function initEvents() {
  // Education Events (sample: 50 events)
  for (var i = 1; i <= 50; i++) {
    educationEvents.push({
      id: "edu" + i,
      description: "Education Event " + i + ": Study or relax?",
      options: [
        { text: "Study", effect: function() { player.intelligence += 1; player.happiness -= 2; addLog("You studied hard."); } },
        { text: "Relax", effect: function() { player.happiness += 2; player.intelligence -= 1; addLog("You took a break."); } }
      ]
    });
  }
  // Career Events (sample: 50 events)
  for (var i = 1; i <= 50; i++) {
    careerEvents.push({
      id: "car" + i,
      description: "Career Event " + i + ": Risk it or play it safe?",
      options: [
        { text: "Risk", effect: function() { player.wealth += 2000; player.happiness += 3; addLog("Risk paid off!"); } },
        { text: "Safe", effect: function() { player.wealth += 500; addLog("Steady progress earned you a bonus."); } }
      ]
    });
  }
  // Relationship Events (sample: 50 events)
  for (var i = 1; i <= 50; i++) {
    relationshipEvents.push({
      id: "rel" + i,
      description: "Relationship Event " + i + ": Mingle or stick with close friends?",
      options: [
        { text: "Mingle", effect: function() { player.social += 1; player.happiness += 5; addLog("You made new friends."); } },
        { text: "Stay", effect: function() { player.happiness -= 2; addLog("You stayed with close friends."); } }
      ]
    });
  }
  // Health Events (sample: 30 events)
  for (var i = 1; i <= 30; i++) {
    healthEvents.push({
      id: "hea" + i,
      description: "Health Event " + i + ": Rest or push through illness?",
      options: [
        { text: "Rest", effect: function() { player.health += 10; player.happiness -= 2; addLog("Rest helped you recover."); } },
        { text: "Push Through", effect: function() { player.health -= 10; player.happiness += 1; addLog("You pushed through."); } }
      ]
    });
  }
  // Travel Events (sample: 30 events)
  for (var i = 1; i <= 30; i++) {
    travelEvents.push({
      id: "tra" + i,
      description: "Travel Event " + i + ": Travel or stay home?",
      options: [
        { text: "Travel", effect: function() { player.happiness += 15; player.wealth -= 3000; addLog("You traveled and enriched your life."); } },
        { text: "Stay", effect: function() { player.happiness -= 2; addLog("You missed the travel opportunity."); } }
      ]
    });
  }
  // Random Events (sample: 100 events)
  for (var i = 1; i <= 100; i++) {
    randomEvents.push({
      id: "ran" + i,
      description: "Random Event " + i + ": Choose your action.",
      options: [
        { text: "Option A", effect: function() { player.wealth += 1000; addLog("Wealth increased."); } },
        { text: "Option B", effect: function() { player.health -= 5; addLog("Health decreased."); } },
        { text: "Option C", effect: function() { player.happiness += 3; addLog("Mood improved."); } }
      ]
    });
  }
}

/* Helper: Append a Message to the Game Log */
function addLog(message) {
  var log = document.getElementById("game-log");
  if (!log) return;
  var p = document.createElement("p");
  p.innerHTML = message;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

/* Update Status Panel & Profile with Current Player Stats */
function updateStatus() {
  if (document.getElementById("playerName")) {
    document.getElementById("playerName").textContent = player.name;
    document.getElementById("playerAge").textContent = player.age;
    document.getElementById("playerHealth").textContent = player.health;
    document.getElementById("playerHappiness").textContent = player.happiness;
    document.getElementById("playerWealth").textContent = player.wealth;
    document.getElementById("playerEducation").textContent = player.education;
    document.getElementById("playerCareer").textContent = player.career;
    document.getElementById("playerIntelligence").textContent = player.intelligence;
    document.getElementById("playerCreativity").textContent = player.creativity;
    document.getElementById("playerSocial").textContent = player.social;
    document.getElementById("playerMarried").textContent = player.married ? "Yes" : "No";
    document.getElementById("playerChildren").textContent = player.children;
  }
  // Update Profile page if it exists
  if (document.getElementById("profileName")) {
    document.getElementById("profileName").textContent = player.name;
    document.getElementById("profileAge").textContent = player.age;
    document.getElementById("profileHealth").textContent = player.health;
    document.getElementById("profileHappiness").textContent = player.happiness;
    document.getElementById("profileWealth").textContent = player.wealth;
    document.getElementById("profileEducation").textContent = player.education;
    document.getElementById("profileCareer").textContent = player.career;
    document.getElementById("profileIntelligence").textContent = player.intelligence;
    document.getElementById("profileCreativity").textContent = player.creativity;
    document.getElementById("profileSocial").textContent = player.social;
    document.getElementById("profileMarried").textContent = player.married ? "Yes" : "No";
    document.getElementById("profileChildren").textContent = player.children;
  }
}

/* Show a Decision Prompt for an Event */
function showDecision(eventObj, callback) {
  var controlPanel = document.getElementById("sim-control");
  if (!controlPanel) return;
  controlPanel.innerHTML = "";
  addLog("<strong>" + eventObj.description + "</strong>");
  eventObj.options.forEach(function(option) {
    var btn = document.createElement("button");
    btn.textContent = option.text;
    btn.addEventListener("click", function() {
      option.effect();
      callback();
      controlPanel.innerHTML = "";
      controlPanel.appendChild(document.getElementById("nextYearBtn"));
      updateStatus();
    });
    controlPanel.appendChild(btn);
  });
}

/* Simulation Engine: Progress One Year */
function simulateYear() {
  if (pendingDecision) return;
  player.age++;
  addLog("<hr><strong>Year " + player.age + ":</strong> A new chapter begins.");
  player.history.push({ year: player.age, note: "Year " + player.age });
  
  // Milestone decisions:
  if (player.age === 18) {
    var decision18 = {
      description: "At 18, choose your path: College, Work, or a Gap Year.",
      options: [
        { text: "College", effect: function() { player.education = "College"; player.wealth -= 10000; player.intelligence += 2; addLog("You enrolled in college."); } },
        { text: "Work", effect: function() { player.career = "Junior Employee"; player.wealth += 5000; player.social += 1; addLog("You started working."); } },
        { text: "Gap Year", effect: function() { player.education = "Self-Taught"; player.wealth -= 5000; player.happiness += 10; addLog("You took a gap year."); } }
      ]
    };
    pendingDecision = true;
    showDecision(decision18, function() { pendingDecision = false; });
    return;
  }
  if (player.age === 25 && !player.married) {
    var decision25 = {
      description: "At 25, romance is in the air. Do you get married?",
      options: [
        { text: "Marry", effect: function() { player.married = true; player.happiness += 20; addLog("You got married!"); } },
        { text: "Stay Single", effect: function() { player.happiness += 5; addLog("You remained single."); } }
      ]
    };
    pendingDecision = true;
    showDecision(decision25, function() { pendingDecision = false; });
    return;
  }
  if (player.age === 30 && player.married && player.children < 3) {
    var decision30 = {
      description: "At 30, consider expanding your family. Have a child?",
      options: [
        { text: "Have Child", effect: function() { player.children++; player.happiness += 15; player.wealth -= 5000; addLog("A child joins your family."); } },
        { text: "Wait", effect: function() { player.happiness += 2; addLog("You decide to wait."); } }
      ]
    };
    pendingDecision = true;
    showDecision(decision30, function() { pendingDecision = false; });
    return;
  }
  if (player.age === 65) {
    var decision65 = {
      description: "At 65, retirement beckons. Retire or continue working?",
      options: [
        { text: "Retire", effect: function() { player.happiness += 20; player.wealth += 5000; addLog("You retired and enjoy your golden years."); } },
        { text: "Continue", effect: function() { player.happiness -= 5; addLog("You chose to continue working."); } }
      ]
    };
    pendingDecision = true;
    showDecision(decision65, function() { pendingDecision = false; });
    return;
  }
  
  // Select event pool based on age
  var eventPool = [];
  if (player.age < 18) {
    eventPool = educationEvents;
  } else if (player.age < 25) {
    eventPool = educationEvents.concat(randomEvents);
  } else if (player.age < 35) {
    eventPool = careerEvents.concat(relationshipEvents, randomEvents);
  } else if (player.age < 50) {
    eventPool = careerEvents.concat(healthEvents, travelEvents, randomEvents);
  } else if (player.age < 65) {
    eventPool = healthEvents.concat(relationshipEvents, randomEvents);
  } else {
    eventPool = randomEvents;
  }
  
  var eventObj = chooseRandom(eventPool);
  pendingDecision = true;
  showDecision(eventObj, function() { pendingDecision = false; });
  updateStatus();
  drawTimeline();
}

/* Canvas Timeline: Draw Dots Representing Each Year */
var canvas = document.getElementById("life-canvas");
var ctx = canvas.getContext("2d");
function resizeCanvas() {
  canvas.width = document.getElementById("sim-right").clientWidth;
  canvas.height = document.getElementById("sim-right").clientHeight;
  drawTimeline();
}
window.addEventListener("resize", resizeCanvas);
function drawTimeline() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var margin = 40;
  var lineY = canvas.height - margin;
  ctx.beginPath();
  ctx.moveTo(margin, lineY);
  ctx.lineTo(canvas.width - margin, lineY);
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;
  ctx.stroke();
  for (var i = 0; i < player.history.length; i++) {
    var x = margin + (i / (player.age + 1)) * (canvas.width - 2 * margin);
    ctx.beginPath();
    ctx.arc(x, lineY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#007bff";
    ctx.fill();
  }
}

/* New Game: Initialize Player and Start Simulation */
function newGame() {
  player = {
    name: prompt("What is your name?") || "Anonymous",
    age: 0,
    health: 100,
    happiness: 50,
    wealth: 1000,
    education: "None",
    career: "None",
    intelligence: Math.floor(Math.random() * 10) + 1,
    creativity: Math.floor(Math.random() * 10) + 1,
    social: Math.floor(Math.random() * 10) + 1,
    married: false,
    children: 0,
    history: []
  };
  document.getElementById("game-log").innerHTML = "";
  addLog("Welcome, " + player.name + "! Your journey begins now. Countless decisions await you.");
  pendingDecision = false;
  updateStatus();
  resizeCanvas();
  document.getElementById("newGameBtn").style.display = "none";
  document.getElementById("nextYearBtn").style.display = "inline-block";
}

/* Event Listeners for Simulator Controls */
document.getElementById("newGameBtn").addEventListener("click", function() { initEvents(); newGame(); });
document.getElementById("nextYearBtn").addEventListener("click", simulateYear);
document.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !pendingDecision) simulateYear();
});
resizeCanvas();
