
const firebaseConfig = {
  apiKey: "AIzaSyA1Piy_T22xDlndrUrqmEY94cxNQvjr4Bc",
  authDomain: "pikadu-5b8fa.firebaseapp.com",
  databaseURL: "https://pikadu-5b8fa.firebaseio.com",
  projectId: "pikadu-5b8fa",
  storageBucket: "pikadu-5b8fa.appspot.com",
  messagingSenderId: "630036722285",
  appId: "1:630036722285:web:8b40f8ad1f1b34418f8564"
};
//console.log(firebase);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');
// отслеживаем клик по кнопке меню и запускаем функцию 




const loginElem=document.querySelector('.login');
const loginForm=document.querySelector('.login-form');
const emailInput=document.querySelector('.login-email');
const passwordInput=document.querySelector('.login-password');
const loginSignup=document.querySelector('.login-signup');

const regExpValidEmail=/^\w+@\w+\.\w{2,}$/;

const userElem=document.querySelector('.user');
const userNameElem=document.querySelector('.user-name');
const exitElem=document.querySelector(".exit");
const editElem=document.querySelector(".edit");
const editContainer=document.querySelector(".edit-container");

const editUsername=document.querySelector('.edit-username');
const editPhotoUrl=document.querySelector('.edit-photo');

const userAvatarElem=document.querySelector('.user-avatar');

const postsWrapper=document.querySelector('.posts');

const addPostElem=document.querySelector('.add-post');
const buttonNewPost=document.querySelector('.button-new-post');

/*const listUsers=[
    {
        email:"maks@mail.com",
        password:"12345",
        displayName:'MaksJS',
            photo:'https://im0-tub-ru.yandex.net/i?id=574eb35094375e8264a7715c6b8b3277&ref=rim&n=33&w=400&h=225'
            
    },
    {
        email:"Ann@mail.com",
        password:"54321",
        displayName:'Annee'
    }
];*/

const setUsers={
    use:null,
    initUser(handler){
        firebase.auth().onAuthStateChanged(user=>{
          if(user){
            this.user=user;
            console.log('user in setUsers',user.displayName);

          }else{
            this.user=null;
          }
          if(handler) handler();
        });
    },
    logIn(email,password,handler){
         
        
        if(!regExpValidEmail.test(email)) return alert("email is not valid");

        firebase.auth().signInWithEmailAndPassword(email,password)
        .catch(err=>{
          const errCode=err.code;
        const errMessage=err.message;
        alert(errMessage);
        console.log(err);
        });
        //const user=this.getUser(email);
        /*if(user && user.password===password){
            this.authorizedUser(user);
            handler();
        }else{
            alert('user with such data is not faund');
        }*/
    },
    logOut(){
        firebase.auth().signOut();
        },
    signUp(email,password,handler){
          if(!regExpValidEmail.test(email)) return alert("email is not valid");
        if( !email.trim() || !password.trim()){
            alert('enter data');
            return;
        }
      firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(data=>{
        console.log('displayName in SignUp: ',email.substring(0,email.indexOf('@')));
        this.editUser(email.substring(0,email.indexOf('@')),null,handler);
      }).catch(err=>{
        const errCode=err.code;
        const errMessage=err.message;
        
        alert(errMessage);
        
      });

     /* if(!this.getUser(email)){
          const user={email,password,displayName:(email.split('@'))[0]};
          listUsers.push({email,password,displayName:(email.split('@'))[0]});
          
          this.authorizedUser(user);
          handler();
      }else{
          alert('user already exists');
      }*/
    },
    /*getUser(email){
    return listUsers.find(item=> item.email===email);
        
    },
    authorizedUser(user){
        this.user=user;
    },*/
    editUser(displayName,photoURL, handler ){
        const user=firebase.auth().currentUser;
        console.log('user in edit:',user);
        
        if(displayName){
          if(photoURL){
            user.updateProfile({
              displayName,
              photoURL
            }).then(handler);
        }else{
          user.updateProfile({displayName }).then(handler);
        }
     }
  }
};
const setPosts={
  allPosts:[],
  addPost(title,text,tags,handler){
    const user=firebase.auth().currentUser;

    this.allPosts.unshift({
      id:`postID${(+new Date()).toString(16)}-${user.uid}`,
      title,
      text,
      tags: tags.split(',').map(item=>item.trim()),
      author: {
        displayName:setUsers.user.displayName,
        photo:setUsers.user.photoURL,
      },
      date: new Date().toLocaleString(),
      like: 0,
      comments: 0
    });
      firebase.database().ref('post').set(this.allPosts)
      .then(()=>this.getPosts(handler));
     
      console.log('author ',author);
  },
  getPosts(handler){
    firebase.database().ref('post').on('value',snapshot=>{
      this.allPosts=snapshot.val() || [];
      //console.log('author!!!! ',author);
    
      if(handler) handler();
    }); 
   }  


};

