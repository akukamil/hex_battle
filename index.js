var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}, LANG = 0, state="",my_role="", game_tick=0, made_moves=0, game_id=0, my_turn=0, my_tile=0, connected = 1;
var  h_state=0, game_platform="", hidden_state_start = 0, room_name = 'states2';
var players="", pending_player="",tm={},me_conf_play=0, opp_conf_play=0;
var my_data={opp_id : ''},opp_data={};
var some_process = {}, git_src = "";
var WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;
const YELLOW_PLAYER = 1, RED_PLAYER = 2, GREEN_PLAYER = 3, NO_PLAYER = 0;

grid_data=[[244.115,45],[296.077,45],[348.038,45],[400,45],[451.962,45],[503.923,45],[555.885,45],[218.135,90],[270.096,90],[322.058,90],[374.019,90],[425.981,90],[477.942,90],[529.904,90],[581.865,90],[192.154,135],[244.115,135],[296.077,135],[348.038,135],[400,135],[451.962,135],[503.923,135],[555.885,135],[607.846,135],[166.173,180],[218.135,180],[270.096,180],[322.058,180],[374.019,180],[425.981,180],[477.942,180],[529.904,180],[581.865,180],[633.827,180],[140.192,225],[192.154,225],[244.115,225],[296.077,225],[348.038,225],[400,225],[451.962,225],[503.923,225],[555.885,225],[607.846,225],[659.808,225],[166.173,270],[218.135,270],[270.096,270],[322.058,270],[374.019,270],[425.981,270],[477.942,270],[529.904,270],[581.865,270],[633.827,270],[192.154,315],[244.115,315],[296.077,315],[348.038,315],[400,315],[451.962,315],[503.923,315],[555.885,315],[607.846,315],[218.135,360],[270.096,360],[322.058,360],[374.019,360],[425.981,360],[477.942,360],[529.904,360],[581.865,360],[244.115,405],[296.077,405],[348.038,405],[400,405],[451.962,405],[503.923,405],[555.885,405]]

irnd = function(min,max) {	
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

r2 = (v)=>{
	
	return (v >= 0 || -1) * Math.round(Math.abs(v)*1000)/1000;
	
}

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = "single";
		this.x=x;
		this.y=y;
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){cards_menu.card_down(id)};
		this.bcg.pointerover=function(){this.bcg.alpha=0.5;}.bind(this);
		this.bcg.pointerout=function(){this.bcg.alpha=1;}.bind(this);
		this.bcg.width=200;
		this.bcg.height=100;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=20;
		this.avatar.width=this.avatar.height=60;

		this.name="";
		this.name_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 20,align: 'center'});
		this.name_text.anchor.set(0.5,0.5);
		this.name_text.x=135;
		this.name_text.y=35;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 24,align: 'center'});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(0.5,0.5);
		this.rating_text.x=135;
		this.rating_text.y=70;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=20;
		this.avatar1.y=20;
		this.avatar1.width=this.avatar1.height=60;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=120;
		this.avatar2.y=20;
		this.avatar2.width=this.avatar2.height=60;

		this.rating_text1=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 18,align: 'center'});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=50;
		this.rating_text1.y=70;

		this.rating_text2=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 18,align: 'center'});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150;
		this.rating_text2.y=70;
		
		//
		this.rating_bcg = new PIXI.Sprite(game_res.resources.rating_bcg.texture);
		this.rating_bcg.width=200;
		this.rating_bcg.height=100;
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2, this.rating_bcg, this.rating_text,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};
		this.bcg.width = 370;
		this.bcg.height = 70;

		this.place=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25,align: 'center'});
		this.rating.x=298;
		this.rating.tint=0xff55ff;
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

class hex_cell_class extends PIXI.Container {
	
	constructor(id,x,y) {
		super();
		this.id=id;
		this.player_id =0;
		
		this.bcg = new PIXI.Sprite(gres.hex_cell_0.texture);
		this.bcg.anchor.set(0.5,0.5);	
		this.bcg.interactive = true;
		this.bcg.buttonMode = true;
		this.bcg.pointerdown = game.tile_down.bind(game,this.id);
		
		this.bcg2 = new PIXI.Sprite(gres.hex_cell_0.texture);
		this.bcg2.anchor.set(0.5,0.5);
		this.bcg2.visible = false;
		
		this.scale_xy=0.4;

		
		this.icon = new PIXI.Sprite();
		this.icon.anchor.set(0.5,0.5);
		
		this.selection_frame = new PIXI.Sprite(gres.hex_selected2.texture);
		this.selection_frame.anchor.set(0.5,0.5);
		this.selection_frame.visible = false;
		
		this.n0=[];
		this.n1=[];
		
		this.x=x;
		this.y=y;
		
		this.addChild(this.bcg,this.bcg2,this.icon, this.selection_frame);
	}	
	
	
	async flip(target_id) {
		
		let keep_scale_x = this.bcg.scale_x;
		this.player_id = target_id;
		anim2.add(this.icon,{alpha:[1, 0]}, false, 0.25,'linear');		
		await anim2.add(this.bcg,{scale_x:[keep_scale_x, 0]}, true, 0.25,'linear');		
		this.bcg.texture = gres['hex_cell_'+this.player_id].texture;	
		this.icon.texture = gres['icon_'+this.player_id].texture;
		this.icon.visible = true;
		anim2.add(this.icon,{alpha:[0, 1]}, true, 0.25,'linear');	
		anim2.add(this.bcg,{scale_x:[0, keep_scale_x]}, true, 0.25,'linear');		
		
	}
	
	async recolor(target_id, speed) {
				
		this.bcg2.texture = gres['hex_cell_'+target_id].texture;	
		anim2.add(this.bcg2,{alpha:[0, 1]}, false, speed,'linear');	
		await anim2.add(this.bcg,{alpha:[1, 0]}, true, speed,'linear');	
		
		this.bcg.texture = gres['hex_cell_'+target_id].texture;	
		this.bcg.alpha = 1;
	}
	
}

var anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	any_on : function() {
		
		for (let s of this.slot)
			if (s !== null)
				return true
		return false;		
	},
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	easeOutBounce: function(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	
	easeInCubic: function(x) {
		return x * x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI*2);
	},
	
	easeInOutCubic: function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake : function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		
		
	},	
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		/*if (anim3_origin === undefined)
			anim3.kill_anim(obj);*/

		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					
					
				this.slot[i] = {
					obj: obj,
					params: params,
					vis_on_end: vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

		
		

	},	
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;		
				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		
				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

var sound = {
	
	on : 1,
	
	play : function(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	}
	
	
}

