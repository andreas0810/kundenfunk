// Local device time, without requests or tracking.
(() => {
 const time=new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit'});
 const date=new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'short'});
 function update(){const now=new Date();document.querySelectorAll('[data-wa-clock]').forEach(element=>{element.textContent=time.format(now);element.dateTime=now.toISOString();});document.querySelectorAll('[data-wa-date]').forEach(element=>{element.textContent=date.format(now);});}
 update();setInterval(update,1000);document.addEventListener('visibilitychange',update);
})();
