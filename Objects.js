function Player(x, y){
    Body.call(this, x, y, 20, 28, .15, game.gravity*1.6);
    
    this.jumpt = false;
    this.timeSinceLastShoot = 0;
    this.dir = 1;
    
    this.shootDir = 0;
    this.shootX = 0;
    this.shootY = 0;
    this.shootRange = 100;
    this.shootAccuracy = 0.1;
    this.bulletSpeed = 5;
    
    this.isPlayer = true;
    
    this.portal1; 
    this.portal2;
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
Player.prototype.checkShootDir = function(){
    
    var eX = game.eX - this.pos.x,
        eY = game.eY - this.pos.y;
                
    this.shootDir = Math.atan(eY/eX);
                
    if(eX < 0) this.shootDir += Math.PI;
                
    this.shootX = this.pos.x + this.shootRange * Math.cos(this.shootDir);
    this.shootY = this.pos.y + this.shootRange * Math.sin(this.shootDir);
}

Player.prototype.shoot = function(){
    var rad = this.shootDir + (Math.random()-0.5)*this.shootAccuracy;
    game.bullets.push(new Bullet(this.pos.x + this.size.w/2, this.pos.y+this.size.h/2, Math.cos(rad)*this.bulletSpeed, Math.sin(rad)*this.bulletSpeed));
    
    this.timeSinceLastShoot = 0;
    
    this.vel.x -= Math.cos(rad)*this.bulletSpeed/10;
}

Player.prototype.createPortal1 = function(){
    this.portal1 = new Portal(this.shootX, this.shootY);
    
    if(this.portal2){
        this.portal2.connect(this.portal1);
        this.portal1.connect(this.portal2);
    }
}
Player.prototype.createPortal2 = function(){
    this.portal2 = new Portal(this.shootX, this.shootY);
    
    if(this.portal1){
        this.portal1.connect(this.portal2);
        this.portal2.connect(this.portal1);
    }
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

function Portal(x, y){
    StillBody.call(this, x, y, 30, 60);
    
    this.destination = this;
    
    this.center = {x:this.pos.x + this.size.w/2, y:this.pos.y + this.size.h/2}
    
    this.type = 1 //(Math.random()*7)|0;
    
    /*while(game.portalTypes.indexOf(this.type) >= 0 && game.portalTypes.length <= 9){
        this.type = (Math.random()*7)|0;
    }*/
    
    //game.portalTypes.push(this.type);
}
Portal.prototype = Object.create(StillBody.prototype);

Portal.prototype.update = function(){
    if(!this.destination) return;
    var ent = [game.player].concat(game.npcs, game.bullets, game.enemies);
    
    for(var i = 0; i < ent.length; ++i){
        
        if(checkCollision(this, ent[i]) && ent[i].inPortal !== this){
            game.transitions.push([ent[i].pos.x, ent[i].pos.y, this.destination.center.x, this.destination.center.y, this.type, ent[i].isPlayer ? 40 : 10]);
            
            ent[i].pos.set(this.destination.center.x - ent[i].size.w/2, this.destination.center.y - ent[i].size.h/2);
            ent[i].inPortal = this.destination;
        } else if(!checkCollision(this, ent[i]) && ent[i].inPortal === this) {
            ent[i].inPortal = false;
        }
    }
}
Portal.prototype.connect = function(p2){
    this.destination = p2;
}