var message =  {
	
	promise_resolve :0,
	
	add : async function(text) {
		
		if (this.promise_resolve!==0)
			this.promise_resolve("forced");
		
		//воспроизводим звук
		sound.play('message');

		objects.message_text.text=text;

		await anim2.add(objects.message_cont,{x:[-200,objects.message_cont.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				message.promise_resolve = resolve;
				setTimeout(resolve, 3000)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.message_cont,{x:[objects.message_cont.sx, -200]}, false, 0.5,'easeInBack');			
	}

}

var big_message = {
	
	p_resolve : 0,
		
	show: function(t1,t2) {
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.big_message_text.text=t1;
		anim2.add(objects.big_message_cont,{y:[-180,objects.big_message_cont.sy]}, true, 0.6,'easeOutBack');		
				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	close : function() {
		
		if (objects.big_message_cont.ready===false)
			return;

		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');		
		this.p_resolve("close");			
	}

}

var board_func = {
	
	get_checkers_left : function(checkers) {
		
		let my_checkers_left = 0;
		let opp_checkers_left = 0;		
		
		for (let [i, p] of Object.entries(pref.b_conf))
			if (checkers[i*1].visible === true && checkers[i*1].ready === true)	my_checkers_left++;

		for (let [i, p] of Object.entries(opp_data.b_conf))
			if (checkers[31 - i].visible === true && checkers[31 - i].ready === true)	opp_checkers_left++;
			
		return [my_checkers_left, opp_checkers_left]
		
	},
	
	update_motion : function(checkers, draw) {
		
		//обрабатываем движение шашек
		let motion_finished = 1;
		for (let i = 0 ; i < checkers.length ; i++) {	
			
			let c = checkers[i];
			if (c.visible === true && (c.dx !==0 || c.dy !== 0)) {
								
				c.x = r2(c.x + c.dx);
				c.y = r2(c.y + c.dy);
				
				if ((c.x > 600 || c.x < 200 || c.y > 420 || c.y < 20) && (c.ready === true || draw === 0)) {					
					if (draw === 1) {
						
						sound.play('chk_out');
						anim2.add(c,{alpha:[1, 0]}, false, 0.5,'linear');							
					}				
					else
						c.visible = false;
				}
				
	
				c.dx = r2(c.dx * 0.93);				
				c.dy = r2(c.dy * 0.93);
				
				if ((Math.abs(c.dx) + Math.abs(c.dy)) < 0.03) {
					c.dx = 0;	
					c.dy = 0;
				} else {
					motion_finished = 0;
				}				
			}		
		}		
		return motion_finished;
	},
	
	update_collisions : function(checkers, inv, show_boom) {
				
		//проверяем столкновения шашек
		let num_of_checkers = 32;			
		for (let _i = 0 ; _i < num_of_checkers - 1 ; _i++) {
						
			let i = inv === 1 ? num_of_checkers - 1 - _i : _i;			
			let c1 = checkers[i];
			for (let _k = _i + 1 ; _k < num_of_checkers ; _k++) {
				
				
				let k = inv === 1 ? num_of_checkers - 1 - _k : _k;		
				let c2 = checkers[k];
				if (c1.visible === true && c2.visible === true) {
					
					let dx = r2(c1.x - c2.x);
					let dy = r2(c1.y - c2.y);
					let d = r2(Math.sqrt(dx*dx + dy*dy));
					if (d < 42) {
						
						
						if (show_boom === 1) sound.play('hit');
								
						
						let resp = board_func.collision_response2(c1.x,c1.y,c1.dx,c1.dy,c1.m, c2.x,c2.y,c2.dx,c2.dy,c2.m);
												
						c1.dx=resp[0];
						c1.dy=resp[1];						
						c2.dx=resp[2];
						c2.dy=resp[3];							
						
					}					
				}				
			}			
		}
		
		//провряем столкновения с минами
		for (let _i = 0 ; _i < num_of_checkers  ; _i++) {
						
			let i = inv === 1 ? num_of_checkers - 1 - _i : _i;			
			let c1 = checkers[i];
			
			for (let m = 32 ; m < 40 ;m++) {
				let mine = checkers[m];
				
				if (c1.visible === true && mine.visible === true) {
				

					let dx = c1.x - mine.x;
					let dy = c1.y - mine.y;
					let d = r2(Math.sqrt(dx*dx+dy*dy));
					if (d<38) {		
						
						c1.visible = false;
						mine.visible = false;	
						if (show_boom === 1) {
							game.add_boom(mine.x + dx*0.5,mine.y + dy*0.5);						
							sound.play('blow');
						}

					}					
					
				}
			}
		}
		
		/*
		//столкновения со стенами
		for (let _i = 0 ; _i < num_of_checkers ; _i++) {
						
			let i = inv === 1 ? num_of_checkers - 1 - _i : _i;			
			let c = checkers[i];			
			let top_overlap = c.y - 21 - 20;
			let bot_overlap = c.y + 21 - 420
			if (top_overlap < 0) { c.y -= top_overlap; c.dy = -c.dy; if (show_boom === 1) sound.play('hit'); }
			if (bot_overlap > 0) { c.y -= bot_overlap; c.dy = -c.dy; if (show_boom === 1) sound.play('hit');}		
			
		}*/
		
		
		
		
		


		//убираем все перекрытия
		let no_overlap = 0;
		while(no_overlap === 0) {
			no_overlap = 1;
			for (let _i = 0 ; _i < num_of_checkers - 1 ; _i++) {
							
				let i = inv === 1 ? num_of_checkers - 1 - _i : _i;			
				let c1 = checkers[i];
				for (let _k = _i + 1 ; _k < num_of_checkers ; _k++) {
					
					
					let k = inv === 1 ? num_of_checkers - 1 - _k : _k;		
					let c2 = checkers[k];
					if (c1.visible === true && c2.visible === true) {
						
						
						let dx = r2(c1.x - c2.x);
						let dy = r2(c1.y - c2.y);
						let d = r2(Math.sqrt(dx*dx + dy*dy));
						let overlap = 42 - d;
						if (d < 42) {
							
							dx /= d;
							dy /= d;
							overlap += 0.3;
							c2.x = r2(c2.x - dx * overlap / 2);
							c2.y = r2(c2.y - dy * overlap / 2);
							
							c1.x = r2(c1.x + dx * overlap / 2);
							c1.y = r2(c1.y + dy * overlap / 2);
							no_overlap = 0;
						}					
					}				
				}			
			}			
		}

	},
	
	get_free_point : function(checkers) {
		
		let place_found = 0;
		let px = 0;
		let py = 0;
		while (place_found === 0) {
			
			place_found = 1;
			px = irnd(0,340) + 240;
			py = irnd(0,340) + 50;
			
			for (let c of checkers) {
			
				if (c.visible === true) {
					
					let dx = px - c.x;
					let dy = py - c.y;
					let d = Math.sqrt(dx*dx+dy*dy);
					if (d < 50) {
						place_found = 0;
						break;
					}
				}				
			}
		}
		
		return [px,py];		
		
	},
	
	get_num_of_mines : function (checkers) {
		
		let num_of_mines = 0;
		for (let i = 32 ; i < 40 ; i++)
			if (checkers[i].visible === true)
				num_of_mines++
			
		return num_of_mines;		
	},
	
	print : function(checkers, inv) {
		
		let num_of_checkers = 32;			
		for (let _i = 0 ; _i < num_of_checkers - 1 ; _i++) {
						
			let i = inv === 1 ? num_of_checkers - 1 - _i : _i;			
			let c = checkers[i];
			
			if (c.visible === true) {
				
				if (inv === 1)
					console.log(i,800 - c.x,440 - c.y, c.x,c.y);
				else
					console.log(i,c.x,c.y)				
				
			}
;
			
		}
		
		
	},
			
	collision_response2 : function(p0x, p0y, v0x, v0y, p0m, p1x, p1y, v1x, v1y, p1m) {


		let u=(p1x-=p0x)*p1x+(p1y-=p0y)*p1y;
		let v=v0x*p1x+v0y*p1y-v1x*p1x-v1y*p1y;
		let mk1=2*p1m/(p1m+p0m);
		let mk0=2*p0m/(p1m+p0m);
		
		let dx0=r2(v0x-(p1x*=v/u)*mk1)
		let dy0=r2(v0y-(v*=p1y/u)*mk1)
		let dx1=r2(v1x+p1x*mk0)
		let dy1=r2(v1y+v*mk0)
		return [dx0,dy0,dx1,dy1]
		
		
	},


}

var online_game = {
	
	name : 'online',
	start_time : 0,
	disconnect_time : 0,
	move_time_left : 0,
	timer_id : 0,
	
	calc_new_rating : function (old_rating, game_result) {
		
		
		if (game_result === NOSYNC)
			return old_rating;
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));
		
	},
	
	activate : async function (c_texture) {
		
		//пока еще никто не подтвердил игру
		this.me_conf_play = 0;
		this.opp_conf_play = 0;
		


		//счетчик времени
		this.move_time_left = 15;
		this.timer_id = setTimeout(function(){online_game.timer_tick()}, 1000);
		objects.timer_text.tint=0xffffff;
		
		//отображаем таймер
		objects.timer_cont.visible = true;
		objects.game_buttons_cont.visible = true;
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		let lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		if (lose_rating >100 && lose_rating<9999)
			firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);
		
		//устанавливаем локальный и удаленный статус
		set_state({state : 'p'});		
		
		
		
	},
	
	timer_tick : function () {

		this.move_time_left--;
		
		if (this.move_time_left < 0 && my_turn === 1)	{
			
			if (me_conf_play === 1)
				game.stop('my_timeout');
			else
				game.stop('my_no_sync');
			
			return;
		}

		if (this.move_time_left < -5 && my_turn === 0) {
			
			if (opp_conf_play === 1)
				game.stop('opp_timeout');
			else
				game.stop('opp_no_sync');
			
			
			return;
		}

		if (connected === 0 && my_turn === 0) {
			this.disconnect_time ++;
			if (this.disconnect_time > 5) {
				game.stop('my_no_connection');
				return;				
			}
		}		
		
		//подсвечиваем красным если осталость мало времени
		if (this.move_time_left === 5) {
			objects.timer_text.tint=0xff0000;
			sound.play('clock');
		}

		//обновляем текст на экране
		objects.timer_text.text="0:"+this.move_time_left;
		
		//следующая секунда
		this.timer_id = setTimeout(function(){online_game.timer_tick()}, 1000);		
	},
	
	reset_timer : function() {
		
		//обовляем время разъединения
		this.disconnect_time = 0;
		
		//перезапускаем таймер хода
		this.move_time_left = 32;
		objects.timer_text.text="0:"+this.move_time_left;
		objects.timer_text.tint=0xffffff;
		
		if (my_turn === 1)
			objects.timer_cont.x = 10;
		else
			objects.timer_cont.x = 620;
		
	},
		
	stop : async function (result) {
		
		let res_array = [
			['my_timeout',LOSE, ['Вы проиграли!\nУ вас закончилось время','You lose!\nYou out of time']],
			['opp_timeout',WIN , ['Вы выиграли!\nУ соперника закончилось время','You win!\nOpponent out of time']],
			['my_giveup' ,LOSE, ['Вы сдались!','You gave up!']],
			['opp_giveup' ,WIN , ['Вы выиграли!\nСоперник сдался','You win!\nOpponent gave up!']],
			['no_checkers_left',DRAW, ['Ничья','Draw!']],
			['only_my_left',WIN , ['Вы выиграли!\nСкинули все шашки соперника.','You win!\nYou have thrown off all the opponents checkers']],
			['only_opp_left',LOSE, ['Вы проиграли!\nСоперник скинул все ваши шашки.','You have lost!\nOpponent has thrown off all your checkers']],
			['my_no_sync',NOSYNC , ['Похоже вы не захотели начинать игру.','It looks like you did not want to start the game']],
			['opp_no_sync',NOSYNC , ['Похоже соперник не смог начать игру.','It looks like the opponent could not start the game']],
			['my_no_connection',LOSE , ['Потеряна связь!\nИспользуйте надежное интернет соединение.','Lost connection!\nUse a reliable internet connection']]
		];
		
		clearTimeout(this.timer_id);		
		
		let result_row = res_array.find( p => p[0] === result);
		let result_str = result_row[0];		
		let result_number = result_row[1];
		let result_info = result_row[2][LANG];
		
		let old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, result_number);
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
		
		//обновляем даные на карточке
		objects.my_card_rating.text=my_data.rating;
	
	
		//если диалоги еще открыты
		if (objects.stickers_cont.visible===true)
			stickers.hide_panel();	
		
		//если диалоги еще открыты
		if (objects.giveup_dialog.visible===true)
			giveup_menu.hide();
				
		//убираем элементы
		objects.timer_cont.visible = false;
		objects.game_buttons_cont.visible = false;
		
		//отключаем взаимодейтсвие с доской
		objects.board.pointerdown = function() {};
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE || result_number === NOSYNC )
			sound.play('lose');
		else
			sound.play('win');
		
		

		//если игра результативна то записываем дополнительные данные
		if (result_number === DRAW || result_number === LOSE || result_number === WIN) {
			
			//увеличиваем количество игр
			my_data.games++;
			firebase.database().ref("players/"+[my_data.uid]+"/games").set(my_data.games);		

			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			firebase.database().ref("finishes/"+game_id).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result_str,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			
			
			
			let check_players =[
				'1NOs1k4jKvIIe80grKaEoIZ59PbuP0TWlBOoFHrUoh4=',
				'2ifgfvcabThOq2EhUg2qYNagFukZm49Hky9CBILikrE=',
				'ApglJugCBw3owZiptBGmAFtghywpFDUl4GOE5yTevc8=',
				'HAXS4Uwl22XJybZg2gTbwaHUzHOMc7X1mLFS2Av8ayM=',
				'HHNnZgYsNjwFHsGW5l3uvtX+GOeZJJcD8HQz8RcThWw=',
				'Q91gCAYjLDQeTBZLiwmWWzWmhZnuKTAWgpLbm3kw9Uo=',
				'X3oRx1NdLMzDqrLaKAXAahBP8Pnq1k+irMDuHKHqMbY=',
				'Z8rpvOLTNIjvgZxnTMTSZX5Z08QfynLlxi0ZvWs0cV8=',
				'aPehlhdOYUKrCObw76SfaIGwK8BbBm2Hk7bR+WRNgsM=',
				'cZ9FfoeCzzwm3CbHPkBKRHTAh4qoDaJvrserVFtBvPo=',
				'ihwRwyyjjwtumUck+HzegY6D5kZ3tIJKQ1ZHPlN6s3k=',
				'ls4147060',
				'nYaoPB58Z5BqhFaOqpJx10MEQblZY7wMLgUxqunbQJg=',
				'p70n979DU+biBKD3wbiOn0hADScsGJZkoRnEAx7MRNI=',
				'v3fob5izUFzWXThIxl1VpWbmDulYWZlfWVRBG9qzrdQ=',
				'vNx2vRus1XIPlMFllQmDnqWfV3YZp7Ff5hYis5eKllc=',
				'vk113552413',
				'vk188397292',
				'w5jjfB09gf2kWOJ0BxicV1jUtkESey7npAzj+cyE078=',
				'wmXca5Z53ezNANjw+BkH5GpfjDOpg51D+bJGmTJHsnQ='	
			]
			
			if (check_players.includes(my_data.uid) || check_players.includes(opp_data.uid))
			{
			firebase.database().ref("finishes2").push({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':result_number,'fin_type':result_str,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});	
			}
			
		}
		
		//проверяем выход в мелкую комнату
		if (old_rating >= 1500 &&  my_data.rating <1500) {
			firebase.database().ref(room_name+"/"+my_data.uid).remove();
			room_name = 'states';
			message.add('Вы перешли в комнату для слабых игроков (((')
		}
		
		//проверяем выход в большую комнату
		if (my_data.rating >= 1500 &&  old_rating <1500) {
			firebase.database().ref(room_name+"/"+my_data.uid).remove();
			room_name = 'states2';
			message.add('Добро пожаловать в комнату для сильных игроков )))')
		}
	
		await big_message.show(result_info, ['Рейтинг','Rating'][LANG]+`: ${old_rating} > ${my_data.rating}`)


		
	},
	
	send_move : function(data) {
		
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:data});
		
	},
	
	clear : function() {
		
		
	}
	
}

