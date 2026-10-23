<script>/* forms: JSON POST /api/feedback/client */
window.MT_FORM={FORM_ENDPOINT:'/api/feedback/client',TO:'info@mttechnology.eu',PHONE:'+359 879 345 249'};
document.querySelectorAll('form.mt-form').forEach(f=>{f.querySelectorAll('input,textarea,select').forEach((el,i)=>{if(!el.name)el.name=(el.placeholder||(el.previousElementSibling&&el.previousElementSibling.tagName==='LABEL'?el.previousElementSibling.textContent:'')||(el.tagName==='SELECT'?'Тип задачи':'Поле '+(i+1))).trim()});
const hp=document.createElement('input');hp.type='text';hp.name='website';hp.tabIndex=-1;hp.autocomplete='off';hp.setAttribute('aria-hidden','true');hp.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;opacity:0';f.appendChild(hp);
f.addEventListener('submit',async e=>{e.preventDefault();const C=window.MT_FORM,btn=f.querySelector('button[type=submit],button');
const msg=(m,ok)=>{f.querySelector('.form-ok')?.remove();const d=document.createElement('div');d.className='form-ok';d.setAttribute('role','status');d.style.cssText='margin-top:12px;padding:12px 14px;border:1px solid '+(ok?'#6fcf97':'#eb5757')+';color:'+(ok?'#6fcf97':'#f2a2a2')+';background:rgba(0,0,0,.35);font-size:14px;line-height:1.5';d.innerHTML=m;f.appendChild(d)};
const last=+sessionStorage.getItem('mtf_t')||0;if(Date.now()-last<30000){msg('Заявка уже отправлена. Повторная отправка возможна через 30 секунд.',false);return}
let name='',email='',phone='',desc='',files=0;
f.querySelectorAll('input,textarea,select').forEach(el=>{if(el===hp||!el.name)return;if(el.type==='file'){files+=el.files?el.files.length:0;return}if((el.type==='checkbox'||el.type==='radio')&&!el.checked)return;const v=String(el.value||'').trim();if(!v)return;const n=el.name;
 if(!email&&(el.type==='email'||/e-?mail|\u043f\u043e\u0447\u0442|\u043f\u043e\u0448\u0442|courriel|correo/i.test(n)))email=v;else if(!phone&&(el.type==='tel'||/\u0442\u0435\u043b\u0435\u0444|phone|telef|t[\u00e9e]l[\u00e9e]phone|tel[\u00e9e]fono/i.test(n)))phone=v;else if(!name&&/\u0438\u043c\u044f|\u0456\u043c.\u044f|\u0438\u043c\u0435|\u0444\u0438\u043e|name|nom|nombre|nome|\u043a\u043e\u043d\u0442\u0430\u043a\u0442\u043d/i.test(n))name=v;else desc+=n+': '+v+'\n'});
if(files)desc+='(Клиент выбрал файлы: '+files+' шт. — запросите их по e-mail.)\n';
if(!email){msg('Пожалуйста, укажите e-mail для ответа.',false);return}
const fail='Не удалось отправить заявку. Пожалуйста, напишите нам на <a href="mailto:'+C.TO+'" style="color:inherit">'+C.TO+'</a> или позвоните: <a href="tel:+359879345249" style="color:inherit">'+C.PHONE+'</a>.';
btn&&(btn.disabled=true);
try{const r=await fetch(C.FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:name||'—',email,phone,description:desc.trim()||'—',source:document.title,website:hp.value})});
 if(r.ok){sessionStorage.setItem('mtf_t',Date.now());f.reset();msg('Благодарим за обращение! Заявка отправлена — мы свяжемся с вами в течение рабочего дня.',true)}
 else if(r.status===429)msg('Слишком много заявок с вашего адреса. Попробуйте позже. '+fail,false);
 else msg(fail,false)}catch(_){msg(fail,false)}
btn&&(btn.disabled=false)})})</script>
