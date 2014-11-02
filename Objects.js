function Player(x, y){
    Body.call(this, x, y, 20, 28, .15, game.gravity*1.6);
    
    this.jumpt = false;
    this.timeSinceLastShoot = 0;
    this.dir = 1;
}
Player.prototype = Object.create(Body.prototype);

Player.prototype.update= function(){
    this.wantsToJump = game.controls.keys.up;
    if(game.controls.keys.left){
        this.vel.x -= this.speed;
        this.dir = -1;
    }
    if(game.controls.keys.down) this.vel.y += this.speed;
    if(game.controls.keys.right){
        this.vel.x += this.speed;
        this.dir = 1;
    }
    if(game.controls.keys.shoot && this.timeSinceLastShoot > 10) this.shoot();
    
    ++this.timeSinceLastShoot;
    this.updatePos();
}
Player.prototype.shoot = function(){
    game.bullets.push(new Bullet(this.pos.x + this.size.w/2, this.pos.y+this.size.h/2, this.dir * 2, (Math.random()-0.5)/4));
    
    this.timeSinceLastShoot = 0;
    
    this.vel.x -= this.dir*this.speed*8;
}

function Npc(x, y, pow){
    Body.call(this, x, y, 15, 15, .2, pow);
    
    this.wantsToJump=true;
    this.dir=((Math.random()<0.5)-0.5)*2;
    
    this.type = (Math.random()*3)|0;
}
Npc.prototype = Object.create(Body.prototype);

Npc.prototype.update = function(){
    this.vel.x = this.dir;
    
    this.updatePos();
}
Npc.prototype.allignX = function(){
    this.dir*=-1;
}

function Turret(x, y, dir){
    ProjectileBody.call(this, x, y, 20, 20, Math.random()-0.5, 0);
    
    this.lastShot = Math.random()*100;
    this.dir = dir;
    this.shootSpeed = 3;
    this.accuracy = 10;
    
    this.frame = Math.random() < 0.5 ? 0 : .2;
}
Turret.prototype = Object.create(ProjectileBody.prototype);

Turret.prototype.update=function(){
    ++this.lastShot;
    if(this.lastShot>=100) this.shoot();
    
    this.updatePos();
}
Turret.prototype.shoot = function(){
    this.lastShot = 0;
    
    var err=(Math.random()-0.5)/this.accuracy;
    
    game.bullets.push(new Bullet(this.pos.x + this.size.w/2, this.pos.y + this.size.h/2, Math.cos(this.dir+err)*this.shootSpeed, Math.sin(this.dir+err)*this.shootSpeed, true))
}
Turret.prototype.stop = function(){
    this.vel.x *= -1;
}

function Bullet(x, y, vX, vY, isEnemy){
    var sizeW = sizeH = 9;
    ProjectileBody.call(this, x - sizeW/2, y - sizeH/2, sizeW, sizeH, vX, vY);
    
    this.isEnemy = isEnemy;
}
Bullet.prototype = Object.create(ProjectileBody.prototype);

Bullet.prototype.update = function(){
    this.updatePos();
}

Bullet.prototype.stop = function(){
    game.stopBullet(this);
}