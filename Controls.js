function Controls(){
    
    //just so that I don't have to manually create 2 objects, I can just create them procedurally
    var names = ['left', 'up', 'right', 'down', 'shoot', 'pause', 'reset'];
    var keyCodes = [37, 38, 39, 40, 32, 80, 82];
    
    this.keys = {};
    this.codes = {};
    
    this.specials = ['pause', 'reset'];
    
    for(var name = 0; name < names.length; ++name){
        this.keys[names[name]] = false;
        this.codes[keyCodes[name]] = names[name];
    }
}
Controls.prototype = {
    press: function(key){
        game.controls.keys[ game.controls.codes[key.keyCode] ] = true;
        
        switch(game.controls.codes[key.keyCode]){
            case 'pause': game.running ? game.pause() : game.unPause(); break;
            case 'reset': if(!game.running) game.start(true);
        }
    },
    unPress: function(key){
        game.controls.keys[ game.controls.codes[key.keyCode] ] = false;
    }
};