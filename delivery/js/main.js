'use strict';




const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth=document.querySelector('.button-auth');
const modalAuth=document.querySelector('.modal-auth');
const closeAuth=document.querySelector('.close-auth');
const logInForm=document.querySelector('#logInForm');
const loginInput=document.querySelector('#login');
const userName=document.querySelector('.user-name');
const buttonOut=document.querySelector('.button-out');
const cardsRe=document.querySelector('.cards-restaurants');
const containerPromo=document.querySelector('.container-promo');
const restaurants=document.querySelector('.restaurants');
const menu=document.querySelector('.menu');
const logo=document.querySelector('.logo');
const cardsMenu=document.querySelector('.cards-menu');

let login=localStorage.getItem('gloDelivery');

function toggleModal() {
  modal.classList.toggle("is-open");
}


function toogleModalAuth() {
    modalAuth.classList.toggle('is-open');
    if(modalAuth.classList.contains('is-open')){
        disableScroll();
    } else {
        enableScroll();
    }
}



function authorized() {
    function logOut() {
        login=null;
        localStorage.removeItem('gloDelivery');
         buttonAuth.style.display='';
    userName.style.display='';
    buttonOut.style.display='';
        buttonOut.removeEventListener('click',logOut);
        
        checkAuth();
        
    }
    console.log('authorised');
    userName.textContent=login;
    buttonAuth.style.display='none';
    userName.style.display='inline';
    buttonOut.style.display='block';
    buttonOut.addEventListener('click',logOut);
    
}
function notAuthorized() {
    
   function logIn(event){
       
       event.preventDefault();
       if(loginInput.value.trim()){
       login=loginInput.value;
       localStorage.setItem('gloDelivery',login);
       toogleModalAuth();
       buttonAuth.removeEventListener('click',toogleModalAuth);
       closeAuth.removeEventListener('click',toogleModalAuth);
       logInForm.removeEventListener('submit', logIn);
       logInForm.reset();
       checkAuth();
   }else{
       loginInput.style.borderColor='#ff0000';
       loginInput.value='';
   } 
   }
       buttonAuth.addEventListener('click',toogleModalAuth);
       closeAuth.addEventListener('click',toogleModalAuth);
       logInForm.addEventListener('submit', logIn);
       modalAuth.addEventListener('click', function(event) {
        if(event.target.classList.contains('is-open')) {
            toogleModalAuth();
        }
    });
    
}
function checkAuth(){
if(login) {
   authorized();
   }else{
   notAuthorized();
   }
}




//important*/
function createCardRe(){
    const card=`
        <a class="card card-restaurant">
						<img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">Пицца плюс</h3>
								<span class="card-tag tag">50 мин</span>
							</div>
							
							<div class="card-info">
								<div class="rating">
									4.5
								</div>
								<div class="price">От 900 ₽</div>
								<div class="category">Пицца</div>
							</div>
							
						</div>
				
					</a>
					
`;
    cardsRe.insertAdjacentHTML('beforeend',card);
}




function createCardGood() {
    const card=document.createElement('div');
    card.className='card';
    
    card.insertAdjacentHTML('beforeend',`
                
						<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">Пицца Классика</h3>
							</div>
							<!-- /.card-heading -->
							<div class="card-info">
								<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
									грибы.
								</div>
							</div>
							<!-- /.card-info -->
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">510 ₽</strong>
							</div>
						</div>
						
				
`);
    
    
    cardsMenu.insertAdjacentElement('beforeend', card);
}






function openGoods(event){
    const target=event.target;
    
    const re=target.closest('.card-restaurant');
    if(re){
         cardsMenu.textContent='';
        
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
        
       
        
        createCardGood();
        createCardGood();
        createCardGood();
    }
   
}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

buttonAuth.addEventListener('click',toogleModalAuth);
closeAuth.addEventListener('click',toogleModalAuth);

cardsRe.addEventListener('click', openGoods);
logo.addEventListener('click',function(){
     containerPromo.classList.remove('hide');
        restaurants.classList.remove('hide');
        menu.classList.add('hide');
})

checkAuth();

createCardRe();
createCardRe();
createCardRe();
//not important
/*const hiObj={
    hi:'hello'
}


localStorage.setItem('hiObjJSON', JSON.stringify(hiObj));
localStorage.setItem('hiObjNotJSON',hiObj);
localStorage.removeItem('hiObjNotJSON');
console.log(JSON.parse(localStorage.getItem('hiObjJSON')).hi);
console.log(localStorage.getItem('hiObjNotJSON'));*/