var bot_game = {

	name :'bot',
	on : 0,
	b_conf : {24:[7,0,1],25:[7,1,1],26:[7,2,1],27:[7,3,1],28:[7,4,1],29:[7,5,1],30:[7,6,1],31:[7,7,1]},
	proxy_checkers : [],

	activate: async function() {

		//заполняем массив прокси шашек
		if (this.proxy_checkers.length === 0)
			for(let i = 0 ; i < 40 ; i++)
				this.proxy_checkers.push({x:0,y:0,dx:0,dy:0,visible:false,ready:true});

		//устанавливаем локальный и удаленный статус
		set_state ({state : 'b'});
		this.on = 1;
				
		//расставляем шашки бота
		for (let [i, p] of Object.entries(this.b_conf)) {	
			i = 31 - i;			
			let py = 7 - p[0];
			let px = 7 - p[1];			
			objects.checkers[i].y = objects.board.sy + 25 + 10 + py * 50;				
			objects.checkers[i].x = objects.board.sx + 25 + 10 + px * 50;
			objects.checkers[i].m = p[2];
			objects.checkers[i].bcg.texture = gres['red_checker'+p[2]].texture;
			objects.checkers[i].visible = true;
		}
		
				
		opp_data.b_conf = this.b_conf;
		
		//таймер уже не нужен
		objects.timer_cont.visible = false;
		objects.game_buttons_cont.visible = false;
		objects.sbgb_cont.visible = true;
		
		//устанаваем положение таймер хоть он и не задействован
		objects.timer_cont.x=10;
		objects.timer_text.text="<***>";
		await new Promise((resolve, reject) => setTimeout(resolve, 3000));
		this.send_move();

	},

	stop : async function(result) {

		let res_array = [
			['my_timeout',LOSE, ['Вы проиграли!\nУ вас закончилось время','You have lost!\nYou have run out of time']],
			['opp_timeout',WIN , ['Вы выиграли!\nУ соперника закончилось время','You have won!\nThe opponents time has run out']],
			['my_giveup' ,LOSE, ['Вы сдались!','You gave up!']],
			['opp_giveup' ,WIN , ['Вы выиграли!\nСоперник сдался','You have won!Opponent gave up\n']],
			['no_checkers_left',DRAW, ['Ничья','Draw']],
			['only_my_left',WIN , ['Вы выиграли!\nСкинули все шашки соперника.','You have won!\nYou have thrown off all the opponents checkers']],
			['only_opp_left',LOSE, ['Вы проиграли!\nСоперник скинул все ваши шашки.','You have lost!\nOpponent has thrown off all your checkers']],
			['my_stop',DRAW , ['Вы отменили игру.','You canceled the game']]			
		];
		
	
		this.on = 0;
		let result_number = res_array.find( p => p[0] === result)[1];
		let result_info = res_array.find( p => p[0] === result)[2][LANG];				
			
		//выключаем элементы
		objects.timer_cont.visible = false;
		objects.sbgb_cont.visible = false;
		
		//отключаем взаимодейтсвие с доской
		objects.board.pointerdown = function() {};
		
		//воспроизводим звук
		if (result_number === DRAW || result_number === LOSE)
			sound.play('lose');
		else
			sound.play('win');
		
		
		await big_message.show(result_info, ')))')
		
	},

	make_move: async function() {


	},
	
	reset_timer : function() {
		
		
	},
	
	send_move : async function() {
		
		await new Promise((resolve, reject) => setTimeout(resolve, 2000));
		
		//проверяем не законченная ли это игра
		[my_checkers_left, bot_checkers_left] = board_func.get_checkers_left(objects.checkers);
		if (my_checkers_left === 0 || bot_checkers_left === 0 )
			return;
				
		let best_data = {};
		let best_res = -999;
		for(let a = 0 ; a < 300 ; a++)	{
			
			//получаем перечень шашек
			let chk_list =[];
			for (let i = 0 ; i < 16;i++)
				if (objects.checkers[i].visible === true)
					chk_list.push(i);			
			
			//делаем случайный ход шашками бота
			let rnd_chk = chk_list[Math.floor(Math.random()*chk_list.length)];
					
			let rand_dir = Math.random() * Math.PI * 2;
			let dx = Math.sin(rand_dir) * 30;
			let dy = Math.cos(rand_dir) * 30;
			this.simulate(rnd_chk,dx,dy);
			let res = this.get_bot_result();
			res = res[1] - res[0]
			if (res > best_res) {						
				
				best_data = {cid: 31 - rnd_chk,dx:-dx,dy:-dy};
				best_res = res;
			}
			if (this.on === 0)	return;
			//await new Promise((resolve, reject) => setTimeout(resolve, 20));
		}				
			
		game.receive_move(best_data);
		
	},
	
	get_bot_result : function() {
		
		[my_checkers_left, bot_checkers_left] = board_func.get_checkers_left(this.proxy_checkers);
		return [my_checkers_left, bot_checkers_left];
		
	},
		
	simulate : function(cid,dx,dy) {
				
		//обрабатываем движение шашек
		let num_of_checkers = 32;			
		
		//копируем текущие данные шашек в прокси шашки
		for (let i = 0 ; i < objects.checkers.length ; i++) {
			
			this.proxy_checkers[i].x = objects.checkers[i].x;
			this.proxy_checkers[i].y = objects.checkers[i].y;
			this.proxy_checkers[i].dx = objects.checkers[i].dx;
			this.proxy_checkers[i].dy = objects.checkers[i].dy;
			this.proxy_checkers[i].m = objects.checkers[i].m;
			this.proxy_checkers[i].visible = objects.checkers[i].visible;
		}			
		
		this.proxy_checkers[cid].dx=dx;
		this.proxy_checkers[cid].dy=dy;
		
		while (1) {
			
			//обрабатываем движение и возвращаем указатель завершения
			let motion_finished = board_func.update_motion(this.proxy_checkers, 0);
									
			//проверяем столкновения шашек
			board_func.update_collisions(this.proxy_checkers, 1 , 0);	
			
			//если движение завершены то выходим
			if (motion_finished === 1)	return;
		}
		
	},
		
	clear : function() {
		
		//выключаем элементы
		//objects.timer_cont.visible = false;
		this.on = 0;
		objects.sbgb_cont.visible = false;
		
	}

}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

var social_dialog = {
	
	show : function() {
		
		anim2.add(objects.social_cont,{x:[800,objects.social_cont.sx]}, true, 0.06,'linear');
				
	},
	
	invite_down : function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		vkBridge.send('VKWebAppShowInviteBox');
		social_dialog.close();
		
	},
	
	share_down: function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		vkBridge.send('VKWebAppShowWallPostBox', {"message": `Мой рейтинг в игре Чапаев ${my_data.rating}. Сможешь победить меня?`,
		"attachments": "https://vk.com/app8203428"});
		social_dialog.close();
	},
	
	close_down: function() {
		if (objects.social_cont.ready !== true)
			return;
		
		gres.click.sound.play();
		social_dialog.close();
	},
	
	close : function() {
		
		anim2.add(objects.social_cont,{x:[objects.social_cont.x,800]}, false, 0.06,'linear');
				
	}
	
}

var	show_ad = async function(){
		
	if (game_platform==="YANDEX") {			
		try {
			await new Promise((resolve, reject) => {			
				window.ysdk.adv.showFullscreenAdv({  callbacks: {onClose: function() {resolve()}, onError: function() {resolve()}}});			
			});				
			
		} catch (e) {
			
			console.error(e);
		}
	}
	
	if (game_platform==="VK") {
				 
		try {
			await vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"});			
		} catch (e) {			
			console.error(e);
		}		
	}		

	if (game_platform==="CRAZYGAMES") {
				 
		try {
			const crazysdk = window.CrazyGames.CrazySDK.getInstance();
			crazysdk.init();
			crazysdk.requestAd('midgame');		
		} catch (e) {			
			console.error(e);
		}
	}		

}

var giveup_menu = {

	show: function() {


		if (made_moves <-2 ) {
			message.add(['Не сдавайтесь так быстро','Do not give up so fast'][LANG])
			return;
		}



		if (objects.giveup_dialog.ready===false)
			return;
		sound.play('click');

		//--------------------------
		anim2.add(objects.giveup_dialog,{y:[450, objects.giveup_dialog.sy]}, true, 0.5,'easeOutCubic');


	},

	give_up: function() {

		if (objects.giveup_dialog.ready===false)
			return;
		sound.play('click');

		//отправляем сообщени о сдаче и завершаем игру
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"END",tm:Date.now(),data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		this.hide();

		game.stop('my_giveup');

	},

	hide : function() {

		if (objects.giveup_dialog.ready===false)
			return;
		
		sound.play('close');

		//--------------------------
		anim2.add(objects.giveup_dialog,{y:[objects.giveup_dialog.sy, 450]}, false, 0.5,'easeInCubic');

	}
}

var keep_alive= function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref(room_name+"/"+my_data.uid).remove();
		return;		
	}


	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var process_new_message=function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		opp_data.uid=msg.sender;
		game_id=msg.game_id;
		cards_menu.accepted_invite();
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if (msg.message==="REJECT"  && pending_player === msg.sender) {
		cards_menu.rejected_invite();
	}

	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==="REFUSE")
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==="CONF")
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);

			//получение сообщение с сдаче
			if (msg.message==="END" )
				game.stop('opp_giveup');

			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				game.receive_move(msg.data);
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}

}

var req_dialog={

	_opp_data : {} ,
	
	show(uid) {

		firebase.database().ref("players/"+uid).once('value').then((snapshot) => {

			//не показываем диалог если мы в игре
			if (state === 'p')
				return;

			player_data=snapshot.val();

			//показываем окно запроса только если получили данные с файербейс
			if (player_data===null) {
				//console.log("Не получилось загрузить данные о сопернике");
			}	else	{

				//так как успешно получили данные о сопернике то показываем окно
				sound.play('receive_sticker');
			
				anim2.add(objects.req_cont,{y:[-260, objects.req_cont.sy]}, true, 0.75,'easeOutElastic');


				//Отображаем  имя и фамилию в окне приглашения
				req_dialog._opp_data.name=player_data.name;
				make_text(objects.req_name,player_data.name,200);
				objects.req_rating.text=player_data.rating;
				req_dialog._opp_data.rating=player_data.rating;

				//throw "cut_string erroor";
				req_dialog._opp_data.uid = uid;
				req_dialog._opp_data.b_conf = player_data.b_conf;

				//загружаем фото
				this.load_photo(player_data.pic_url);

			}
		});
	},

	load_photo: function(pic_url) {


		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//console.log("Загружаем текстуру "+objects.mini_cards[id].name)
			var loader = new PIXI.Loader();
			loader.add("inv_avatar", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			});
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log("Ставим из кэша "+objects.mini_cards[id].name)
			objects.req_avatar.texture=PIXI.utils.TextureCache[pic_url];
		}

	},

	reject: function() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;
		
		sound.play('close');



		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},

	accept: function() {

		if (objects.req_cont.ready===false || objects.req_cont.visible===false || game.motion_finished === 0)
			return;

		
		//устанавливаем окончательные данные оппонента
		opp_data = req_dialog._opp_data;	
	
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');


		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*999);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),game_id:game_id});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		game.activate(online_game, "slave");

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready === false || objects.req_cont.visible === false)
			return;
	
		anim2.add(objects.req_cont,{y:[objects.req_cont.sy, -260]}, false, 0.5,'easeInBack');

	}

}

