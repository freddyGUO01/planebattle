cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        var size = cc.director.getVisibleSize();
        cc.log(size)
        
        
        
        var n = this.node.getChildByName("enmyp1");
        cc.log(n);
        
        var mat = n.getNodeToWorldTransformAR();
        cc.log(mat.tx+'  '+mat.ty);
        
        this.schedule(function(){
            var hpos = n.getPosition();
            
            var num = Math.random() * 1000 ;
            num = Math.ceil(num);
            
            var bnode = cc.instantiate(n) ;
            this.node.addChild(bnode)

            var newVec2 = this.node.convertToNodeSpace(cc.v2(num, hpos.y));
            
            cc.log(newVec2)
            //bnode.setPosition(num, hpos.y);
            bnode.setPosition(newVec2);
            
        }, 1);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
