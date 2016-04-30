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
        boss:{
            default: null,
            type: cc.Node
        },
        bullet:{
            default: null,
            type: cc.Node
        },
        bossBullet:{
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
        scoreOverLabel:{
            default: null,
            type: cc.Node
        },
        gameReloadBtn:{
            default: null,
            type: cc.Node
        },
        gameReloadLabel:{
            default: null,
            type: cc.Node
        },
        size : null ,
        speed: 3 ,
        planeSpeed: 100,  //飞机行驶速度
        bulletSpeed: 500, //子弹行驶速度
        spCreateEnemy: 2 ,
        spCreateBullet: 0.5 ,
        spCreateBossBullet: 1 ,
        bulletArr: [] ,
        enemyArr: [] ,
        bossArr: [] ,
        bossBulletArr: [],
        heroIsLife: true ,
        enemy_score: 10 ,
        boss_score: 100 ,
        score: 0 , 
        e_count: 0,   // 打败的敌机数
        heroBulletPower: 10 ,  // 英雄子弹对于boss的威力
        heroBoundLeft: 0,   //  英雄对于屏幕左右边界(canvas本地坐标系)(boss和enemy的宽度和hero相同，所以也是它们的边界)
        heroBoundRight: 0,
    },
    
    onPlayerClick: function(event) {
        
        if(!this.heroIsLife)    return ;
        
        var loc = event.getLocation();
        
        /*
        if(loc.x < this.hero.width * this.hero.scaleX / 2){
            loc.x = this.hero.width * this.hero.scaleX / 2 ;  // 防止超出边界
        }
        
        if(loc.x > this.size.width - this.hero.width * this.hero.scaleX / 2 ){
            loc.x = this.size.width - this.hero.width * this.hero.scaleX / 2;
        }
        */
        
        var hero_loc = this.hero.getPosition();
        
        var _conv0 = this.node.convertToWorldSpaceAR(hero_loc);   //  与鼠标点击位置做计算需要转换到世界坐标系（鼠标位置基于世界坐标系）
        
        var _speed = loc.x - _conv0.x ;
        _speed = Math.abs(_speed) / 300;
        
        var _conv1 = this.node.convertToNodeSpaceAR(cc.v2(loc.x, loc.y));       //  设置几点位置需要转换到本地坐标系
        
        
        
        if(_conv1.x < this.heroBoundLeft){
            _conv1.x = this.heroBoundLeft ;
        }
        if(_conv1.x > this.heroBoundRight){
            _conv1.x = this.heroBoundRight ;
        }
        
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
        
        if(_conv.x < this.heroBoundLeft){
            _conv.x = this.heroBoundLeft ;
        }
        if(_conv.x > this.heroBoundRight){
            _conv.x = this.heroBoundRight ;
        }
        
        var startPosY = this.size.height/2;
        _enemy.setPosition(_conv.x, startPosY);
        
        var disPosY = -(this.size.height/2+(this.enemy.height*this.enemy.scaleY/2)) ;
        
        var distance = Math.abs(disPosY - startPosY) ;  // 距离
        var duration = distance / this.planeSpeed ;
        
        
        var _go = cc.moveTo(duration, cc.p(_conv.x, disPosY)) ;
        
        var self = this ;
        _enemy.runAction(cc.sequence(_go, cc.callFunc(function(){ cc.js.array.remove(self.enemyArr, _enemy); }), cc.removeSelf()));
        
        
    } ,
    
    onCreateBullet: function() {
        
        if(!this.heroIsLife)    return ;
        
        var cpos = this.hero.getPosition();
        
        var _bullet = cc.instantiate(this.bullet);
        this.bulletArr.push(_bullet);
        
        this.node.addChild(_bullet);
        
        var startPosY = cpos.y;
        
        _bullet.setPosition(cpos.x, startPosY);
        _bullet.setLocalZOrder (1);
        
        var disPosY =  this.size.height/2+(this.bullet.height*this.bullet.scaleY/2) ;
        
        var distance = Math.abs(disPosY - startPosY) ;  // 距离
        var duration = distance / this.bulletSpeed ;     // 时间 T = 距离 / 速度
        
        cc.log(duration)
        
        // 当子弹超出屏幕，从数组移除，并且从当前场景清除
        var _go = cc.moveTo(duration, cc.p(cpos.x, disPosY)) ; 
        _bullet.runAction(cc.sequence(_go, cc.callFunc(this.removeBulletFromArr.bind(this), _bullet), cc.removeSelf()));   
        
        // 也可以这样使用
        //var self = this ;
        //_bullet.runAction(cc.sequence(_go, cc.callFunc(function(){ cc.js.array.remove(self.bulletArr, _bullet); }), cc.removeSelf()));      
    } ,
    
    removeBulletFromArr: function(obj) {
        
        cc.js.array.remove(this.bulletArr, obj);
    } ,
    
    onCreateBossBullet: function() {
        if(!this.heroIsLife ||　this.bossArr.length <= 0)    return ;
        
        
        for(var _i in this.bossArr){
            
            var cpos = this.bossArr[_i]._node.getPosition();
        
            var _bullet = cc.instantiate(this.bossBullet);
            this.bossBulletArr.push(_bullet);
            
            this.node.addChild(_bullet);
            
            var startPosY = cpos.y;
            
            _bullet.setPosition(cpos.x, startPosY);
            _bullet.setLocalZOrder (1);
            
            var disPosY = (this.size.height/2+(this.bullet.height*this.bullet.scaleY/2)) * -1 ;
            
            var distance = Math.abs(disPosY - startPosY) ;  // 距离
            var duration = distance / this.bulletSpeed ;     // 时间 T = 距离 / 速度 
            
            var _go = cc.moveTo(duration, cc.p(cpos.x, disPosY)) ;
            
            //var self = this ;
            _bullet.runAction(cc.sequence(_go, cc.callFunc(this.removeBossBulletFromArr.bind(this), _bullet), cc.removeSelf()));    
            
        }
        
        
    },
    
    
    removeBossBulletFromArr: function(obj) {
        
        cc.js.array.remove(this.bossBulletArr, obj);
        
    } ,
    
    createBoss: function(level){
        if(!this.heroIsLife)    return ;
        
        var _boss = cc.instantiate(this.boss) ;
        
        var boss_xf = this.size.width / 2 - ( this.boss.width * this.boss.scaleX / 2 );
        
        
        this.node.addChild(_boss);
        
        //var num = this.size.width /2 ;
        //var _conv = this.node.convertToNodeSpaceAR(cc.v2(num, 0));
        
        var margin_top = this.bossArr.length * ( this.boss.height*this.boss.scaleY+20 ) ;
        
        var _boss_y = this.size.height/2 - margin_top - this.boss.height*this.boss.scaleY ;
        
        //_boss.setPosition(_conv.x, _boss_y);
        _boss.setPosition(boss_xf*-1, _boss_y);
        _boss.setLocalZOrder(2);
        
        /*
        var bar = _boss.getComponent(cc.ProgressBar)
        bar.progress = 0.5;
        
        */
        
        this.bossArr.push({_node:_boss, _hp:100})   // 可以如此封装一个需要多个参数的npc
        //_boss.getComponent(cc.Animation).stop('enemy-fly');   //  停止一个动画, stop 不指定参数为停止所有动画
        
        //var _speed = loc.x - _conv0.x ;
        //_speed = Math.abs(_speed) / 300;
        var boss_go = cc.moveTo(6, cc.p(boss_xf, _boss_y)) ;
        var boss_back = cc.moveTo(6, cc.p(boss_xf*-1, _boss_y)) ;
        _boss.runAction(cc.repeatForever(cc.sequence(boss_go, boss_back)));
    },
    
    // open true/false
    adminReloadRes(open){
        if(!open){
            this.gameReloadBtn.width = 0;
            this.gameReloadLabel.getComponent(cc.Label).enabled = false;
            this.scoreOverLabel.getComponent(cc.Label).enabled = false;
        }else{
            this.gameReloadBtn.width = 100;
            this.gameReloadLabel.getComponent(cc.Label).enabled = true;
            this.scoreOverLabel.getComponent(cc.Label).enabled = true;
        }
    },
    
    onGameOver(){
        this.unscheduleAllCallbacks();  // 停止所有创建物体
        this.scoreOverLabel.getComponent(cc.Label).string = "score "+this.score ;
        this.adminReloadRes(true) ;
    },

    // use this for initialization
    onLoad: function () {
        var scene = cc.director.getScene();
        this.size = cc.director.getVisibleSize();
        
        this.adminReloadRes(false) ;
        
        this.heroBoundLeft  = (this.size.width / 2 - this.hero.width * this.hero.scaleX / 2 ) * -1 ;
        this.heroBoundRight = this.size.width / 2 - this.hero.width * this.hero.scaleX / 2 ;
        
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
        
        this.schedule(function(){
            self.onCreateBossBullet();
        }, this.spCreateBossBullet);
        
        
    },
    
    onRestartClick: function() {
        cc.director.loadScene('battle');
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.score_label.getComponent(cc.Label).string = this.score ;
        
        for(var _j in this.enemyArr)
        {
            var EnemyExistFlag = true;
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
                        
                        this.onGameOver();  // 停止所有创建物体
                        continue ; // 当前检测的敌机已经销毁
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
                    //检测敌机死亡
                    var rect = this.bulletArr[_i].getBoundingBoxToWorld() ;
                    if( rect.intersects ( this.enemyArr[_j].getBoundingBoxToWorld() ) ){
                        
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
                        cc.js.array.removeAt(this.enemyArr, _j);
                        cc.js.array.removeAt(this.bulletArr, _i);
                        
                        
                        this.score += this.enemy_score;
                        if( (++this.e_count) % 10 == 0 )
                        {
                            
                            //if(this.bossArr.length<=0)
                                this.createBoss();   // 每打死10个小怪，奖励一个boss战
                        }
                        
                        EnemyExistFlag = false; //设置敌机为不存在
                        break;  // 当前检测的子弹都已经销毁
                    }else{
                        //cc.log('no intersects');
                    }
                
                }catch(e){
                    cc.log(e.message);
                    
                }
            }
            
            if(!EnemyExistFlag){
                
                continue;
            }
            
        }
        
        
        //boss与hero的子弹碰撞检测
        if(this.bossArr.length>0){
            
            for(var _i in this.bossArr) {
                
                var _boss = this.bossArr[_i] ;
                var _bossBox = _boss._node.getBoundingBoxToWorld();
                
                for(var _j in this.bulletArr) {
                    try{
                        if(_bossBox.intersects(this.bulletArr[_j].getBoundingBoxToWorld())) {
                            var aa = this.bulletArr[_j] ;
                            var bb = _boss._node ;
                            
                            _boss._hp -= this.heroBulletPower ; 
                            if (_boss._hp <=0 ) _boss._hp = 0 ;
                            
                            var bar = _boss._node.getComponent(cc.ProgressBar) ;
                            bar.progress = _boss._hp / 100 ;
                            
                            var _boom = cc.instantiate(this.boom) ;
                            this.node.addChild(_boom);
                            _boom.setLocalZOrder(3);
                            _boom.setPosition(bb.getPosition());
                            
                            //播放爆炸动画后销毁
                            aa.removeFromParent();
                            _boom.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf()));
                            
                            //先把他们移除，防止二次检测
                            cc.js.array.removeAt(this.bulletArr, _j);
                            
                            
                            if (_boss._hp <=0 ){
                                cc.js.array.remove(this.bossArr, _boss);
                                bb.runAction(cc.sequence(cc.delayTime(0.1), cc.removeSelf())) ;
                                this.score += this.boss_score;
                            }
                        }
                    }catch(e){
                        cc.log(e.message);
                    }
                }
                
            }
            
        }
        
        
        // hero 和 boss的子弹碰撞检测
        if(this.bossBulletArr.length > 0 && this.heroIsLife)
        {
            var _heroBox = this.hero.getBoundingBoxToWorld();
            for(var _i in this.bossBulletArr){
                try{
                    if(_heroBox.intersects(this.bossBulletArr[_i].getBoundingBoxToWorld())) {
                        this.heroIsLife = false ;
                        this.hero.stopAllActions();   //  防止爆炸效果出现位移
                        
                        var bb = this.bossBulletArr[_i] ;
                        cc.js.array.remove(this.bossBulletArr, bb);
                        bb.removeFromParent();
                        
                        var _boom = cc.instantiate(this.boom) ;
                        this.node.addChild(_boom);
                        _boom.setPosition( this.hero.getPosition() );
                        _boom.setLocalZOrder(3);
                        
                        this.hero.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf())) ;
                        _boom.runAction(cc.sequence(cc.delayTime(0.5), cc.removeSelf()));
                        
                        this.onGameOver();  // 停止所有创建物体
                        break ; // 游戏结束
                    }
                }catch(e){
                    cc.log(e.message);
                }
            }
        }
        
        
    },
});