var game = {
	
	opponent : "",
	selected_cell: -1,
	level_data : {},
	
	activate : async function(opponent, role) {
				
		//загружаем уровень
		let level_loader=new PIXI.Loader();
		level_loader.add("level", `${git_src}/levels/L3.txt`,{timeout: 5000});	
		await new Promise((resolve, reject)=> level_loader.load(resolve))
		this.level_data = JSON.parse(level_loader.resources.level.data);
		
		if (role==="master") {
			my_turn=1;		
			my_tile = YELLOW_PLAYER;
			message.add(['Ваш ход','Your turn'][LANG])
			
		} else {
			my_turn=0;
			my_tile = RED_PLAYER;
			message.add(['Ход соперника','Opponents move'][LANG])
		}
		
		if (this.opponent !== "")
			this.opponent.clear();
		
		//активируем оппонента
		this.opponent = opponent;
		await this.opponent.activate();	
		
		//расставляем тайлы по сетке уровня
		objects.hex_cells.forEach((c,i)=>{		
			
			let tile_state = this.level_data[i]===undefined ? -1 :this.level_data[i];
									
			switch (tile_state) {				
				
				case -1:
					c.visible=false;
				break;
				
				case NO_PLAYER:
					c.visible=true;
					c.bcg.texture = gres.hex_cell_0.texture;
					c.icon.visible=false;
					c.player_id = NO_PLAYER;
				break;
				
				case RED_PLAYER:
					c.visible=true;
					c.bcg.texture = gres.hex_cell_2.texture;
					c.icon.texture = gres.icon_2.texture;
					c.icon.visible=true;
					c.player_id = RED_PLAYER;
				break;
				
				case YELLOW_PLAYER:
					c.visible=true;
					c.bcg.texture = gres.hex_cell_1.texture;
					c.icon.texture = gres.icon_1.texture;
					c.icon.visible=true;
					c.player_id = YELLOW_PLAYER;
				break;

			}
		})
		
		
		//показываем контейнер
		anim2.add(objects.grid_cont,{alpha:[0, 1]}, true, 0.25,'linear');	
		
		//определяем границы карты
		let left = 9999, right = -9999, up = 9999, down = -9999;
		objects.hex_cells.forEach(c => {
			if (c.visible === true) {				
				if (c.x > right) right = c.x;
				if (c.x < left) left = c.x;
				if (c.y > down) down = c.y;
				if (c.y < up) up = c.y;					
			}
		})
		
		let cen_x =  (left + right) * 0.5;
		let cen_y =  (up + down) * 0.5;
		let width = right - left;
		let height = down - up;
		
		let max_width = Math.abs(grid_data[34][0] - grid_data[44][0]);
		let max_height = Math.abs(grid_data[0][1] - grid_data[72][1]);

		
		objects.grid_cont.scale_xy= 2 - ((height-90)/270);
		objects.grid_cont.pivot.x=cen_x;
		objects.grid_cont.pivot.y=cen_y;
		objects.grid_cont.x=400;
		objects.grid_cont.y=225;
		
	},
	
	process : function() {
		
		//objects.grid_cont.scale_xy = Math.sin(game_tick/10)*0.2+1;
		//objects.grid_cont.rotation = Math.sin(game_tick/20)*0.3;
		
	},
		
	flip_tiles: function(tile_obj) {
		
		let flip_found = 0;
		let cur_player_id = tile_obj.player_id;
		tile_obj.n0.forEach(t=>{
			
			let n0_tile = objects.hex_cells[t];
			if (n0_tile.player_id !== NO_PLAYER && n0_tile.player_id!==cur_player_id) {
				flip_found = 1;
				n0_tile.flip(cur_player_id)				
			}

		})
		
		if (flip_found===1)
			sound.play('flip');
		
		
	},
	
	jump : async function (tile0, tile1) {
				
		//убираем иконку так как будет активирована полетная иконка
		tile0.icon.visible = false;

		//присваиваем номер игрока следующему тайлу
		tile1.player_id = tile0.player_id;	
		
		//меняем начальный тайл
		tile0.recolor(NO_PLAYER, 0.4);
		tile0.player_id = NO_PLAYER;

		//перелет иконки
		objects.icon_fly.scale_xy = tile0.scale_xy;
		objects.icon_fly.texture = tile0.icon.texture;		
		await anim2.add(objects.icon_fly,{x:[tile0.x, tile1.x],y:[tile0.y, tile1.y]}, false, 0.4,'linear');

		//устанаваем иконку
		tile1.icon.texture = gres['icon_' + tile1.player_id].texture;
		tile1.icon.visible=true;

		//перекрашиваем конечный тайл
		tile1.recolor(tile1.player_id, 0.4);

		//меняем окружение
		this.flip_tiles(tile1);		
	
	},
		
	move : async function(tile0, tile1) {
		
		//присваиваем номер игрока следующему тайлу
		tile1.player_id = tile0.player_id;	
		
		//перелет иконки
		objects.icon_fly.scale_xy = tile0.scale_xy;
		objects.icon_fly.texture=tile0.icon.texture;
		await anim2.add(objects.icon_fly,{x:[tile0.x, tile1.x],y:[tile0.y, tile1.y]}, false, 0.4,'linear');


		//устанаваем иконку
		tile1.icon.texture = gres['icon_' + tile0.player_id].texture;
		tile1.icon.visible=true;
		
		//меняем цвет конечного тайла и его айди
		tile1.recolor(tile0.player_id, 0.4);
		
		//меняем соседние тайлы оппонента
		this.flip_tiles(tile1);		

		
	},
	
	tile_down : function(id) {
					
					
		if (my_turn === 0) {			
			message.add(['Не твоя очередь','Not your turn'][LANG]);
			return;
		}	
					
					
		//убираем все выделения
		for (let c of objects.hex_cells)
			c.selection_frame.visible=false;
		objects.hex_selected.visible = false;
		
		
		if (this.selected_cell === id) {
			this.selected_cell =-1;
			sound.play('send_chk');
			return;			
		}
				
				
		let cur_obj = objects.hex_cells[this.selected_cell];				
		let next_tile_obj = objects.hex_cells[id];
		
		//если нажали на чужой тайл
		if (this.selected_cell !== -1 && next_tile_obj.player_id!==NO_PLAYER &&  next_tile_obj.player_id !== my_tile) {		
			message.add("Это не Ваш тайл");
			this.selected_cell = -1
			return;
		}
		
		//это когда выбрали пустую или соперника ее нельзя выбирать
		if (this.selected_cell === -1 && (next_tile_obj.player_id !== my_tile)) {
			
			anim2.add(next_tile_obj,{x:[next_tile_obj.x, next_tile_obj.x+5]}, true, 0.25,'ease2back');	
			this.selected_cell = -1
			return;					
		}		
		
		if (this.selected_cell !== -1 && next_tile_obj.player_id === NO_PLAYER) {		
		
			//если близкий круг то клонирование
			if (cur_obj.n0.includes(id)) {
				this.move(cur_obj, next_tile_obj);				
				this.send_move(cur_obj, next_tile_obj);
			}
				
			//если дальний круг то прыжок - старый тайл становится пустым
			if (cur_obj.n1.includes(id)) {
				this.jump(cur_obj, next_tile_obj);
				this.send_move(cur_obj, next_tile_obj);
			}
			
			sound.play('send_chk');
			this.selected_cell = -1
			return;

		}
		
		sound.play('send_chk');
		this.selected_cell = id;

		//показываем выделение текущей ячейки
		objects.hex_selected.visible = true;
		objects.hex_selected.x = objects.hex_cells[id].x;
		objects.hex_selected.y = objects.hex_cells[id].y;
		objects.hex_selected.scale_xy = objects.hex_cells[id].scale_xy;
		
		//отображаем окружение
		objects.hex_cells[id].n0.forEach(h => {
			if (objects.hex_cells[h].player_id === NO_PLAYER)
				objects.hex_cells[h].selection_frame.visible=true;			
		})
		objects.hex_cells[id].n1.forEach(h => {
			if (objects.hex_cells[h].player_id === NO_PLAYER)
				objects.hex_cells[h].selection_frame.visible=true;			
		})
		
	},
	
	send_move : function(tile0, tile1) {
		
		//отправляем оппоненту информацию о ходе
		this.opponent.send_move({id0:tile0.id, id1:tile1.id});	
		
		this.opponent.reset_timer();
		my_turn = 0;
		
	},
		
	receive_move : function(move_data) {
		
		let cur_obj = objects.hex_cells[move_data.id0];				
		let next_tile_obj = objects.hex_cells[move_data.id1];
		
		
		//если близкий круг то клонирование
		if (cur_obj.n0.includes(move_data.id1))
			this.move(cur_obj, next_tile_obj);				

			
		//если дальний круг то прыжок - старый тайл становится пустым
		if (cur_obj.n1.includes(move_data.id1))
			this.jump(cur_obj, next_tile_obj);
		
		my_turn = 1;
		this.opponent.reset_timer();

	}
	
}

