const canvasEl = document.querySelector('canvas');
const canvasCtx = canvasEl.getContext('2d');
const gapX = 10;

const lineWidth = 15; /*Pode ser alterado para 20, 30...LINHA CENTRAL*/

//Movimento da raquete:
const mouse = { x:0, y:0 };

// ORIENTADO A OBJETO: 
    //Objeto CAMPO:
const field = {          // Desenho do campo:
    w:  window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        canvasCtx.fillStyle = '#286047';
        canvasCtx.fillRect(0, 0, this.w, this.h);
    },
}
    //Objeto LINHA: 
const line = {         // Desenho da linha central:
    w: 15,
    h: field.h,
    draw: function() {
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.fillRect(
            field.w / 2 - this.w / 2,
            0,
            this.w,
            field.h,
        );
    },
}
//Objeto das RAQUETES:
const leftPaddle = {     // Desenho da raquete esquerda:
    x: gapX,
    y: 400,
    w: line.w,
    h: 200,
    _move: function() {
        this.y = mouse.y - this.h /2 /*Colocar o mouse no meio da raquete*/;
    },
    draw: function () {
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    }
}
const rightPaddle = {     // Desenho da raquete direita:
    x: field.w - line.w - gapX,
    y: 200,
    w: line.w,
    h: 200,
    speed: 5,
    _move: function() {
        if (this.y + this.h /2 < ball.y + ball.r){
            this.y += this.speed;
        } else { 
            this.y -= this.speed;
        }
    },
    speedUp: function (){
        this.speed += 2;
    },
    draw: function () {
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    }
}

//Objeto do PLACAR:
const score = {      // Desenho do placar:
    human: 0,
    computer: 0,
    increaseHuman: function() {
        this.human++;
    },
    increaseComputer: function() {
        this.computer++;
    },
    draw: function () {
        canvasCtx.font = 'bold 72px Arial';
        canvasCtx.textAlign = 'center';
        canvasCtx.textBaseline = 'top';
        canvasCtx.fillStyle = '#01341D';
        canvasCtx.fillText(this.human, field.w / 4, 50);
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50);
    }
}

//Objeto da BOLA:
const ball = {     // Desenho da bola:  arc(x, y, r, início do arco, 2*Math.PI, false )
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 8,
    directionX: 1,
    directionY: 1,
    _calcPosition: function() {
        //Verificar se o jogador 1 fez ponto (x>largura do campo)
        if (this.x > field.w - this.r - rightPaddle.w - gapX) {
            //Verifica se a raquete direita está na posição y da bola
            if (this.y + this.r > rightPaddle.y && this.y -this.r < rightPaddle.y + rightPaddle.h){
                //Rebate a bola invertendo o sinal de X
                this._reverseX();
            } else { 
                //Fazer pontuar o jogador 1
                score.increaseHuman();
                this._pointUp();
            }
        }
        //Verificar se o jogador 2 fez um ponto (x < 0)
        if (this.x < this.r + leftPaddle.w + gapX){
            //Verifica se a raquete esquerda está na posição y da bola
            if (this.y + this.r > leftPaddle.y && 
                this.y - this.r < leftPaddle.y + leftPaddle.h){
                //rebate a bola invertendo o sinal de X
                this._reverseX();
            } else { 
                //Pontuar o jogador 2
                score.increaseComputer();
                this._pointUp();
            }
        }


        //Verificar laterais superior e inferior
        if(
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0)
        ) {
            //Ele rebate a bola invertendo o sinal do eixo Y
            this._reverseY();
        }

    },
    _reverseX: function(){
        this.directionX *= -1;

    },
    _reverseY: function(){
        this.directionY *= -1;

    },
    _speedUp: function() { //Incrementando velocidade da bola
        this.speed += 1;
    },
    //Colocar a bola no meio do campo
    _pointUp: function (){
        this._speedUp();
        rightPaddle.speedUp();

        this.x = field.w / 2;
        this.y = field.h / 2;
    },
    _move: function() {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    },
    draw: function () {
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false)
        canvasCtx.fill();
        
        this._calcPosition();
        this._move();
    },
}

function setup() {
    canvasEl.width = field.w;
    canvasEl.height = field.h;
    canvasCtx.width = field.w;
    canvasCtx.height = field.h;

}

function draw() {
    //Chamada do Objeto CAMPO: 
    field.draw();

    //Chamada do Objeto LINHA:
    line.draw();

    //Chamada do Objeto Raquete Esquerda: 
    leftPaddle.draw();

    //Chamada do Objeto Raquete Direita:
    rightPaddle.draw();

    //Chamada do Objeto do PLACAR - Antes da bola para não sobressair a bola: 
    score.draw();

    //Chamada do Objeto BOLA:
    ball.draw();

}

//Suavizando a animação: 
window.animateFrame = (function (){
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000/60 )
        }
    )
}) ()

function main() {
    animateFrame(main);
    draw();
}
setup();
main();

//Movimento da Raquete:
canvasEl.addEventListener('mousemove', function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;
});
