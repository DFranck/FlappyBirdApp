const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";
const buttons = document.querySelectorAll("button");
let gravitySetup = document.getElementById("gravitySetup");
let speedSetup = document.getElementById("speedSetup");
let jumpSetup = document.getElementById("jumpSetup");
let pipeSetup = document.getElementById("pipeSetup");

const setups = document.querySelector(".setups");

const minSpeed = 1;
const maxSpeed = 5;
const minGravity = 0.15;
const maxGravity = 0.5;
const gravityIncrement = 0.1;
const minJump = -10;
const maxJump = -5;
const minGape = 250;
const maxGape = 500;
const gapeincrement = 10;

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    console.log(e.target.id);
    if (e.target.id == "more-speed" && speed < maxSpeed) {
      speed++;
      speedSetup.innerText = speed + "m/s";
    } else if (e.target.id == "less-speed" && speed > minSpeed) {
      speed--;
      speedSetup.innerText = speed + "m/s";
    }
    if (e.target.id == "more-gravity" && gravity < maxGravity) {
      gravity += gravityIncrement;
      gravitySetup.innerText = parseFloat(gravity.toFixed(1)) + "g";
      console.log(gravity);
    } else if (e.target.id == "less-gravity" && gravity > minGravity) {
      gravity -= gravityIncrement;
      gravitySetup.innerText = parseFloat(gravity.toFixed(1)) + "g";
    }
    if (e.target.id == "more-jump" && jump > minJump) {
      jump--;
      jumpSetup.innerText = -jump + "m";
      console.log(jump);
    } else if (e.target.id == "less-jump" && jump < maxJump) {
      jump++;
      jumpSetup.innerText = -jump + "m";
      console.log(jump);
    }
    if (e.target.id == "more-gape" && pipeGap < maxGape) {
      pipeGap += gapeincrement;
      pipeSetup.innerText = pipeGap / 10 + "px";
    } else if (e.target.id == "less-gape" && pipeGap > minGape) {
      pipeGap -= gapeincrement;
      pipeSetup.innerText = pipeGap / 10 + "px";
    }
  });
});

//general settings
let gamePlaying = false;
let gravity = 0.2;
gravitySetup.innerText = gravity + "g";
let speed = 2;
speedSetup.innerText = speed + "m/s";
const size = [51, 36];
let jump = -8;
jumpSetup.innerText = -jump + "m";
const cTenth = canvas.width / 10;

//pipe settings
const pipeWidth = 78;
let pipeGap = 300;
pipeSetup.innerText = pipeGap / 10 + "m";
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth;

let index = 0,
  bestScore = 0,
  currentScore = 0,
  pipes = [],
  flight,
  flyheight;

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyheight = canvas.height / 2 - size[1] / 2;

  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
};

const render = () => {
  index++;

  //background
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  //background2
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );

  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyheight,
      ...size
    );
    flight += gravity;
    flyheight = Math.min(flyheight + flight, canvas.height - size[1]);
  } else {
    //Text
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText(`Cliquez pour jouer`, 48, 535);
    ctx.font = "bold 30px courier";

    //Bird
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyheight,
      ...size
    );
    flyheight = canvas.height / 2 - size[1] / 2;
  }
  //pipe display
  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;
      //top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      //bottom pipe
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        //remove pipe + create new one
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
        console.log(pipes);
      }
      //if hit the pipe, end
      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyheight || pipe[1] + pipeGap < flyheight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  document.getElementById("bestScore").innerHTML = `Meilleur :${bestScore}`;
  document.getElementById("currentScore").innerHTML = `Actuel :${currentScore}`;
  if (gamePlaying) {
    setups.style.visibility = "hidden";
  } else {
    setups.style.visibility = "visible";
  }
  window.requestAnimationFrame(render);
};

img.onload = render;
canvas.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);

setup();