var main_menu= {

	activate: async function() {

		if (pref.music_on === 1) {
			if (gres.music.sound.isPlaying === false)
				gres.music.sound.play();
		} 
		
		objects.mb_cont.visible = true;
		
	},
	
	process : function() {
		

		
	},

	close : async function() {

		objects.mb_cont.visible=false;
		
		some_process.main_menu_process = function(){};
		anim2.add(objects.mb_cont,{y:[objects.mb_cont.y,450]}, false, 0.6,'linear');	
	},

	play_button_down: async function () {

		if (anim2.any_on()===true || objects.id_cont.visible === true) {
			sound.play('locked');
			return
		};


		sound.play('click');

		await this.close();
		cards_menu.activate();

	},

	lb_button_down: async function () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		lb.show();

	},

	rules_button_down: async function () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
	
		await this.close();
		rules.activate();


	},

	rules_ok_down: function () {

		anim2.add(objects.rules_cont,{y:[objects.rules_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	pref_button_down: async function () {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		await this.close();
		pref.activate();
	
	},

	pref_sound_switched : function() {
		
		if (objects.pref_sound_switch.ready === false) {
			sound.play('locked');
			return;
		}
		
		if (sound.on === 1) {
			anim2.add(objects.pref_sound_switch,{x:[238, 202]}, true, 0.25,'linear');		
			sound.on = 0;
			return;
		}

		if (sound.on === 0){
			
			anim2.add(objects.pref_sound_switch,{x:[202, 238]}, true, 0.25,'linear');		
			sound.on = 1;	
			sound.play('close');			
			return;			
		}
		
	}

}

var pref = {
	

	music_on : 0,
	b_conf : [],
	selected_checker : -1,	
	active : 0,
	
	activate : async function() {
		
		this.active = 1;
		this.selected_checker = -1;
		
		//обновляем данные о балансе
		this.update_balance_data(0);
		
		//обновляем данные о покупке новой шашки
		this.update_buy_checkers_price_data();
		
		
		objects.pref_info.text = ['Здесь можно изменить начальное расположение шашек, купить новые и улучшить их характеристики','Here you can change the initial location of checkers, buy new ones and improve their characteristics'][LANG];
		
		//показываем элементы меню
		anim2.add(objects.pref_info,{alpha:[0,1]}, true, 0.5,'linear');		
		anim2.add(objects.pref_board,{alpha:[0,1]}, true, 0.5,'linear');		
		anim2.add(objects.pref_back_button,{x:[800,objects.pref_back_button.sx]}, true, 0.5,'easeOutBack');	
		
		anim2.add(objects.bnc_cont,{x:[800,objects.bnc_cont.sx]}, true, 0.45,'easeOutBack');	
		anim2.add(objects.balance_cont,{x:[800,objects.balance_cont.sx]}, true, 0.5,'easeOutBack');	
		
		await anim2.add(objects.pref_cont,{x:[-250,objects.pref_cont.sx]}, true, 0.5,'easeOutBack');	
		
		//перенаправляем события нажатия сюда
		objects.checkers.forEach(c => {			
			c.pointerdown = pref.checker_down.bind(pref,c);			
		})
					
				
		this.update_board(1);		
	},
	
	sound_click : function() {
		
		if (objects.pref_sounds_slider.ready === false)
			return;		
		
		if (sound.on === 1)  {
			sound.on = 0;
			anim2.add(objects.pref_sounds_slider,{x:[160,130]}, true, 0.25,'linear');				
		} else {	
			sound.on = 1;
			anim2.add(objects.pref_sounds_slider,{x:[130,160]}, true, 0.25,'linear');				
		}

		
		//this.sound_on = 1 - this.sound_on;		
		
	},
	
	music_click : function() {
		
		if (objects.pref_music_slider.ready === false)
			return;
		
		if (this.music_on === 1) {
			gres.music.sound.stop();
			anim2.add(objects.pref_music_slider,{x:[160,130]}, true, 0.25,'linear');				
		}
	
		else {
			gres.music.sound.play();
			anim2.add(objects.pref_music_slider,{x:[130,160]}, true, 0.25,'linear');			
		}
	
		this.music_on = 1 - this.music_on;
		
	},	
	
	get_checker_by_pos : function(y,x) {
		
		for (let p of this.b_conf)
			if (p[0] === y && p[1] === x)
				return p;		
		return 0;		
	},
	
	checker_down : function(c) {
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		//звук
		sound.play('sel_chk_sound');
		
		if (c === this.selected_checker) {			
			objects.sel_chk.visible = false;			
			this.selected_checker = -1;
			anim2.add(objects.uc_cont,{x:[objects.uc_cont.x,800]}, false, 0.5,'easeInBack');	
			return;
		}	
		
		
		
		
		anim2.add(objects.uc_cont,{x:[800,objects.uc_cont.sx]}, true, 0.5,'easeOutBack');	


		objects.sel_chk.visible = true;
		objects.sel_chk.x = c.x;
		objects.sel_chk.y = c.y;
		
		this.selected_checker = c;		
		
		//обновляем данные о стоимости апгрейда
		this.update_upgrade_price(c);
		
	},
	
	update_buy_checkers_price_data : function() {
		
		let p = (Object.keys(this.b_conf).length - 7) * 30;
		objects.bnc_title.text = [`КУПИТЬ ШАШКУ\nЦена: ${p}$`,`BUY CHECKER\nPrice: ${p}$`][LANG];
		
	},
	
	update_upgrade_price : function(c) {		
		
		let cur_weight = this.b_conf[c.id][2];
		let upgrade_price = cur_weight * 5;		
		objects.uc_title.upgrade_price = upgrade_price;
		objects.uc_title.text = [`УТЯЖЕЛИТЬ\nЦена: ${upgrade_price}$`,`WEIGHT\nPrice: ${upgrade_price}$'`][LANG];
		
	},
	
	update_balance_data : function(amount) {
		
		my_data.money += amount;
		objects.balance_title.text = [`БАЛАНС\n${my_data.money}$`,`BALANCE\n${my_data.money}$`][LANG];
		
		//сохраняем конфигурацию в файербейс
		if (amount !==0)
			firebase.database().ref("players/"+my_data.uid+"/money").set(my_data.money);
	},
	
	upgrade_selected_checker : function() {
		
		if (this.selected_checker === -1)	return;
		

		//проверяем количество денег
		if (my_data.money < objects.uc_title.upgrade_price) {
			message.add(['Недостаточно средств для покупки','Not enough money'][LANG]);
			return;	
		}		
		
		//обновляем вес и текстуру
		let cur_weight = this.b_conf[this.selected_checker.id][2];
		
		if (cur_weight === 4) {
			message.add(['Больше утяжелить нельзя','Upgrade not available'][LANG]);
			return;	
		}
		
		
		let new_weight = cur_weight + 1;
		this.b_conf[this.selected_checker.id][2] = new_weight;
		this.selected_checker.bcg.texture = gres['red_checker'+new_weight].texture;
		
		//сперва обновляем данные о деньгах
		this.update_balance_data(-objects.uc_title.upgrade_price);		
		
		//обновляем информацию на карточке
		this.update_upgrade_price(this.selected_checker);
				
		//сохраняем конфигурацию в файербейс
		firebase.database().ref("players/"+my_data.uid+"/b_conf").set(this.b_conf);
		
	},
		
	get_free_cell : function() {
						
		for (let y = 4 ; y < 8 ; y ++) {
			for (let x = 0 ; x < 8 ; x ++) {
			
				let free = 1;
				for (let p of Object.entries(this.b_conf)) {
					if (p[1][0]===y && p[1][1]===x) {
						free = 0;							
						break;
					}					
				}

				if (free === 1)	return [y,x];		
			}
		}
		
	},
		
	buy_new_checker : function() {
		
		let c_ids = Object.keys(this.b_conf);
		let c_num = c_ids.length;
		
		if (c_num >= 16) {
			message.add(['Больше нельзя купить шашки','Can not buy checkers anymore'][LANG]);
			return;	
		} 	
		
		let new_checker_price = (c_num-7) * 30;
		if (my_data.money < new_checker_price) {
			message.add(['Недостаточно средств для апгрейда','Not enough money for upgrade'][LANG]);
			return;				
		}
		
		//добавляем новую шашку
		let new_checker_id = c_ids[0] - 1;
		let new_place = this.get_free_cell();
		this.b_conf[new_checker_id] = [new_place[0],new_place[1],1];	
			
		
		//обновляем данные о стоимости новой шашки
		this.update_buy_checkers_price_data();
		
		//обновляем данные о деньгах
		this.update_balance_data(-new_checker_price);
		
		//обнолвяем доску
		this.update_board(0);
		
		//сохраняем конфигурацию в файербейс
		firebase.database().ref("players/"+my_data.uid+"/b_conf").set(this.b_conf);
	},
		
	pointer_down_on_board : function(e) {
		
		//координаты указателя на шахматном поле
		var mx = ~~((e.data.global.x/app.stage.scale.x - objects.pref_board.sx - 10) / 50);
		var my = ~~((e.data.global.y/app.stage.scale.y - objects.pref_board.sy - 10) / 50);
		
		//проверка на валидность
		if (mx > 7 || mx < 0 || my > 7 || my < 4) return;
		
		//звук
		sound.play('sel_chk_sound');
		
		if (this.selected_checker!==-1) {
			
			anim2.add(objects.uc_cont,{x:[objects.uc_cont.x,800]}, false, 0.5,'easeInBack');
			
			this.b_conf[this.selected_checker.id][0] = my;
			this.b_conf[this.selected_checker.id][1] = mx;
						
			this.selected_checker = -1;
			objects.sel_chk.visible = false;
			
			this.update_board(0);
			
			return;
		}	
	
	},
	
	update_board : function(init){
		
		//расставляем текущее расположение шашек
		for (let [i, p] of Object.entries(this.b_conf)) {
			
			i*=1;
			
			if (init === 1)
				anim2.add(objects.checkers[i],{alpha:[0,1]}, true, 0.5,'linear');	
			
			objects.checkers[i].x = objects.pref_board.sx + 25 + 10 + p[1]*50;
			objects.checkers[i].y = objects.pref_board.sy + 25 + 10 + p[0]*50;
			objects.checkers[i].bcg.texture=gres['red_checker' + p[2]].texture;
			objects.checkers[i].visible = true;
			
			
		}
		
		
	},
	
	back_button_down : async function() {
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		sound.play('click');
		
		this.close();
		
		main_menu.activate();
		
	},
	
	close : async function() {
		
		this.active = 0;
		
		//сохраняем конфигурацию в файербейс
		firebase.database().ref("players/"+my_data.uid+"/b_conf").set(this.b_conf);
		
		objects.sel_chk.visible = false;
		objects.checkers.forEach(c => {c.visible = false});
		
		if (objects.uc_cont.visible === true)
			anim2.add(objects.uc_cont,{x:[objects.uc_cont.x,800]}, false, 0.5,'easeInBack');

		anim2.add(objects.pref_info,{alpha:[1,0]}, false, 0.5,'linear');	
		anim2.add(objects.balance_cont,{x:[objects.balance_cont.x, 800]}, false, 0.5,'easeInBack');	
		anim2.add(objects.bnc_cont,{x:[objects.bnc_cont.x,800]}, false, 0.45,'easeInBack');	
		
		
		anim2.add(objects.pref_board,{alpha:[1,0]}, false, 0.5,'linear');		
		anim2.add(objects.pref_back_button,{x:[objects.pref_back_button.sx,800]}, false, 0.5,'easeInBack');		
		await anim2.add(objects.pref_cont,{x:[objects.pref_cont.x,-250]}, false, 0.5,'easeInBack');	
		
	}
	
}

var lb = {
	
	active : 0,
	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		this.active = 1;
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;

		
		anim2.add(objects.leader_header,{y:[-50, objects.leader_header.sy]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_1_cont,{x:[-150, objects.lb_1_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150, objects.lb_2_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150, objects.lb_3_cont.sx]}, true, 0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450, 0]}, true, 0.5,'easeOutCubic');
		anim2.add(objects.lb_back_button,{x:[800, objects.lb_back_button.sx]}, true, 0.5,'easeOutCubic');
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 1,'linear');			


		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}


		this.update();

	},

	close: async function() {

		this.active = 0;
		anim2.add(objects.leader_header,{y:[objects.leader_header.y,-50]}, true, 0.5,'easeInBack');
		anim2.add(objects.lb_1_cont,{x:[objects.lb_1_cont.x,-150]}, false, 0.5,'easeInBack');
		anim2.add(objects.lb_2_cont,{x:[objects.lb_2_cont.x,-150]}, false, 0.5,'easeInBack');
		anim2.add(objects.lb_3_cont,{x:[objects.lb_3_cont.x,-150]}, false, 0.5,'easeInBack');
		anim2.add(objects.lb_cards_cont,{x:[objects.lb_cards_cont.x, 450]}, false, 0.5,'easeInBack');
		anim2.add(objects.lb_back_button,{x:[objects.lb_back_button.x, 800]}, false, 0.5,'easeInBack');
		await anim2.add(objects.desktop,{alpha:[1,0]}, false, 0.6,'linear');		

	},

	back_button_down: async function() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');
		await this.close();
		main_menu.activate();

	},

	update: function () {

		firebase.database().ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {

			if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='')
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					if (players_array[i]!== undefined) {						
						make_text(objects['lb_'+(i+1)+'_name'],players_array[i][0],180);					
						objects['lb_'+(i+1)+'_rating'].text=players_array[i][1];
						loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});						
					}
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					if (players_array[i]!== undefined) {
						
						let fname=players_array[i][0];
						make_text(objects.lb_cards[i-3].name,fname,180);
						objects.lb_cards[i-3].rating.text=players_array[i][1];
						loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});						
					} 
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

