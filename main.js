var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var gameover = false

canvas.width = window.innerWidth-22;
canvas.height = window.innerHeight-23;

var background_sound = new Audio('music.mp3');
var jump_sound = new Audio('jump.ogg');
var end_sound = new Audio('end.ogg');


var img_heartbar=[]
var img_heartbar1 = new Image();
img_heartbar1.src = 'heartbar1.PNG'
var img_heartbar2 = new Image();
img_heartbar2.src = 'heartbar2.PNG'
var img_heartbar3 = new Image();
img_heartbar3.src = 'heartbar3.PNG'
var img_heartbar4 = new Image();
img_heartbar4.src = 'heartbar4.PNG'
var img_heartbar5 = new Image();
img_heartbar5.src = 'heartbar5.PNG'
var img_heartbar6 = new Image();
img_heartbar6.src = 'heartbar6.PNG'

var img_heartbar=[img_heartbar1, img_heartbar2, img_heartbar3, img_heartbar4, img_heartbar5, img_heartbar6];


var img_background=[]
var img_background1 = new Image();
img_background1.src = 'back1.PNG';
var img_background2 = new Image();
img_background2.src = 'back2.PNG';
var img_background3 = new Image();
img_background3.src = 'back3.PNG';
var img_background4 = new Image();
img_background4.src = 'back4.PNG';
var img_background5 = new Image();
img_background5.src = 'back5.jpg';

var img_background=[img_background1, img_background2, img_background3, img_background4, img_background5];

var back = {
    x:0,
    y:0,
    width:canvas.width,
    height:canvas.height,

    draw(){
        if(level<=3){
            ctx.drawImage(img_background[0], this.x, this.y, this.width, this.height);
            ctx.drawImage(img_heartbar[0], 100, this.y, 1100, 70);
            ctx.font = '40px Cooper';
            ctx.fillStyle = 'white';
            ctx.fillText('LEVEL :'+ level, 10,120);
        }

        if(level>=4&&level<=6){
            ctx.drawImage(img_background[1], this.x, this.y, this.width, this.height);
            ctx.drawImage(img_heartbar[1], 100, this.y, 1100, 70);
            ctx.fillStyle = 'yellow';
            ctx.fillText('LEVEL :'+ level, 10,120);
        }
        if(level>=7&&level<=9){
            ctx.drawImage(img_background[2], this.x, this.y, this.width, this.height);
            ctx.drawImage(img_heartbar[2], 100, this.y, 1100, 70);
            ctx.fillStyle = 'blue';
            ctx.fillText('LEVEL :'+ level, 10,120);
        }
        if(level>=10&&level<=12){
            ctx.drawImage(img_background[3], this.x, this.y, this.width, this.height);
            ctx.drawImage(img_heartbar[3], 100, this.y, 1100, 70);
            ctx.fillStyle = 'purple';
            ctx.fillText('LEVEL :'+ level, 10,120);
        }
        if(level>12){
            ctx.drawImage(img_background[4], this.x, this.y, this.width, this.height);
            ctx.drawImage(img_heartbar[4], 100, this.y, 1100, 70);
            ctx.fillStyle = 'red';
            ctx.fillText('LEVEL :'+ level, 10,120);
        }
    }
}
back.draw();




var img_user=[]
var img_user1 = new Image();
img_user1.src = 'c1.png';
var img_user2 = new Image();
img_user2.src = 'c2.png';
var img_user3 = new Image();
img_user3.src = 'c3.png';
var img_user4 = new Image();
img_user4.src = 'c4.png';
var img_user5 = new Image();
img_user5.src = 'c5.png';

img_user=[img_user1, img_user2, img_user3, img_user4, img_user5];

var user = {
    x:10,
    y:500,
    width:80,
    height:80,
    img_index:0,

    draw(a){
        if(a%5==0){//5프레림마다(0,1,2,3,4 이후 1씩 img_index 증가)
            this.img_index = (this.img_index+1)%4
        }
        if(user.y<500&&gameover==false){
            ctx.drawImage(img_user[3], this.x, this.y, 140, 120);
        }
        if(gameover==true){
            ctx.drawImage(img_user[4], this.x, this.y, 140, 120);
            ctx.drawImage(img_heartbar[5], 100, 0, 1100, 70);
            cancelAnimationFrame(animation);
        }

        else{
            ctx.drawImage(img_user[this.img_index], this.x, this.y, 140, 120);
        }
    }
}
user.draw(0);

var img_bomb = new Image();
img_bomb.src = 'ob.png'

class Bomb{//장애물
    constructor(){
        this.x = 1500;
        this.y = 500;
        this.width = 100;
        this.height = 100;
    }
    draw(){
        // ctx.fillStyle = 'red';
        // ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(img_bomb, this.x,this.y,this.width,120);
    }
    
}
//var bomb = new Bomb();
//bomb.draw()

var timer = 0 //프레임 측정
var bombs = []//장애물 리스트
var jumpingTimer = 0; //60프레임 세주는 변수
var animation;
var score = 0;
var level = 1;

function frameSecond(){
    //1초마다 60번 코드 실행
    animation = requestAnimationFrame(frameSecond);
    timer++;

    //프레임 돌때마다 프레임에 있는 요소들 clear해주는 함수
    ctx.clearRect(0,0,canvas.width, canvas.height);

    //배경 추가
    back.draw();
    //점수 추가
    //gameScore();
    //배경음악 재생
    background_sound.play();

    if(timer % 60 == 0){//1초마다
        var bomb = new Bomb();
        bombs.push(bomb);
    }

    bombs.forEach((b,i,o)=>{
        if(b.x < 0){
            //i가 가리키는 값에서부터 1개 삭제
            o.splice(i,1);
            score++;
            levelup();
        }
        b.x=b.x-10-(level*2);


        collision(user,b);
        b.draw();
    })
    if(jumping == true){
        user.y=user.y-12;
        jumpingTimer++;
    }
    if(jumpingTimer>15){
        jumping = false;
        jumpingTimer = 0;
    }
    //jumping이 false이고 user.y가 250미만이면 하강
    if(jumping == false && user.y<500){
        user.y=user.y+12;
    }
    show_gameScore();
    user.draw(timer);
    
  

   
}
frameSecond();

//충돌 확인 코드
function collision(user, bomb){
    var x_diff = bomb.x - (user.x+user.width);
    var y_diff = bomb.y - (user.y+user.height);
    if(x_diff <0 && y_diff<0){
        gameover=true
        //프레임 돌떄마다 프레임에 있는 요소들 clear 해주는 함수
        //ctx.clearRect(0,0,canvas.width, canvas.height);
        end_sound.play();
        background_sound.pause();
    }
}

var jumping = false;
document.addEventListener('keydown', function(e){
    if(e.code === 'Space'&& user.y==500){
        jump_sound.play();
        jumping = true;
    }
})
// function gameScore(){
//     ctx.font = '20px Cooper';
//     ctx.fillStyle = 'white';
//     ctx.fillText('SCORE : '+ Math.round(timer/100) , 10, 30);
// }

function show_gameScore(){
    ctx.font = '40px Cooper';
    ctx.fillStyle = 'white';
    ctx.fillText('SCORE :'+ score, 1250,50);
}

function levelup(){
    if(score%3==0){
        level++;
    }
}
