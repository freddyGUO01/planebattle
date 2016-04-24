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
        btn:{
            default:null,
            type:cc.Button
        } ,
        loading:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        
        this.loading.getComponent(cc.Label).enabled = false ;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    onStartClick:function () {
        this.btn.interactable = false;
        this.loading.getComponent(cc.Label).enabled = true ;
        cc.log('load battle scene') ;
        
        var self = this;
        
        this.schedule(function(){
            var str = self.loading.getComponent(cc.Label).string;
            if(str == 'loading.') str = 'loading..' ;
            else if(str == 'loading..') str = 'loading...';
            else str = 'loading.';
            
            
            self.loading.getComponent(cc.Label).string = str;
        }, 1);
        
        cc.director.loadScene('battle');
    }
});