var rules = {
	
	active : 0,
	
	activate : function() {
		
		this.active = 1;
		anim2.add(objects.desktop,{alpha:[0,0.5]}, true, 0.6,'linear');	
		anim2.add(objects.rules_back_button,{x:[800, objects.lb_back_button.sx]}, true, 0.5,'easeOutCubic');
		anim2.add(objects.rules_text,{alpha:[0, 1]}, true, 1,'linear');
		objects.rules_text.text = ['Добро пожаловать в игру Чапаев!\n\nПравила игры очень простые - нужно метким и направленным движением выбить шашки соперника с левого или правого края доски. Есть возможность улучшить характеристики шашек за внутриигровую валюту, а также приобрести дополнительные шашки. Побеждайте соперников в онлайн игре и становитесь лидером.\n\nУдачи!','Welcome to the Chapaev game!\n\nThe rules of the game are very simple - you need to accurately and directionally knock out the opponents checkers from the left or right edge of the board. There is an opportunity to improve the characteristics of checkers for in-game currency, as well as to purchase additional checkers. Defeat your rivals in an online game and become a leader.\n\nGood luck!'][LANG];
	},
	
	back_button_down : async function() {
		
		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};
		
		await this.close();
		main_menu.activate();
		
	},
	
	close : async function() {
		
		this.active = 0;
		anim2.add(objects.rules_text,{alpha:[1, 0]}, false, 0.5,'linear');
		anim2.add(objects.desktop,{alpha:[1, 0]}, false, 0.5,'linear');
		await anim2.add(objects.rules_back_button,{x:[objects.rules_back_button.x, 800]}, false, 0.5,'easeInCubic');
		
		
	}	
	
	
}

var cards_menu = {
	
	_opp_data : {},
	uid_pic_url_cache : {},
	
	cards_pos: [
				[0,0],[0,90],[0,180],[0,270],
				[190,0],[190,90],[190,180],[190,270],
				[380,0],[380,90],[380,180],[380,270],
				[570,0],[570,90],[570,180]

				],

	activate: function () {



		objects.desktop.texture=game_res.resources.cards_bcg.texture;
		anim2.add(objects.cards_menu_header,{y:[-50, objects.cards_menu_header.sy]}, true, 0.5,'easeOutBack');
		anim2.add(objects.cards_cont,{alpha:[0,1]}, true, 0.4,'linear');		
		anim2.add(objects.back_button,{x:[800, objects.back_button.sx]}, true, 0.5,'easeOutCubic');
		anim2.add(objects.desktop,{alpha:[0,1]}, true, 0.4,'linear');
		anim2.add(objects.players_online,{y:[470, objects.players_online.sy]}, true, 0.5,'easeOutCubic');

		//расставляем по соответствующим координатам
		for(let i=0;i<15;i++) {
			objects.mini_cards[i].x=this.cards_pos[i][0];
			objects.mini_cards[i].y=this.cards_pos[i][1];
		}


		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<15;i++)
			objects.mini_cards[i].visible=false;

		//добавляем карточку ии
		this.add_cart_ai();

		
		
		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name) .on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});

	},

	players_list_updated: function(players) {

		//если мы в игре то не обновляем карточки
		if (state==="p" || state==="b")
			return;


		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};


		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков
		for (let uid in players){			
			if (players[uid].state !== 'p' && players[uid].hidden === 0)
				single[uid] = players[uid].name;						
		}
		
		//console.table(single);
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];
		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
			//проходимся по соперникам
			for (let uid2 in players) {	
				let s_id=uid2.substring(0,10);				
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}							
			}			
		}
				
		
		//определяем столы
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игрокова
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
			
		objects.players_online.text=['Игроков онлайн: ','Players online: '][LANG] + num + ['     ( комната: ','     ( room: '][LANG] + room_name +' )';
		
		
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > 14) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - 14);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}

		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=1;i<15;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state , rating:players[card_uid].rating});
			}
		}



		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=1;i<15;i++) {			
			
				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {					
					if (p ===  objects.mini_cards[i].uid) {
						
						found = 1;							
					}	
				}				
			}		
			
			if (found === 0)
				new_single[p] = single[p];
		}
		

		
		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=1;i<15;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;						
					}							
				}
								
				if (found === 0)
					objects.mini_cards[i].visible = false;
			}	
		}
		
		
		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)			
			this.place_new_cart({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2});
		}
		
	},

	get_state_tint: function(s) {

		switch(s) {

			case "o":
				return 0x559955;
			break;

			case "b":
				return 0x376f37;
			break;

			case "p":
				return 0x344472;
			break;

			case "w":
				return 0x990000;
			break;
		}
	},

	place_table : function (params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400}) {
				
		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint('p');
				
				//присваиваем карточке данные
				//objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].uid1=params.uid1;
				objects.mini_cards[i].uid2=params.uid2;
												
				//убираем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = false;
				objects.mini_cards[i].avatar.visible = false;
				objects.mini_cards[i].name_text.visible = false;

				//Включаем элементы стола 
				objects.mini_cards[i].rating_text1.visible = true;
				objects.mini_cards[i].rating_text2.visible = true;
				objects.mini_cards[i].avatar1.visible = true;
				objects.mini_cards[i].avatar2.visible = true;
				objects.mini_cards[i].rating_bcg.visible = true;

				objects.mini_cards[i].rating_text1.text = params.rating1;
				objects.mini_cards[i].rating_text2.text = params.rating2;
				
				objects.mini_cards[i].name1 = params.name1;
				objects.mini_cards[i].name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:objects.mini_cards[i].avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:objects.mini_cards[i].avatar2});


				objects.mini_cards[i].visible=true;


				break;
			}
		}
		
	},

	update_existing_card: function(params={id:0, state:"o" , rating:1400}) {

		//устанавливаем цвет карточки в зависимости от состояния(имя и аватар не поменялись)
		objects.mini_cards[params.id].bcg.tint=this.get_state_tint(params.state);
		objects.mini_cards[params.id].state=params.state;

		objects.mini_cards[params.id].rating=params.rating;
		objects.mini_cards[params.id].rating_text.text=params.rating;
		objects.mini_cards[params.id].visible=true;
	},

	place_new_cart: function(params={uid:0, state: "o", name: "XXX", rating: rating}) {

		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture = gres.mini_player_card.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "single";

				//присваиваем карточке данные
				objects.mini_cards[i].uid=params.uid;

				//убираем элементы стола так как они не нужны
				objects.mini_cards[i].rating_text1.visible = false;
				objects.mini_cards[i].rating_text2.visible = false;
				objects.mini_cards[i].avatar1.visible = false;
				objects.mini_cards[i].avatar2.visible = false;
				objects.mini_cards[i].rating_bcg.visible = false;
				
				//включаем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = true;
				objects.mini_cards[i].avatar.visible = true;
				objects.mini_cards[i].name_text.visible = true;

				objects.mini_cards[i].name=params.name;
				make_text(objects.mini_cards[i].name_text,params.name,110);
				objects.mini_cards[i].rating=params.rating;
				objects.mini_cards[i].rating_text.text=params.rating;

				objects.mini_cards[i].visible=true;

				//стираем старые данные
				objects.mini_cards[i].avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:objects.mini_cards[i].avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				break;
			}
		}

	},

	get_texture : function (pic_url) {
		
		return new Promise((resolve,reject)=>{
			
			//меняем адрес который невозможно загрузить
			if (pic_url==="https://vk.com/images/camera_100.png")
				pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";

			//сначала смотрим на загруженные аватарки в кэше
			if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

				//загружаем аватарку игрока
				//console.log(`Загружаем url из интернети или кэша браузера ${pic_url}`)	
				let loader=new PIXI.Loader();
				loader.add("pic", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
				loader.load(function(l,r) {	resolve(l.resources.pic.texture)});
			}
			else
			{
				//загружаем текустуру из кэша
				//console.log(`Текстура взята из кэша ${pic_url}`)	
				resolve (PIXI.utils.TextureCache[pic_url]);
			}
		})
		
	},
	
	get_uid_pic_url : function (uid) {
		
		return new Promise((resolve,reject)=>{
						
			//проверяем есть ли у этого id назначенная pic_url
			if (this.uid_pic_url_cache[uid] !== undefined) {
				//console.log(`Взяли pic_url из кэша ${this.uid_pic_url_cache[uid]}`);
				resolve(this.uid_pic_url_cache[uid]);		
				return;
			}

							
			//получаем pic_url из фб
			firebase.database().ref("players/" + uid + "/pic_url").once('value').then((res) => {

				pic_url=res.val();
				
				if (pic_url === null) {
					
					//загрузить не получилось поэтому возвращаем случайную картинку
					resolve('https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg');
				}
				else {
					
					//добавляем полученный pic_url в кэш
					//console.log(`Получили pic_url из ФБ ${pic_url}`)	
					this.uid_pic_url_cache[uid] = pic_url;
					resolve (pic_url);
				}
				
			});		
		})
		
	},
	
	load_avatar2 : function (params = {uid : 0, tar_obj : 0, card_id : 0}) {
		
		//получаем pic_url
		this.get_uid_pic_url(params.uid).then(pic_url => {
			return this.get_texture(pic_url);
		}).then(t=>{			
			params.tar_obj.texture=t;			
		})	
	},

	add_cart_ai: function() {

		//убираем элементы стола так как они не нужны
		objects.mini_cards[0].rating_text1.visible = false;
		objects.mini_cards[0].rating_text2.visible = false;
		objects.mini_cards[0].avatar1.visible = false;
		objects.mini_cards[0].avatar2.visible = false;
		objects.mini_cards[0].rating_bcg.visible = false;

		objects.mini_cards[0].bcg.tint=0x777777;
		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="AI";
		objects.mini_cards[0].name=['Чапаев (бот)', 'Chapaev (bot)'][LANG];
		objects.mini_cards[0].name_text.text=['Чапаев (бот)', 'Chapaev (bot)'][LANG];
		objects.mini_cards[0].rating_text.text="1400";
		objects.mini_cards[0].rating=1400;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;
	},
	
	card_down : function ( card_id ) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog : function (card_id) {
		
		if (anim2.any_on === true) {
			sound.play('locked');
			return
		};

		
		anim2.add(objects.td_cont,{y:[-150, objects.td_cont.sy]}, true, 0.5,'easeOutBack');
		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].rating_text1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].rating_text2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 150);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 150);
		
	},
	
	close_table_dialog : function () {
		
		sound.play('close');
		
		anim2.add(objects.td_cont,{y:[objects.td_cont.sy, 400]}, false, 0.5,'easeInBack');

		
	},

	show_invite_dialog: function(cart_id) {

		if (anim2.any_on() === true) {
			sound.play('locked');
			return
		};

		pending_player="";

		sound.play('click');

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;
	
		anim2.add(objects.invite_cont,{y:[-150, objects.invite_cont.sy]}, true, 0.5,'easeOutBack');


		//копируем предварительные данные
		cards_menu._opp_data = {uid:objects.mini_cards[cart_id].uid,name:objects.mini_cards[cart_id].name,rating:objects.mini_cards[cart_id].rating};
		
		objects.invite_button_title.text=['Пригласить','Send invite'][LANG];

		let invite_available = 	cards_menu._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="o" || objects.mini_cards[cart_id].state==="b");
		invite_available=invite_available || cards_menu._opp_data.uid==="AI";

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=objects.invite_button_title.visible=invite_available;

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		make_text(objects.invite_name,cards_menu._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;

	},

	close: async function() {


		if (objects.invite_cont.visible === true)
			this.hide_invite_dialog();
		
		if (objects.td_cont.visible === true)
			this.close_table_dialog();

		//плавно все убираем
		anim2.add(objects.cards_menu_header,{y:[ objects.cards_menu_header.y, -50]}, false, 0.4,'easeInCubic');
		anim2.add(objects.cards_cont,{alpha:[1,0]}, false, 0.4,'linear');		
		anim2.add(objects.back_button,{x:[objects.back_button.sx, 800]}, false, 0.5,'easeInCubic');
		anim2.add(objects.desktop,{alpha:[1,0]}, false, 0.4,'linear');
		await anim2.add(objects.players_online,{y:[objects.players_online.y, 470]}, false, 0.5,'easeInCubic');

		//больше ни ждем ответ ни от кого
		pending_player="";


		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).off();

	},

	hide_invite_dialog: function() {

		sound.play('close');

		if (objects.invite_cont.visible===false)
			return;

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="") {
			firebase.database().ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player="";
		}


		anim2.add(objects.invite_cont,{y:[objects.invite_cont.sy, 400]}, false, 0.5,'easeInBack');


	},

	send_invite: async function() {


		if (objects.invite_cont.ready===false || objects.invite_cont.visible===false)
			return;

		if (anim2.any_on() === true) {
			sound.play('locked');
			return
		};

		if (cards_menu._opp_data.uid==="AI")
		{
			await this.close();
			
			//заполняем данные бот-оппонента
			make_text(objects.opp_card_name,cards_menu._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;	
			
			game.activate(bot_game, 'slave');
		}
		else
		{
			sound.play('click');
			objects.invite_button_title.text=['Ждите ответ..','Waiting...'][LANG];
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;

		}

	},

	rejected_invite: function() {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show("Соперник отказался от игры",'(((');

	},

	accepted_invite: async function() {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=cards_menu._opp_data;
		
		//сразу карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=objects.invite_avatar.texture;		

		//закрываем меню и начинаем игру
		await cards_menu.close();
		game.activate(online_game, "master");
	},

	back_button_down: async function() {

		if (anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		await this.close();
		main_menu.activate();

	}

}

var stickers = {
	
	promise_resolve_send :0,
	promise_resolve_recive :0,

	show_panel: function() {


		if (anim2.any_on()===true ||objects.big_message_cont.visible === true) {
			sound.play('locked');
			return
		};

		if (objects.stickers_cont.ready===false)
			return;
		sound.play('click');


		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450, objects.stickers_cont.sy]}, true, 0.5,'easeOutBack');

	},

	hide_panel: function() {

		sound.play('close');

		if (objects.stickers_cont.ready===false)
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.sy, -450]}, false, 0.5,'easeInBack');

	},

	send : async function(id) {

		if (objects.stickers_cont.ready===false)
			return;
		
		if (this.promise_resolve_send!==0)
			this.promise_resolve_send("forced");

		this.hide_panel();

		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		message.add("Стикер отправлен сопернику");

		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		
		await anim2.add(objects.sent_sticker_area,{alpha:[0, 0.5]}, true, 0.5,'linear');
		
		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_send = resolve;
				setTimeout(resolve, 2000)
			}
		);
		
		if (res === "forced")
			return;

		await anim2.add(objects.sent_sticker_area,{alpha:[0.5, 0]}, false, 0.5,'linear');
	},

	receive: async function(id) {

		
		if (this.promise_resolve_recive!==0)
			this.promise_resolve_recive("forced");

		//воспроизводим соответствующий звук
		sound.play('receive_sticker');

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
	
		await anim2.add(objects.rec_sticker_area,{x:[-150, objects.rec_sticker_area.sx]}, true, 0.5,'easeOutBack');

		let res = await new Promise((resolve, reject) => {
				stickers.promise_resolve_recive = resolve;
				setTimeout(resolve, 2000)
			}
		);
		
		if (res === "forced")
			return;

		anim2.add(objects.rec_sticker_area,{x:[objects.rec_sticker_area.sx, -150]}, false, 0.5,'easeInBack');

	}

}