const toggleAuthDom=()=>{
    const user=setUsers.user;
    console.log('user:',user);
    
    if(user){
        loginElem.style.display='none';
        userElem.style.display='';
        userNameElem.textContent=user.displayName;
        userAvatarElem.src=user.photoURL || userAvatarElem.src;
        buttonNewPost.classList.add('visible');
        //todo delete

        
    }else{
        loginElem.style.display='';
        userElem.style.display='none';
        buttonNewPost.classList.remove('visible');
        addPostElem.classList.remove('visible');
        postsWrapper.classList.add('visible');
        
    }
    
};

const showAddPost=()=>{
        addPostElem.classList.add('visible');
        postsWrapper.classList.remove('visible');
} 
 const showAllPosts=()=>{
  let postsHTML='';
  setPosts.allPosts.forEach(({title,text,date,tags,comments,like,author})=>{
        
        postsHTML += `
        <section class="post">
        <div class="post-body">
          <h2 class="post-title">${title}</h2>
          <p class="post-text">${text}</p>
          <div class="tags">
          ${tags.map(tag=>` <a href="#" class="tag">${tag}</a>`)}
          </div>
          
        </div>
        <!-- /.post-body -->
        <div class="post-footer">
          <div class="post-buttons">
            <button class="post-button likes">
              <svg width="19" height="20" class="icon icon-like">
                <use xlink:href="img/icons.svg#like"></use>
              </svg>
              <span class="likes-counter">${like}</span>
            </button>
            <button class="post-button comments">
              <svg width="21" height="21" class="icon icon-comment">
                <use xlink:href="img/icons.svg#comment"></use>
              </svg>
              <span class="comments-counter">${comments}</span>
            </button>
            <button class="post-button save">
              <svg width="19" height="19" class="icon icon-save">
                <use xlink:href="img/icons.svg#save"></use>
              </svg>
            </button>
            <button class="post-button share">
              <svg width="17" height="19" class="icon icon-share">
                <use xlink:href="img/icons.svg#share"></use>
              </svg>
            </button>
          </div>
          <!-- /.post-buttons -->
          <div class="post-author">
            <div class="author-about">
              <a href="#" class="author-username">${author}</a>
              <span class="post-time">${date}</span>
            </div>
            <a href="#" class="author-link"><img src=author.photoURL||"img/avatar.jpeg" alt="avatar" class="author-avatar"></a>
          </div>
          <!-- /.post-author -->
        </div>
        <!-- /.post-footer -->
      </section>
        
        `;
    });  
    postsWrapper.innerHTML=postsHTML;
    addPostElem.classList.remove('visible');
  postsWrapper.classList.add('visible');
 };



const init=()=>{
   
loginForm.addEventListener('submit',()=>{
    event.preventDefault();
    
    const emailValue=emailInput.value;
    const passwordValue=passwordInput.value;
    
    setUsers.logIn(emailValue,passwordValue,toggleAuthDom);
     loginForm.reset();
});
loginSignup.addEventListener('click', event=>{
    event.preventDefault();
  
     const emailValue=emailInput.value;
    const passwordValue=passwordInput.value;
    
    setUsers.signUp(emailValue,passwordValue,toggleAuthDom);
    loginForm.reset();
   
});

exitElem.addEventListener('click',event=>{
    event.preventDefault();
    setUsers.logOut();
    
});

editElem.addEventListener('click', event=>{
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value=setUsers.user.displayName;
});

editContainer.addEventListener('submit', event=>{
    event.preventDefault();
    setUsers.editUser(editUsername.value,editPhotoUrl.value,toggleAuthDom);
    editContainer.classList.remove('visible');
});
menuToggle.addEventListener('click', function (event) {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  });
  buttonNewPost.addEventListener('click', event=>{
    event.preventDefault();
    showAddPost();
  });
addPostElem.addEventListener('submit',event=>{
  event.preventDefault();
  const { title,text,tags }=addPostElem.elements;
  
  if(title.value.length<6){
    alert('too short title');
  return;
  }

  if(text.value.length<60){
    alert('too short post');
    return;
  }
  setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
  addPostElem.classList.remove('visible');
  addPostElem.reset();
});
setUsers.initUser(toggleAuthDom);
setPosts.getPosts(showAllPosts);
//toggleAuthDom();
}
document.addEventListener('DOMContentLoaded',init);
    
   

/*const obj={ 
    foo(){
    console.log(this);
}}

const bar=obj.foo;
bar();

console.log(this);*/
