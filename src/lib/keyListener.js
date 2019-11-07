let playerSpriteX = 0;

document.addEventListener('keyup', (e) => {
  if (e.code === "ArrowRight")        playerSpriteX += 10
  else if (e.code === "ArrowLeft") playerSpriteX -= 10
  console.log(playerSpriteX);
});