var auth = function() {
	
	return new Promise((resolve, reject)=>{

		let help_obj = {

			loadScript : function(src) {
			  return new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.type = 'text/javascript'
				script.onload = resolve
				script.onerror = reject
				script.src = src
				document.head.appendChild(script)
			  })
			},

			init: async function() {

				//анимация лупы
				some_process.loup_anim=function() {
					objects.id_loup.x=20*Math.sin(game_tick*8)+90;
					objects.id_loup.y=20*Math.cos(game_tick*8)+150;
				}

				let s = window.location.href;

				//-----------ЯНДЕКС------------------------------------
				if (s.includes("yandex")) {
					game_platform="YANDEX";
					try {
						await this.loadScript('https://yandex.ru/games/sdk/v2')						
					} catch (e) {
						alert(e);
					}
					help_obj.yandex();
					return;
				}

				//-----------CRAZYGAMES------------------------------------
				if (s.includes("crazygames")) {
					game_platform="CRAZYGAMES";					
					try {
						await this.loadScript('https://sdk.crazygames.com/crazygames-sdk-v1.js')					
					} catch (e) {
						alert(e);
					}
					help_obj.crazygames();										
					return;
				}
				
				
				//-----------ВКОНТАКТЕ------------------------------------
				if (s.includes("vk.com")) {
					game_platform="VK";
					
					try {
						await this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')				
					} catch (e) {
						alert(e);
					}
					help_obj.vk()					
					return;
				}


				//-----------ЛОКАЛЬНЫЙ СЕРВЕР--------------------------------
				if (s.includes("192.168")) {
					game_platform="debug";
					help_obj.debug();
					return;
				}


				//-----------НЕИЗВЕСТНОЕ ОКРУЖЕНИЕ---------------------------
				game_platform="unknown";
				help_obj.unknown();

			},

			get_random_name : function(e_str) {
				
				let rnd_names = ['Gamma','Жираф','Зебра','Тигр','Ослик','Мамонт','Волк','Лиса','Мышь','Сова','Hot','Енот','Кролик','Бизон','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
				let chars = '+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				if (e_str !== undefined) {
					
					let e_num1 = chars.indexOf(e_str[0]) + chars.indexOf(e_str[1]) + chars.indexOf(e_str[2]) +	chars.indexOf(e_str[3]);
					e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);					
					let e_num2 = chars.indexOf(e_str[4]).toString()  + chars.indexOf(e_str[5]).toString()  + chars.indexOf(e_str[6]).toString() ;	
					e_num2 = e_num2.substring(0, 3);
					return rnd_names[e_num1] + e_num2;					
					
				} else {

					let rnd_num = irnd(0, rnd_names.length - 1);
					let rand_uid = irnd(0, 999999)+ 100;
					let name_postfix = rand_uid.toString().substring(0, 3);
					let name =	rnd_names[rnd_num] + name_postfix;				
					return name;
				}							

			},	

			get_random_name2 : function(e_str) {
				
				let rnd_names = ['Crazy','Monkey','Sky','Mad','Doom','Hash','Sway','Ace','Thor'];
				let chars = '+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				if (e_str !== undefined) {
					
					let e_num1 = chars.indexOf(e_str[0]) + chars.indexOf(e_str[1]) + chars.indexOf(e_str[2]) +	chars.indexOf(e_str[3]);
					e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);					
					let e_num2 = chars.indexOf(e_str[4]).toString()  + chars.indexOf(e_str[5]).toString()  + chars.indexOf(e_str[6]).toString() ;	
					e_num2 = e_num2.substring(0, 3);
					return rnd_names[e_num1] + e_num2;					
					
				} else {

					let rnd_num = irnd(0, rnd_names.length - 1);
					let rand_uid = irnd(0, 999999)+ 100;
					let name_postfix = rand_uid.toString().substring(0, 3);
					let name =	rnd_names[rnd_num] + name_postfix;				
					return name;
				}						
			},	
			
			yandex: function() {

				
				if(typeof(YaGames)==='undefined')
				{
					help_obj.local();
				}
				else
				{
					//если sdk яндекса найден
					YaGames.init({}).then(ysdk => {

						//фиксируем SDK в глобальной переменной
						window.ysdk=ysdk;

						//запрашиваем данные игрока
						return ysdk.getPlayer();


					}).then((_player)=>{


						my_data.name 	= _player.getName();
						my_data.uid 	= _player.getUniqueID().replace(/\//g, "Z");
						my_data.pic_url = _player.getPhoto('medium');

						//console.log(`Получены данные игрока от яндекса:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

						//если нет данных то создаем их
						if (my_data.name=="" || my_data.name=='')
							my_data.name = help_obj.get_random_name(my_data.uid);


						help_obj.process_results();

					}).catch((err)=>{

						//загружаем из локального хранилища если нет авторизации в яндексе
						help_obj.local();

					})
				}
			},

			vk: function() {

				vkBridge.send('VKWebAppInit').then(()=>{
					
					return vkBridge.send('VKWebAppGetUserInfo');
					
				}).then((e)=>{
					
					my_data.name 	= e.first_name + ' ' + e.last_name;
					my_data.uid 	= "vk"+e.id;
					my_data.pic_url = e.photo_100;

					//console.log(`Получены данные игрока от VB MINIAPP:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);
					help_obj.process_results();		
					
				}).catch(function(e){
					
					alert(e);
					
				});

			},

			get_cg_user_data : async function(event) {
				
				return new Promise(function(resolve, reject) {

					let crazysdk = window.CrazyGames.CrazySDK.getInstance();
					crazysdk.init();
					
					crazysdk.addEventListener('initialized', function(event) {	
						my_data.country_code = event.userInfo.countryCode;	
						resolve();					
					});
					
				});
				
			},

			crazygames : async function() {
				
				//переключаем язык на английский
				LANG = 1;
				
				//запускаем сдк	и получаем информацию о стране			
				await help_obj.get_cg_user_data();
								
				//ищем в локальном хранилище
				let local_uid = null;
				try {
					local_uid = localStorage.getItem('uid');
				} catch (e) {
					console.log(e);
				}

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");
					let rnd_names=["Crazy","Monkey","Sky","Mad","Doom","Hash"];
					
					//console.log("Создаем нового локального пользователя");
					let rand_uid=Math.floor(Math.random() * 9999999);
					my_data.rating 		= 	1400;
					my_data.uid			=	"cg"+rand_uid;
					my_data.name 		=	 help_obj.get_random_name2(my_data.uid)+' (' + my_data.country_code +')';					
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';


					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {		
							//айди есть но данных нет, тогда заново их заносим
							my_data.rating 		= 	1400;
							my_data.name 		=	 help_obj.get_random_name2(my_data.uid)+' (' + my_data.country_code +')';					
							my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';
							
						} else {					
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;							
						}
						
						help_obj.process_results();

					})	

				}			
	
			},

			debug: function() {

				let uid = prompt('Отладка. Введите ID', 100);

				my_data.name = my_data.uid = "debug" + uid;
				my_data.pic_url = "https://sun9-73.userapi.com/impf/c622324/v622324558/3cb82/RDsdJ1yXscg.jpg?size=223x339&quality=96&sign=fa6f8247608c200161d482326aa4723c&type=album";

				help_obj.process_results();

			},

			local: function(repeat = 0) {

				//ищем в локальном хранилище
				let local_uid = localStorage.getItem('uid');

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");
					let rand_uid=Math.floor(Math.random() * 9999999);
					my_data.rating 		= 	1400;
					my_data.uid			=	"ls"+rand_uid;
					my_data.name 		=	 help_obj.get_random_name(my_data.uid);					
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';

					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {
													
							//если повтоно нету данных то выводим предупреждение
							if (repeat === 1)
								alert('Какая-то ошибка');
							
							//console.log(`Нашли данные в ЛХ но не нашли в ФБ, повторный локальный запрос...`);	

							
							//повторно запускаем локальный поиск						
							localStorage.clear();
							help_obj.local(1);	
								
							
						} else {						
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;
							help_obj.process_results();
						}

					})	

				}

			},

			unknown: function () {

				game_platform="unknown";
				alert("Неизвестная платформа! Кто Вы?")

				//загружаем из локального хранилища
				help_obj.local();
			},

			process_results: function() {


				//отображаем итоговые данные
				//console.log(`Итоговые данные:\nПлатформа:${game_platform}\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

				//обновляем базовые данные в файербейс так могло что-то поменяться
				firebase.database().ref("players/"+my_data.uid+"/name").set(my_data.name);
				firebase.database().ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);
				//firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);

				some_process.loup_anim=function() {};
					
				//вызываем коллбэк
				resolve("ok");
			}
		}

		help_obj.init();

	});	
	
}

