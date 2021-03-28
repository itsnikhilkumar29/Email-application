document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#submitmail').addEventListener('click',submit_mail);
  // By default, load the inbox
  load_mailbox('inbox');
});
function submit_mail() {
	var rec=document.querySelector('#compose-recipients').value;
	var sub=document.querySelector('#compose-subject').value;
	var b=document.querySelector('#compose-body').value;
	fetch('/emails',{
		method:'POST',
		body:JSON.stringify({
			recipients:rec,
			subject:sub,
			body:b
		})
	})
	.then(response=>response.json())
	.then(result=>{
		console.log(result);
	})
}
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  load_allmails(mailbox);
}
function load_allmails(mailbox){
	fetch('/emails/'+mailbox)
	.then(response=>response.json())
	.then(emails=>{
		console.log(emails);
		for(email of emails){
			const element=document.createElement('div');
			var temp='';
			if(email.read==false){
				temp+='* ';
			}
			var emailview=document.querySelector('#emails-view');
			element.innerHTML=temp+email.sender+'_____'+email.subject;
			button=document.createElement('button');
			button.id=email.id;
			button.innerHTML='view mail';
			element.append(button);
			button.addEventListener('click',()=>{
				document.querySelector('#emails-view').innerHTML='';
				var heading=document.createElement('h4');
				heading.innerHTML='From: '+email.sender+'<br>'+'To: '+email.recipients;
				emailview.append(heading);
				
				var time=document.createElement('label');
				time.innerHTML=email.timestamp;
				emailview.append(time);
				
				emailview.append(document.createElement('br'))
				var sub=document.createElement('b');
				sub.innerHTML='Subject: '+email.subject;
				emailview.append(sub);
				
				var body=document.createElement('p');
				body.innerHTML=email.body;
				body.style.fontFamily='consolas';
				emailview.append(body);
				
				var arc=document.createElement('button');
				if(email.archived==false){
					arc.innerHTML='Archive';
				}else{
					arc.innerHTML='UnArchive';
				}
				console.log(arc.innerHTML);
				arc.addEventListener('click',()=>{
					if(arc.innerHTML=='Archive'){
						arc.innerHTML='UnArchive';
						fetch('/emails/'+email.id,{
							method:'PUT',
							body:JSON.stringify({
								archived:true,
							})
						})
					}else{
						arc.innerHTML='Archive';
						fetch('/emails/'+email.id,{
							method:'PUT',
							body:JSON.stringify({
								archived:false,
							})
						})
					}
				})
				emailview.append(arc);
			});
			document.querySelector('#emails-view').append(element);
		}
	})
}