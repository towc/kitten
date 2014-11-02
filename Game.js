function Game(){
    this.ww = window.innerWidth;
    this.hh = window.innerHeight;
    
    this.controls = new Controls();
    
    this.drawer = new Drawer(this);
    
    this.blockSize = 40;
    this.maps = [
            

[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,0,1],[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1],[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1],[1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1],[1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],[
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]
        ];
        
    this.updateMs = 8;
        
    this.gravity = 0.2;
}
Game.prototype = {
    //this is first fired from the drawer on Drawer.js, when all of the images have been loaded
    start: function(loop){
        this.running = loop;
        
        this.currMap = 0;
        this.map = this.maps[this.currMap];
        
        this.drawer.setLevel();
        
        this.player = new Player(this.map[0].length * this.blockSize / 2 - 0.5, this.map.length * this.blockSize / 2);
        
        this.lastTick = Date.now();
        this.elapsedTime = 0;
            
        this.npcs=[];
        this.bullets = [];
        for(var i=0; i<10; ++i){
            this.npcs.push(new Npc(
                Math.random()*(this.map[0].length-2)*this.blockSize + this.blockSize,
                Math.random()*(this.map.length-2)   *this.blockSize + this.blockSize,
                this.gravity*Math.random()+game.gravity
            ))
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
        for(var i=0; i<this.bullets.length; ++i){
            var bull = this.bullets[i];
            bull.update();
            
            for(var j = 0; j < this.npcs.length; ++j){
                var npc = this.npcs[j];
                
                if(checkCollision(bull, npc)){
                    this.npcs.splice(this.npcs.indexOf(npc), 1);
                    this.npcs.push(new Npc(
                        Math.random()*(this.map[0].length-2)*this.blockSize + this.blockSize,
                        Math.random()*(this.map.length-2)   *this.blockSize + this.blockSize,
                        this.gravity*Math.random()+game.gravity
                    ))
                }
            }
        }
    },
    draw: function(){
        this.drawer.draw();
    },
    stopBullet: function(bull){
        this.bullets.splice(this.bullets.indexOf(bull), 1);
    }
};