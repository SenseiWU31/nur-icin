(() => {
  const content=document.querySelector("#letter-content");
  const heartField=document.querySelector("#heart-field");
  if(!content)return;

  const escapeHTML=(text) => text
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
  const formatInline=(text) => escapeHTML(text)
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>");

  const renderLetter=(source) => {
    const blocks=source.trim().split(/\r?\n\s*\r?\n/);
    const fragment=document.createDocumentFragment();
    let revealIndex=0;
    blocks.forEach((block,index) => {
      const lines=block.split(/\r?\n/);
      const isHeading=lines[0].startsWith("# ")||index===0&&lines[0].includes("Artık Biz Varız");
      const element=document.createElement(isHeading?"h1":"p");
      const text=lines[0].startsWith("# ")?lines[0].slice(2):lines.join("\n");
      element.innerHTML=formatInline(text);
      if(!isHeading){
        element.classList.add("reveal");
        element.style.transitionDelay=Math.min(revealIndex*35,210)+"ms";
        revealIndex+=1;
      }
      fragment.append(element);
    });
    content.replaceChildren(fragment);
    const paragraphs=content.querySelectorAll(".reveal");
    if(!("IntersectionObserver" in window)){
      paragraphs.forEach((paragraph) => paragraph.classList.add("is-visible"));
      return;
    }
    const observer=new IntersectionObserver((entries,currentObserver) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },{rootMargin:"0px 0px -7% 0px",threshold:.05});
    paragraphs.forEach((paragraph) => observer.observe(paragraph));
  };

  fetch("letter.txt")
    .then((response) => {
      if(!response.ok)throw new Error("Mektup dosyası yüklenemedi.");
      return response.text();
    })
    .then(renderLetter)
    .catch(() => {
      content.innerHTML='<p class="load-error">Mektup açılamadı. letter.txt dosyasının siteyle aynı klasörde olduğundan emin ol.</p>';
    });

  const addHeart=() => {
    if(!heartField||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const heart=document.createElement("span");
    heart.className="floating-heart";
    heart.textContent=Math.random()>.74?"♡":"♥";
    heart.style.left=(Math.random()*100)+"%";
    heart.style.fontSize=(11+Math.random()*17)+"px";
    heart.style.setProperty("--duration",(9+Math.random()*7)+"s");
    heart.style.setProperty("--drift",Math.round(Math.random()*80-40)+"px");
    heartField.append(heart);
    window.setTimeout(() => heart.remove(),17000);
  };
  let heartTimer;
  const scheduleHeart=() => {heartTimer=window.setTimeout(() => {addHeart();scheduleHeart();},620+Math.random()*1000);};
  scheduleHeart();
  window.addEventListener("pagehide",() => window.clearTimeout(heartTimer),{once:true});
})();
