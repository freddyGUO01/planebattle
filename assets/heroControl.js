cc.Class({
    extends: cc.Component,

    properties: {
        act: cc.Animation
    },

    // use this for initialization
    onLoad: function () {
        this.act.play('hero-fly')
    },

    update: function (dt) {
        
    }
});
