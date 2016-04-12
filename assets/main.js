cc.Class({
    extends: cc.Component,
    

    properties: {
        hero:{
            default: null,
            type: cc.Node
        },
        enemy:{
            default: null,
            type: cc.Node
        }, 
        bullet:{
            default: null,
            type: cc.Node
        },
        boom:{
            default: null,
            type: cc.Node
        },
        score_label:{
            default: null,
            type: cc.Node
        },
        size : null ,
        speed: 3 ,
        spCreateEnemy: 2 ,
        spCreateBullet: 0.5 ,
        bulletArr: [] ,
        enemyArr: [] ,
        heroIsLife: true ,
        enemy_score: 10 ,
        score: 0
    },
    
    onPlayerClick: function(event) {
        
        if(!this.heroIsLife)    return ;
        
        var loc = event.getLocation();
        //cc.log('Hello! x '+ loc.x +' y '+ loc.y);
        
        var hero_loc = this.hero.getPosition();
        
        var _conv0 = this.node.convertToWorldSpaceAR(hero_loc);   //  与鼠标点击位置做计算需要转换到世界坐标系（鼠标位置基于世界坐标系）
        
        var _speed = loc.x - _conv0.x ;
        _speed = Math.abs(_speed) / 300;
        
        var _conv1 = this.node.convertToNodeSpaceAR(cc.v2(loc.x, loc.y));       //  设置几点位置需要转换到本地坐标系
        //cc.log('convert! x '+ _conv1.x +' y '+ _conv1.y);
        
        var hero_go = cc.moveTo(_speed, cc.p(_conv1.x, hero_loc.y))
        this.hero.stopAllActions();
        this.hero.runAction(hero_go);
    } ,
    
    onCreateEnemy: function() {
        if(!this.heroIsLife)    return ;
        
        var num = Math.random() * this.size.width ;
        num = Math.ceil(num);
        
        var _enemy = cc.instantiate(this.enemy) ;
        this.enemyArr.push(_enemy)
        
        this.node.addChild(_enemy);
        var _conv = this.node.convertToNodeSpaceAR(cc.v2(num, 0));
        
        _enemy.setPosition(_conv.x, this.size.height/2);
        
        var _go = cc.moveTo(this.speed, cc.p(_conv.x, -(this.size.height/2+(this.enemy.height*this.enemy.scaleY/2)))) ;
        
        _enemy.runAction(cc.sequence(_go, cc.removeSelf()));
        
        //cc.log('canvas child count : ' +this.node.childrenCount);
    } ,
    
    onCreateBullet: function() {
        if(!this.heroIsLife)    return ;
        
        var cpos = this.hero.getPosition();
        
        var _bullet = cc.instantiate(this.bullet);
        this.bulletArr.push(_bullet);
        
        this.node.addChild(_bullet);
        
        _bullet.setPosition(cpos.x, cpos.y);
        _bullet.setLocalZOrder (1);
        
        var _go = cc.moveTo(this.speed, cc.p(cpos.x, (this.size.height/2+(this.bullet.height*this.bullet.scaleY/2)))) ;
        _bullet.runAction(cc.sequence(_go, cc.removeSelf()));        
    } ,

    // use this for initialization
    onLoad: function () {
        var scene = cc.director.getScene();
        this.size = cc.director.getVisibleSize();
        
        cc.log(this.size)
        
        //cc.log(this.node.width+' '+this.node.height);
        //cc.log(this.enemy.width+' '+this.enemy.height);
        
        var self = this;
        
        this.hero.setLocalZOrder(2);
        /*
        this.node.on('mousedown', function ( event ) {
            self.onPlayerClick(event) ;
        });
        */
        //console.log(this.score_label)
        var score_position  = this.score_label.getPosition();
        this.score_label.setPosition(this.size.width/2*-1+50,score_position.y);
        cc.log(this.score_label.getPosition())
        this.score_label.setLocalZOrder(4)
        
        this.node.on(cc.Node.EventType.TOUCH_START, function ( event ) {
            self.onPlayerClick(event) ;
        });
        
        this.schedule(function(){
            self.onCreateEnemy();
        }, this.spCreateEnemy);
        
        
        this.schedule(function(){
            self.onCreateBullet();
        }, this.spCreateBullet);
    },
    

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.score_label.getComponent(cc.Label).string = this.score ;
        
        for(var _j in this.enemyArr)
        {
            var flag = true;
            if(!this.enemyArr[_j].isChildOf(this.node)){
                //如果已经被移除当前画布，则从数组移除成员
                cc.js.array.remove(this.enemyArr, this.enemyArr[_j]);
            }
            if(this.heroIsLife){
                var rect_hero = this.hero.getBoundingBoxToWorld() ;     
                try{
                    // 检测英雄死亡
                    if(  rect_hero.intersects ( this.enemyArr[_j].getBoundingBoxToWorld() ) ){
                        
                        this.heroIsLife = false ;
                        this.hero.stopAllActions();   //  防止爆炸效果出现位移
                        
                        var bb = this.enemyArr[_j] ;
                        bb.stopAllActions();
                        
                        var _boom = cc.instantiate(this.boom) ;
                        this.node.addChild(_boom);
                        _boom.setPosition( this.hero.getPosition() );
                        _boom.setLocalZOrder(3);
                        
                        var _boom2 = cc.instantiate(this.boom) ;
                        this.node.addChild(_boom2);
                        _boom2.setPosition( bb.getPosition() );
                        _boom2.setLocalZOrder(3);
                        
                        bb.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf())) ;
                        this.hero.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf())) ;
                        _boom.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf()));
                        _boom2.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf()));
                    }
                }catch(e){
                    cc.log(e.message);
                }
            }
            
            for(var _i in this.bulletArr){
                if(!this.bulletArr[_i].isChildOf(this.node)){
                    //如果已经被移除当前画布，则从数组移除成员
                    cc.js.array.remove(this.bulletArr, this.bulletArr[_i]);
                }
                
                try{
                
                    var rect = this.bulletArr[_i].getBoundingBoxToWorld() ;
                    if( rect.intersects ( this.enemyArr[_j].getBoundingBoxToWorld() ) ){
                        cc.log('is intersects');
                        var aa = this.bulletArr[_i] ;
                        var bb = this.enemyArr[_j] ;
                        
                        bb.stopAllActions();
                        
                        //var _localpos = this.node.convertToNodeSpaceAR(cc.Vec2(rect.x, rect.y)) ;
                        //var _localpos = aa.getPosition();
                        var _boom = cc.instantiate(this.boom) ;
                        this.node.addChild(_boom);
                        _boom.setLocalZOrder(3);
                        _boom.setPosition(bb.getPosition());
                        //_boom.boom();
                        
                        
                        //播放爆炸动画后销毁
                        aa.removeFromParent();
                        bb.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf())) ;
                        _boom.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf()));
                        
                        
                        //先把他们移除，防止二次检测
                        cc.js.array.remove(this.enemyArr, bb);
                        cc.js.array.remove(this.bulletArr, aa);
                        flag = false;
                        
                        this.score += this.enemy_score;
                        
                        break;
                    }else{
                        //cc.log('no intersects');
                    }
                
                }catch(e){
                    cc.log(e.message);
                }
            }
            
            if(!flag){
                
                break;
            }
            
        }
    },
});