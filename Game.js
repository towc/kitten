function Game(){
    this.ww = window.innerWidth;
    this.hh = window.innerHeight;
    
    this.controls = new Controls();
    
    this.drawer = new Drawer(this);
    
    this.blockSize = 40;
    this.maps = [  
       
[[4,1,4,4,3,1,4,1,3,3,1,1,2,1,3,3,2,1,1,4,1,4,2,1,2,2,1,1,4,2],[2,4,2,0,3,0,1,0,0,0,0,1,0,0,0,0,0,4,0,4,0,1,0,4,3,0,1,0,0,4],[1,0,0,0,0,0,0,3,4,0,0,0,0,0,0,0,0,0,0,0,4,0,3,0,0,0,0,0,0,2],[2,4,1,0,0,0,0,4,0,2,0,1,0,0,0,0,1,0,0,0,0,0,0,0,3,0,0,2,0,1],[4,0,0,0,0,0,0,3,0,0,0,0,2,1,0,0,0,0,0,0,0,4,0,0,0,0,3,0,0,2],[2,4,2,0,0,0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,2,0,0,0,0,0,0,0,4],[3,4,0,0,0,3,0,0,0,0,0,0,0,3,2,0,2,0,0,2,1,0,0,0,2,3,4,0,0,1],[2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,4],[3,0,3,3,4,3,0,1,0,0,1,0,0,2,0,0,2,0,0,0,0,0,0,1,0,4,0,4,0,3],[2,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,2,0,0,0,2,0,0,1,0,3],[4,0,0,0,0,0,3,0,3,0,0,4,1,0,0,0,0,0,0,0,2,0,1,0,4,0,0,0,0,4],[4,0,1,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,2,2],[2,2,0,4,1,4,0,4,3,0,1,2,0,0,0,0,0,0,0,0,0,0,0,3,4,0,0,1,0,4],[3,0,0,0,0,0,0,0,0,0,0,0,0,2,4,0,4,4,0,0,0,0,0,0,0,0,0,0,0,4],[1,0,0,0,0,0,0,0,0,0,2,0,0,2,4,0,0,0,0,0,0,2,0,0,0,0,0,0,3,1],[1,0,2,0,4,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,0,4],[2,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,2],[3,0,0,2,0,3,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,3,0,2,0,0,0,0,3],[1,0,0,0,0,0,0,0,0,0,0,0,0,4,0,3,0,1,3,0,0,0,0,3,0,2,0,0,0,2],[3,1,2,3,4,1,2,3,2,2,3,1,2,2,2,2,2,2,4,4,1,3,3,4,2,3,4,3,2,4]]
    ]
        
    this.updateMs = 8;
        
    this.gravity = 0.2;
}
Game.prototype = {
    //this is first fired from the drawer on Drawer.js, when all of the images have been loaded
    start: function(loop){
        this.running = loop;
        
        this.score = 0;
        
        this.currMap = 0;
        this.map = this.maps[this.currMap];
        
        this.drawer.setLevel();
        
        this.player = new Player(this.map[0].length * this.blockSize / 2 - 0.5, this.map.length * this.blockSize / 2);
        
        this.lastTick = Date.now();
        this.elapsedTime = 0;
            
        this.npcs=[];
        this.bullets = [];
        this.enemies = [];
        
        for(var i=0; i<50; ++i){
            this.npcs.push(new Npc(
                Math.random()*(this.map[0].length-2)*this.blockSize + this.blockSize,
                Math.random()*(this.map.length-2)   *this.blockSize + this.blockSize,
                this.gravity*Math.random()+game.gravity
            ));
        }
        for(var i=0; i<10; ++i){
            this.enemies.push(new Turret(
                Math.random()*(this.map[0].length-2)*this.blockSize + this.blockSize,
                Math.random()*(this.map.length-2)   *this.blockSize + this.blockSize,
                Math.random()*Math.PI*2
            ));
        }
            
        this.loop();
    },
    loop: function(){
        //keeps on looping if the game is paused
        if(this.running) window.requestAnimationFrame(this.loop.bind(this));
        else return false;
        
        var now = Date.now();
        this.elapsedTime += now - this.lastTick;
    
        
        //check if player is afk or changed tab
        if(this.elapsedTime > 100 * this.updateMs) return this.running = false;
        
        while(this.elapsedTime - this.updateMs >= 0){
            
            this.update();
            this.elapsedTime -= this.updateMs;
        }
        
        this.draw();
        
        this.lastTick = Date.now();
    },
    update: function(){
        this.player.update();
        for(var i=0; i<this.npcs.length; ++i){
            this.npcs[i].update();
        }
        for(var i=0; i< this.enemies.length; ++i){
            this.enemies[i].update();
        }
        for(var i=0; i<this.bullets.length; ++i){
            var bull = this.bullets[i];
            bull.update();
            
            for(var j = 0; j < this.npcs.length; ++j){
                var npc = this.npcs[j];
                
                if(checkCollision(bull, npc)){
                    this.npcs.splice(this.npcs.indexOf(npc), 1);
                    
                    this.score += 1;
                    
                    //bull.pierce -= 1;
                }
            }
            
            if(checkCollision(bull, this.player) && bull.isEnemy) this.gameOver();
            
            if(!bull.isEnemy) 
                for(var j = 0; j < this.enemies.length; ++j){
                var en = this.enemies[j];
                    
                if(checkCollision(bull, en)){
                    
                    this.enemies.splice(this.enemies.indexOf(en), 1);
                    this.score += 2;
                }
            }
        }
    },
    draw: function(){
        this.drawer.draw();
    },
    stopBullet: function(bull){
        this.bullets.splice(this.bullets.indexOf(bull), 1);
    },
    gameOver: function(){
        this.running = false;
        
        this.drawer.gameOver();
    }
};