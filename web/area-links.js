for(const link of document.querySelectorAll('[data-service-link]')){const url=new URL(link.dataset.serviceLink,location.origin);link.href=url.href;link.textContent=url.href;}
