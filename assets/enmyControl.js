cc.Class({
    extends: cc.Component,

    properties: {
        speed: 5 ,
        size : null
    },

    // use this for initialization
    onLoad: function () {
        var scene = cc.director.getScene();
        this.size = cc.director.getVisibleSize();
        
        var pos = this.node.getPosition();
        var go = cc.moveTo(this.speed, cc.p(pos.x, 200)) ;
        
        this.node.runAction(go);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //var pos = this.node.getPosition();
        //this.node.setPosition(pos.x, pos.y-5)
    },
});
