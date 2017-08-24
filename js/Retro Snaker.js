function RetroSnaker(maxX, maxY) {
	this.body = []; //蛇身
	this.food = []; //食物
	maxX = isNaN(+maxX) ? 0 : parseInt(+maxX);
	maxY = isNaN(+maxY) ? 0 : parseInt(+maxY);
	var direction = 0; //下一步方向 0123->上右下左

	function Point(x, y) {
		this.x = isNaN(+x) ? 0 : parseInt(+x);
		this.y = isNaN(+y) ? 0 : parseInt(+y);
		var thisdata = {};
		this.data = function(name, value) {
			if(name === undefined) {
				return thisdata;
			} else {
				if(value) {
					thisdata[name] = value;
				} else {
					return thisdata[name];
				};
			};
		};
		this.removeData = function(name) {
			if(name !== undefined) {
				delete thisdata[name];
			} else {
				for(var name in thisdata) {
					delete thisdata[name];
				};
			};
		};
		this.identical = function(point) {
			return(this.x === point.x && this.y === point.y)
		};
	};

	this.Point = Point;
	var eventFn = new Point();
	this.on = function(name, fn) { //添加事件
		if(eventFn.data(name) instanceof Array) {
			eventFn.data(name).push(fn);
		} else {
			eventFn.data(name, [fn]);
		};
	};
	this.off = function(name, fn) { //移除事件
		if(name) {
			if(fn) {
				eventFn.data(name, eventFn.data(name).filter(function(v, i) {
					return v !== fn;
				}));
				if(eventFn.data(name).length == 0) {
					eventFn.removeData(name);
				};
			} else {
				eventFn.removeData(name);
			};
		} else {
			eventFn.removeData();
		};
	};
	this.trigger = function(name, event) { //触发事件
		if(eventFn.data(name) instanceof Array) {
			eventFn.data(name).forEach(function(v, i) {
				v(event);
			});
		};
	};
	this.addBody = function() { //增加蛇身长度
		var bodyTail = this.body.length ? this.body[this.body.length - 1] : {
			x: maxX / 2,
			y: maxY / 2,
		};
		this.body.push(new Point(bodyTail.x, bodyTail.y));
		this.trigger('update');
	};
	this.addfood = function(point) { //增加一个食物
		if(point === undefined) {
			do {
				point = new Point(Math.random() * maxX, Math.random() * maxY);
			}
			while (
				this.body.some(function(v, i) {
					return point.identical(v);
				}) || this.food.some(function(v, i) {
					return point.identical(v);
				})
			);
		};

		if(point instanceof Point) {
			if(point.x < 0 || point.x > maxX || point.y < 0 || point.y > maxY) {
				console.log('新增食物超出边界');
			} else if(this.body.some(function(v, i) {
					return point.identical(v);
				}) || this.food.some(function(v, i) {
					return point.identical(v);
				})) {
				console.log('新增食物与蛇身或其他食物重合');
			} else {
				this.food.push(point);
				console.log('添加成功');
				this.trigger('update');
			};
		};

	};
	this.go = function() {
		if(this.body.length) {
			var bodyTail = this.body[this.body.length - 1];
			var bodyHead = this.body[0];
			var point = new Point(bodyHead.x, bodyHead.y);
			switch(direction) {
				case 0:
					point.y -= 1;
					break;
				case 1:
					point.x += 1;
					break;
				case 2:
					point.y += 1;
					break;
				case 3:
					point.x -= 1;
					break;
				default:
					break;
			};
			var foodindex;
			if(this.body.some(function(v, i) {
					return point.identical(v);
				})) {
				this.trigger('collision.body');
			} else if(point.x < 0 || point.x > maxX || point.y < 0 || point.y > maxY) {
				this.trigger('collision.boundary');
			} else if((foodindex = this.food.findIndex(function(v, i) {
					return point.identical(v);
				})) !== -1) {
				this.body.unshift(point);
				this.body.pop();
				this.trigger('collision.food', foodindex);
			} else {
				this.body.unshift(point);
				this.body.pop();
			};
			this.trigger('update');
		};
	};
	this.addBody();

	this.reset = function() {
		this.body = [];
		this.food = [];
		this.direction = 0;
		this.addBody();
		this.trigger('reset');
		this.trigger('update');
	};

	this.setdirection = function(n) {
		var n1 = n > 2 ? 0 : n + 1;
		var n2 = n < 1 ? 3 : n - 1;
		if(direction === n1 || direction === n2) {
			direction = n;
		};
	};
};