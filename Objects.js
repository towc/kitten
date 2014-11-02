function Player(x, y){
    Body.call(this, x, y, 20, 28, .1, game.gravity*1.6);
    
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
    
    this.vel.x -= this.dir/2;
}

function Npc(x, y, pow){
    Body.call(this, x, y, 5, 5, .2, pow);
    
    this.wantsToJump=true;
    this.dir=((Math.random()<0.5)-0.5)*2;
}
Npc.prototype = Object.create(Body.prototype);

Npc.prototype.update = function(){
    this.vel.x = this.dir;
    
    this.updatePos();
}
Npc.prototype.allignX = function(){
    this.dir*=-1;
}

function Bullet(x, y, vX, vY){
    var sizeW = sizeH = 7;
    ProjectileBody.call(this, x - sizeW/2, y - sizeH/2, sizeW, sizeH, vX, vY);
}
Bullet.prototype = Object.create(ProjectileBody.prototype);

Bullet.prototype.update = function(){
    this.updatePos();
}

Bullet.prototype.stop = function(){
    game.stopBullet(this);
}