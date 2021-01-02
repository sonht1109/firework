document.addEventListener("DOMContentLoaded",function(){
    var canvas = document.getElementsByTagName('canvas')[0];
    console.log(canvas);
    var c = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.addEventListener('resize', function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    canvas.style.background = 'black';

    const colors = [
        'red', 'white', 'blue', 'purple', 'green', 'yellow', 'orange', 'pink',
        '#46FC35', '#35C9FC'
    ];

    var fireworks = [];
    var blooms = [];

    function Firework(){
        this.x = canvas.width/2;
        this.y = canvas.height + 200;
        this.radius = Math.random()*3 + 2;
        this.color = colors[Math.floor(Math.random()*colors.length)];
        this.v = {
            x: Math.random()*6 - 3,
            y: Math.random()*3 + 3
        }
        this.maxY = Math.random() * canvas.height/4 +  canvas.height/15;
        this.disappear = false;
    }

    Firework.prototype.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    Firework.prototype.explode = function(){
        if(this.y <= this.maxY){
            this.disappear = true;
            for(let i = 0; i<10; i++){
                blooms.push(new Bloom(this.x, this.y, this.radius, this.color));
            }
        }
    }

    Firework.prototype.update = function(){
        this.x -= this.v.x;
        this.y -= this.v.y;
        this.explode();
        this.draw();    
    }

    function init(){
        if(fireworks.length <= 20){
            fireworks.push(new Firework());
        }
    }
    
    /** end init */

    /** bloom */
    function Bloom(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius/2;
        this.color = color;
        this.v = {
            x: Math.random()*4 - 2,
            y: Math.random()*3 - 1
        }
        this.curvature = 0.015;
        this.time = 150;
    }

    Bloom.prototype.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    Bloom.prototype.update = function(){
        this.x -= this.v.x;
        this.y -= this.v.y;
        this.v.y -= this.curvature;
        this.time -= 1;
        this.draw();
    }

    /** end bloom */

    function animate(){
        window.requestAnimationFrame(animate);
        c.fillStyle = 'rgba(0, 0, 0, 0.1)';
        c.fillRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach(function(fw, idx){
            fw.update();
            if(fw.disappear){
                fireworks.splice(idx, 1); // delete fireworks[idx];
            }
        });
        
        blooms.forEach(function(bl, idx){
            bl.update();
            if(bl.time <= 0){
                blooms.splice(idx, 1);
            }
        })

        init();
    }
    animate();
})