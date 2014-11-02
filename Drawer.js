function Drawer(game){
    this.canvas = document.getElementById('c');
    this.canvas.width = game.ww;
    this.canvas.height = game.hh;
    
    this.ctx = this.canvas.getContext('2d');
    
    this.images = {};
    this.imgSrcs = ['player'];
    
    for(var i = 0; i < this.imgSrcs.length; ++i){
        var img = new Image();
        img.src = 'img/'+this.imgSrcs[i]+'.png';
        
        img.addEventListener('load', function(){game.drawer.upLoad();});
        
        this.images[this.imgSrcs[i]] = img;
    }
    
    this.loadedImgs = 0;
}
Drawer.prototype = {
    upLoad: function(){
        ++this.loadedImgs;
        
        if(this.loadedImgs === this.imgSrcs.length) game.start(true);
    },
    setLevel: function(){
        
        var mapW = game.map[0].length,
            mapH = game.map.length;
        this.blockProportion = Math.min(
            game.ww / mapW / game.blockSize,
            game.hh / mapH / game.blockSize);
        
        this.ctx.scale(this.blockProportion, this.blockProportion);
    },
    draw: function(){
        var ctx = this.ctx;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, game.ww / this.blockProportion, game.hh / this.blockProportion);
        
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
        
        ctx.drawImage(this.images.player, x, y, game.player.size.w, game.player.size.h, game.player.pos.x, game.player.pos.y, game.player.size.w, game.player.size.h);
        game.player.frame += 0.2;
        
        ctx.fillStyle = 'green';
        for(var i=0; i<game.npcs.length; ++i){
            var npc = game.npcs[i];
            ctx.fillRect(npc.pos.x, npc.pos.y, npc.size.w, npc.size.h);
            npc.frame += 0.1;
        }
        ctx.fillStyle = 'gray';
        for(var i=0; i < game.bullets.length; ++i){
            var bull = game.bullets[i];
            ctx.fillRect(bull.pos.x, bull.pos.y, bull.size.w, bull.size.h);
            
            bull.frame += 0.1;
        }
        
        ctx.fillStyle = 'red';
        for(var i = 0; i < game.map[0].length; ++i){
            for(var j = 0; j < game.map.length; ++j){
                if(game.map[j][i]) ctx.fillRect(i * game.blockSize, j * game.blockSize, game.blockSize, game.blockSize);
            }
        }
    }
};