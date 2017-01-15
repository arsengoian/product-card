
// Script parameters
BKG = true;
BKG_COLOR = "#fffffff";
BKG_GRADIENT_PERCENT = 70;
BKG_MAX_OPACITY = 0.8;

PERSPECTIVE = true;
PERSPECTIVE_SIZE = 1000;
MAX_ROTATE_X = 6;
MAX_ROTATE_Y = 10;



var Parallax = {

	items: [],

	init: function() {
		this.items = document.getElementsByClassName("parallax-container");
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].onmouseover = this.items[i].onmousemove = function(event) {
				Parallax.update(this, event);
			}
			this.items[i].onmouseout = function(event) {
				Parallax.untrack(this);
			}

			this.items[i].classList.add('io');

			if (BKG) {
				let bkg = document.createElement('div');
				bkg.classList.add('parallax-bkg');
				this.items[i].parallaxBkg = this.items[i].appendChild(bkg);
			}
			if (PERSPECTIVE) {
				this.items[i].parentNode.style.perspective = PERSPECTIVE_SIZE + "px";
			}
		}
	},


	update: function(item, event) {

		var x = event.clientX - item.getBoundingClientRect().left;
		var y = event.clientY - item.getBoundingClientRect().top;
		var center = {x: item.clientWidth/2, y: item.clientHeight/2}

		angle = this.calculateAngle(center, x, y);
		strength = this.calculateStrength(center, x, y, angle)

		if (item.classList.contains('io') && !item.awaiting) {
			item.awaiting = true;
			setTimeout(function() {
				item.classList.remove('io');
				item.awaiting = false;
			}, 300);
		}

		if (BKG) {
			this.bkg(item.parallaxBkg.style, center, angle, strength);
		}
		if (PERSPECTIVE) {
			this.transform(item.style, center, angle, strength);
		}

	},


	untrack: function(item) {
		item.classList.add('io');
		if (BKG) {
			item.parallaxBkg.style.opacity = '0';
		}
		if (PERSPECTIVE) {
			item.style.transform = "none";
		}
	},


	bkg: function(div, center, angle, strength) {
		div.backgroundImage = "linear-gradient(" + -angle + "deg, white, transparent " + BKG_GRADIENT_PERCENT + "%)";
		div.opacity = BKG_MAX_OPACITY * Math.sqrt(strength);
	},

	transform: function(div, center, angle, strength) {
		piangle = angle * Math.PI / 180;
		rotateX = MAX_ROTATE_X * strength * Math.cos(piangle);
		rotateY = -MAX_ROTATE_Y * strength * Math.sin(piangle);
		div.transform = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";	
	},

	calculateAngle(center, x, y) {

		// Rotating axi to correspond to tangent definition
		let dx = y - center.y;
		let dy = x - center.x;

		// Calculating angle
		let tan = dy/dx;
		let arctan = Math.atan(tan)/Math.PI;
		if (dx < 0)
			arctan = arctan + 1;
		return arctan * 180;

	},

	calculateStrength: function(center, x, y, angle) {

		// Calculating the distance from the center to the border on secant line
		let foundationAngle = Math.atan(center.y/center.x)/Math.PI * 180;
		let transposedAngle = (angle + 90) % 180;
		let triangleAngle = Math.abs((angle + 90) % 180 - 90);
		if (transposedAngle < foundationAngle || transposedAngle > 180 - foundationAngle) {
			var baseDistance = center.x;
		} else {
			var baseDistance = center.y;
			triangleAngle = 90 - triangleAngle;
		}
		let sin = Math.sin(triangleAngle * Math.PI/180);
		let centerDiagonal = baseDistance/sin;

		// Calculating distance from the point to the center
		let distance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));

		return distance/centerDiagonal;
	}

}

