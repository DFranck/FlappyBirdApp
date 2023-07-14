const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
let lastUpdateTime = Date.now();
img.src = "./media/flappy-bird-set.png";

//general settings
let gamePlaying = false;
const gravity = 0.2;
const speed = 500;
const size = [51, 36];
const jump = -8;
const cTenth = canvas.width / 10;

//pipe settings
const pipeWidth = 78;
const pipeGap = 350;
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
  const deltaTime = (Date.now() - lastUpdateTime) / 1000;
  lastUpdateTime = Date.now();
  index += deltaTime;

  //background
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * ((speed * deltaTime) / 2)) % canvas.width),
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
    canvas.width - ((index * ((speed * deltaTime) / 2)) % canvas.width),
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
      pipe[0] -= speed * deltaTime;
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
  window.requestAnimationFrame(render);
};

img.onload = render;
document.addEventListener("click", () => (gamePlaying = true));
window.onclick = () => (flight = jump);

setup();
