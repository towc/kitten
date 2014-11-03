function Drawer(game){
    this.images = {};
    this.imgSrcs = ['player', 'blocks', 'turret', 'bullet', 'npc', 'portal'];
    
    for(var i = 0; i < this.imgSrcs.length; ++i){
        var img = new Image();
        img.src = 'img/'+this.imgSrcs[i]+'.png';
        
        img.addEventListener('load', function(){game.drawer.upLoad();});
        
        this.images[this.imgSrcs[i]] = img;
    }
    
    this.loadedImgs = 0;
    
    //elements
    this.el={};
    this.elIds = ['score', 'gameOver','pause'];
    
    for(var i = 0; i < this.elIds.length; ++i){
        this.el[this.elIds[i]] = document.getElementById(this.elIds[i]);
    }
    
    this.portalColors = ['red', 'green', 'blue', 'purple', 'brown', 'yellow', 'azure'];
}
Drawer.prototype = {
    upLoad: function(){
        ++this.loadedImgs;
        
        if(this.loadedImgs === this.imgSrcs.length){
            game.start(true);
            game.pause();
        }
    },
    setLevel: function(){
        
        this.canvas = document.getElementById('c');
        this.canvas.width = game.ww|0;
        this.canvas.height = game.hh|0;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
    },
    draw: function(){
        var ctx = this.ctx;
        
        ctx.fillStyle = 'white';
        ctx.clearRect(0, 0, game.ww, game.hh);
        
        
        //portals
        for(var i=0; i < game.portals.length; ++i){
            var pt = game.portals[i];
            
            ctx.drawImage(this.images.portal, pt.type * pt.size.w, ((pt.frame%2)|0)*pt.size.h, pt.size.w, pt.size.h, pt.pos.x, pt.pos.y, pt.size.w, pt.size.h);
            
            ctx.drawImage(this.images.portal, pt.type * pt.size.w, (((pt.frame%2) +2)|0)*pt.size.h , pt.size.w, pt.size.h, pt.destination.x, pt.destination.y, pt.size.w, pt.size.h);
            
            pt.frame += 0.1;
        }
        
        //portal transitions
        
        for(var i=0; i < game.transitions.length; ++i){
            var tr = game.transitions[i];
            
            ctx.lineWidth = tr[5];
            ctx.strokeStyle = this.portalColors[tr[4]];
            
            ctx.beginPath();
            ctx.moveTo(tr[0], tr[1]);
            ctx.lineTo(tr[2], tr[3]);
            ctx.stroke();
            ctx.closePath();
            
            --tr[5];
            if(tr[5] <= 0) game.transitions.splice(i, 1); 
        }
        
        //player
        //getting the positions in the source spritesheet at img/player.png
        
        //loking left or right
        var y = game.player.dir < 0 ? 0 : game.player.size.h,
            x = 0;
        //if touching ground or just hovering
        if(game.player.vel.y === 0){
            //if running
            if(Math.abs(game.player.vel.x) > 0.1) x = game.player.size.w * ((game.player.frame % 3)|0) //3 running frames
            //if standing still
            else x = game.player.size.w * 3; //3 frames for the running, there is only 1 for standing still
            
        //if jumping or falling
        } else {
            //if jumping
            if(game.player.vel.y < 0) x = game.player.size.w * 4 + ((game.player.frame % 3)|0) //4 previous frames, 3 frames for jumping
            //if falling
            else x = game.player.size.w * 7 + ((game.player.frame % 3)|0) //7 previous frames, 3 for falling
        }
        
        ctx.drawImage(this.images.player, x, y, game.player.size.w, game.player.size.h, game.player.pos.x|0, game.player.pos.y|0, game.player.size.w|0, game.player.size.h|0);
        game.player.frame += 0.2;
        
        //npcs
        for(var i=0; i<game.npcs.length; ++i){
            var npc = game.npcs[i];
            
            var y = npc.type * npc.size.h,
                x = 0;
            
            //direction
            if(npc.vel.x > 0){
                x += npc.size.w * 4;
            }
            //up or down
            if(npc.vel.y < 0){
                x += npc.size.w * 2;
            }
            
            //frame
            x += ((npc.frame%2)|0)*npc.size.w;
            
            ctx.drawImage(this.images.npc, x, y, npc.size.w, npc.size.h, npc.pos.x, npc.pos.y, npc.size.w, npc.size.h);
            npc.frame += 0.1;
        }
        
        for(var i=0; i < game.enemies.length; ++i){
            var en = game.enemies[i];
            ctx.drawImage(this.images.turret, ((en.frame%2)|0)*en.size.w, 0, en.size.w, en.size.h, en.pos.x|0, en.pos.y|0, en.size.w, en.size.h);
            
            en.frame += 0.5;
        }
        
        for(var i=0; i < game.bullets.length; ++i){
            var bull = game.bullets[i];
            ctx.drawImage(this.images.bullet, bull.isEnemy ? bull.size.w : 0, 0, bull.size.w, bull.size.h, bull.pos.x, bull.pos.y, bull.size.w, bull.size.h);
            
            bull.frame += 0.1;
        }
        
        //blocks
        for(var i = 0; i < game.map[0].length; ++i){
            for(var j = 0; j < game.map.length; ++j){
                if(game.map[j][i] > 0) ctx.drawImage(this.images.blocks, (game.map[j][i]-1)*game.blockSize, 0, game.blockSize, game.blockSize, i * game.blockSize, j * game.blockSize, game.blockSize, game.blockSize);
            }
        }
        
        this.el.score.textContent = game.score;
    },
    pause: function(){
        this.el.pause.classList.add('visible');
    },
    unPause: function(){
        this.el.pause.classList.remove('visible');
    },
    gameOver: function(){
        this.el.gameOver.classList.add('visible');
    }
};