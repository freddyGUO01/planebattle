cc.Class({
    extends: cc.Component,
    

    properties: {
        hero:{
            default: null,
            type:cc.Node
        },
        enmy:{
            default: null,
            type: cc.Node
        }, 
        size : null
    },

    // use this for initialization
    onLoad: function () {
        var scene = cc.director.getScene();
        this.size = cc.director.getVisibleSize();
        
        //cc.log(this.size)
        this.schedule(function(){
            var hpos = this.enmy.getPosition();
            
            var num = Math.random() * 1000 ;
            num = Math.ceil(num);
            
            var node = cc.instantiate(this.enmy) ;
            
            node.parent = cc.director.getScene();
            node.setPosition(num, this.size.height);
        }, 5);
    },
    
    createEnmy: function(){
        var hpos = this.enmy.getPosition();
        
        var num = Math.random() * 1000 ;
        num = Math.ceil(num);
        
        var node = cc.instantiate(this.enmy) ;
        
        node.parent = cc.director.getScene();
        node.setPosition(num, this.size.height);
    } ,

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //cc.log('a')
        

    },
});