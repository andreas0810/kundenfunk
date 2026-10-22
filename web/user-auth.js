export async function api(path,method='GET',body){
 const response=await fetch(path,{method,credentials:'same-origin',headers:{'content-type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{}),cache:'no-store',signal:AbortSignal.timeout(180000)});
 const data=await response.json();if(!response.ok){if(response.status===401&&!path.startsWith('/v1/auth/'))location.replace(loginURL(location.pathname.startsWith('/admin')||location.pathname.startsWith('/operator')?'admin':'customer'));const error=new Error(data.error||'request_failed');error.status=response.status;error.data=data;throw error;}return data;
}
export const loginURL=role=>role==='admin'?'/admin/anmelden/':'/kunden/anmelden/';
export async function viewUser(role){
 const {user}=await api('/v1/auth/session');
 if(!user){location.replace(loginURL(role));return null;}
 if(user.role!==role)throw Error('forbidden');return user;
}
