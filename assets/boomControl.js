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
        act: cc.Animation
    },
    
    boom: function() {
        //this.act.play('boom') ;
    },

    // use this for initialization
    onLoad: function () {
        this.act.play('boom') ;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