function resize() {
	
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {

	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		h_state=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	firebase.database().ref(room_name+"/"+my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function vis_change() {

		if (document.hidden === true) {			
			if (pref.music_on === 1) gres.music.sound.pause();
			hidden_state_start = Date.now();			
		} else {			
			if (pref.music_on === 1) gres.music.sound.resume();			
		}
		
		set_state({hidden : document.hidden});
		
}

async function check_daily_reward (last_seen_ts) {
	
	
	//вычисляем номер дня последнего посещения
	let last_seen_day = new Date(last_seen_ts).getDate();		
	
	//считываем текущее время
	await firebase.database().ref("server_time").set(firebase.database.ServerValue.TIMESTAMP);

	//определяем текущий день
	let _cur_ts = await firebase.database().ref("server_time").once('value');
	let cur_ts = _cur_ts.val();
	let cur_day = new Date(cur_ts).getDate();
	
	//обновляем время последнего посещения
	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	if (cur_day !== last_seen_day)
	{		
		my_data.money++;
		firebase.database().ref("players/"+my_data.uid + "/money").set(my_data.money);	
		
		sound.play('daily_reward');

		objects.dr_title.text=['Ежедневный бонус!\n+1$','Daily reward!\n+1$'][LANG];
		await anim2.add(objects.dr_cont,{alpha:[0, 1]}, true, 1,'linear');
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		anim2.add(objects.dr_cont,{alpha:[1, 0]}, false, 1,'linear');
		
	}

}

async function init_game_env(l) {
		
	if (l===1) LANG = 1;
	
	await load_resources();
		
	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({			
			apiKey: "AIzaSyC9NMPdTEUR-YfxLBYiwEhcEDUoX4PzL5c",
			authDomain: "hex-battle.firebaseapp.com",
			databaseURL: "https://hex-battle-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "hex-battle",
			storageBucket: "hex-battle.appspot.com",
			messagingSenderId: "736374316797",
			appId: "1:736374316797:web:c02debce7a6278ee6c6894"
			
		});
	}

	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:true});
	let c = document.body.appendChild(app.view);
	c.style["boxShadow"] = "0 0 15px #000000";

	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }

	//загружаем данные об игроке
    auth().then((val)=> {

		//загружаем аватарку игрока
		return new Promise(function(resolve, reject) {
			let loader=new PIXI.Loader();
			loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
			loader.load(function(l,r) {	resolve(l)});
		});

	}).then((l)=> {

		//устанавливаем фотки в попап и другие карточки
		objects.id_avatar.texture=objects.my_avatar.texture=l.resources.my_avatar.texture;

		//устанавлием аватарки
		make_text(objects.id_name,my_data.name,150);
		make_text(objects.my_card_name,my_data.name,150);

		//загружаем остальные данные данные игрока (в данном случае - рейтинг)
		return firebase.database().ref("players/"+my_data.uid).once('value');

	}).then((snapshot)=>{

		let data=snapshot.val();
		
		data===null ?
			my_data.rating=1400 :
			my_data.rating = data.rating || 1400;

		data===null ?
			my_data.games = 0 :
			my_data.games = data.games || 0;
			
		data===null ?
			my_data.money = 0 :
			my_data.money = data.money || 0;
			
		data===null ?
			pref.b_conf = {24:[7,0,1],25:[7,1,1],26:[7,2,1],27:[7,3,1],28:[7,4,1],29:[7,5,1],30:[7,6,1],31:[7,7,1]} :
			pref.b_conf = data.b_conf || {24:[7,0,1],25:[7,1,1],26:[7,2,1],27:[7,3,1],28:[7,4,1],29:[7,5,1],30:[7,6,1],31:[7,7,1]};
					
		//время последнего посещения
		let last_seen_ts = data.tm || 1000;
		//check_daily_reward(last_seen_ts);
		
		//номер комнаты
		if (my_data.rating >= 1500)
			room_name= 'states2';			
		else
			room_name= 'states';			


		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

		//убираем лупу
		objects.id_loup.visible=false;

		//обновляем почтовый ящик
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		//подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

		
		//обновляем базовые данные в файербейс так могло что-то поменяться
		firebase.database().ref("players/"+my_data.uid+"/name").set(my_data.name);
		firebase.database().ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);				
		firebase.database().ref("players/"+my_data.uid+"/b_conf").set(pref.b_conf);	
		firebase.database().ref("players/"+my_data.uid+"/money").set(my_data.money);	
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);
		firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
		

		//устанавливаем мой статус в онлайн
		set_state({state : 'o'});

		//отключение от игры и удаление не нужного
		firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
		firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

		//это событие когда меняется видимость приложения
		document.addEventListener("visibilitychange", vis_change);

		//keep-alive сервис
		setInterval(function()	{keep_alive()}, 40000);

		activity_on=0;

		return new Promise((resolve, reject) => {setTimeout(resolve, 1000);});

	}).then(()=>{

		anim2.add(objects.id_cont,{y:[objects.id_cont.sy, -200]}, false, 0.5,'easeInBack');
	
	}).catch((err)=>{
		alert(err.stack + " " + err);
	});

	//контроль за присутсвием
	var connected_control = firebase.database().ref(".info/connected");
	connected_control.on("value", (snap) => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});

	//добавляем в данные об окружении первого и второго уровня
	for(let i=0;i<objects.hex_cells.length;i++) {
		
		let px0 = objects.hex_cells[i].x;
		let py0 = objects.hex_cells[i].y;
		
		for(let j=0;j<objects.hex_cells.length;j++) {
			let px1 = objects.hex_cells[j].x;
			let py1 = objects.hex_cells[j].y;
			
			let dx = px1 - px0;
			let dy = py1 - py0;
			
			let d = Math.sqrt(dx*dx+dy*dy)

			//это ближний круг
			if (Math.abs(d - 51.962) < 0.5)			
				objects.hex_cells[i].n0.push(j);
			
			//это дальний круг
			if (Math.abs(d - 103.924) < 0.5 || Math.abs(d - 90) < 0.5)			
				objects.hex_cells[i].n1.push(j);
		
		}
	}

	//показыаем основное меню
	main_menu.activate();

	//запускаем главный цикл
	main_loop();
	
}

async function load_resources() {

	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/


	let git_src="https://akukamil.github.io/hex_battle/"
	//git_src=""


	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"/fonts/MS_Comic_Sans/font.fnt");

	game_res.add('receive_move',git_src+'receive_move.mp3');
	game_res.add('note',git_src+'note.mp3');
	game_res.add('receive_sticker',git_src+'receive_sticker.mp3');
	game_res.add('message',git_src+'message.mp3');
	game_res.add('lose',git_src+'lose.mp3');
	game_res.add('win',git_src+'win.mp3');
	game_res.add('click',git_src+'click.mp3');
	game_res.add('close',git_src+'close.mp3');
	game_res.add('locked',git_src+'locked.mp3');
	game_res.add('clock',git_src+'clock.mp3');
	game_res.add('music',git_src+'music.mp3');
	game_res.add('hit',git_src+'hit.mp3');
	game_res.add('blow',git_src+'blow.mp3');
	game_res.add('chk_out',git_src+'chk_out.mp3');
	game_res.add('daily_reward',git_src+'daily_reward.mp3');
	game_res.add('send_chk',git_src+'send_chk.mp3');
	game_res.add('sel_chk_sound',git_src+'sel_chk.mp3');
	game_res.add('flip',git_src+'flip.wav');
	
    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/" + load_list[i].name + "." +  load_list[i].image_format);		

	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"stickers/"+i+".png");

	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	
	await new Promise((resolve, reject)=> game_res.load(resolve))

}

function main_loop() {




	game_tick+=0.016666666;
	anim2.process();
	
	//обрабатываем минипроцессы
	for (let key in some_process)
		some_process[key]();	
	
	requestAnimationFrame(main_loop);
}

