(() => {
  const playground=document.querySelector("#button-playground");
  const yesButton=document.querySelector("#yes-button");
  const noButton=document.querySelector("#no-button");
  const heartField=document.querySelector("#heart-field");
  if(!playground||!yesButton||!noButton)return;

  let attempts=0;
  let heartTimer;

  noButton.addEventListener("click",() => {
    attempts+=1;
    const area=playground.getBoundingClientRect();
    const button=noButton.getBoundingClientRect();
    const padding=6;
    const maxX=Math.max(padding,area.width-button.width-padding);
    const maxY=Math.max(padding,area.height-button.height-padding);
    const x=padding+Math.random()*Math.max(0,maxX-padding);
    const y=padding+Math.random()*Math.max(0,maxY-padding);
    noButton.classList.add("is-running");
    noButton.style.left=(x+button.width/2)+"px";
    noButton.style.top=(y+button.height/2)+"px";
    noButton.style.setProperty("--no-rotation",Math.round(Math.random()*12-6)+"deg");
    const scale=Math.min(1+attempts*.12,2.65);
    yesButton.style.transform="scale("+scale+")";
    yesButton.style.boxShadow="0 "+(9+attempts)+"px "+(22+attempts*2)+"px rgba(200,78,112,.28)";
  });

  const addHeart=() => {
    if(!heartField||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const heart=document.createElement("span");
    heart.className="floating-heart";
    heart.textContent=Math.random()>.7?"♡":"♥";
    heart.style.left=(Math.random()*100)+"%";
    heart.style.fontSize=(12+Math.random()*18)+"px";
    heart.style.setProperty("--duration",(8+Math.random()*7)+"s");
    heart.style.setProperty("--drift",Math.round(Math.random()*100-50)+"px");
    heartField.append(heart);
    window.setTimeout(() => heart.remove(),16000);
  };
  const scheduleHeart=() => {
    heartTimer=window.setTimeout(() => {addHeart();scheduleHeart();},500+Math.random()*850);
  };
  scheduleHeart();
  window.addEventListener("pagehide",() => window.clearTimeout(heartTimer),{once:true});
})();
