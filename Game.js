function Game(){
    this.controls = new Controls();
    
    this.drawer = new Drawer(this);
    
    this.blockSize = 40;
    this.maps = [  
        genLevel()
    ]
        
    this.updateMs = 10;
        
    this.gravity = 0.2;
}
Game.prototype = {
    //this is first fired from the drawer on Drawer.js, when all of the images have been loaded
    start: function(loop){
        this.controls.keys.reset = false;
        
        this.score = 0;
        
        this.currMap = 0;
        this.map = this.maps[this.currMap];
        
        this.ww = this.map[0].length*this.blockSize;
        this.hh = this.map.length   *this.blockSize;
        
        this.drawer.setLevel();
        this.drawer.el.gameOver.classList.remove('visible');
        
        this.player = new Player(this.map[0].length * this.blockSize / 2 - 0.5, this.map.length * this.blockSize / 2);
            
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
            
        
        if(loop) this.unPause();
    },
    loop: function(){
        if(this.controls.keys.reset) return this.start(true);
        
        //keeps on looping if the game is paused
        if(this.running) window.requestAnimationFrame(this.loop.bind(this));
        else return false;
        
        var now = Date.now();
        this.elapsedTime += now - this.lastTick;
    
        
        //check if player is afk or changed tab
        if(this.elapsedTime > 100 * this.updateMs) return this.pause();
        
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
    },
    pause: function(){
        this.running = false;
        
        this.drawer.pause();
    },
    unPause: function(){
        this.running = true;
        this.lastTick = Date.now();
        this.elapsedTime = 0;
        
        this.loop();
        
        this.drawer.unPause();
    }
};

function genLevel(){
    var ar = [];
    
    for(var i = 0; i < 20; ++i){
        ar.push([]);
        
        for(var j = 0; j < 30; ++j){
            
            var n = (Math.random() < 0.3 || i === 0 || i === 19 || j === 0 || j === 29) ? ((Math.random()*4)|0)+1 : 0;
            
            ar[i].push(n);
        }
    }
    
    return ar;
}