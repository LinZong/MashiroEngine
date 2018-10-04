function StoryMatrix() {
	if (typeof (arguments[0]) === 'number') {
		this._Array = [];
		this.build(arguments[0], arguments[1]);
	}
	else if(typeof(arguments[0])==='string'){
		this._Array = JSON.parse(arguments[0]);
	}
	else if(typeof(arguments[0])==='object'){
		this._Array = arguments[0];
	}		
	return this;
}
function CreateElement(element) {
	let type = typeof (element);
	if (type !== 'object') return element;
	return Object.assign({}, element);
}
StoryMatrix.prototype = {
	constuctor: StoryMatrix,
	build: function (Length, initElement) {
		let begin = this._Array.length;
		for (let i = begin; i < begin + Length; ++i) {
			this._Array.push([]);
			for (let j = 0; j < Length; ++j) {
				this._Array[i].push(CreateElement(initElement));
			}
		}
	},
	length: function () { return this._Array.length },
	append: function (addiLength, initElement) {
		let begin = this._Array.length;
		for (let i = begin; i < begin + addiLength; ++i) {
			this._Array.push([]);
			for (let j = 0; j < begin + addiLength; ++j) {
				this._Array[i].push(CreateElement(initElement));
			}
		}
		for (let i = 0; i < begin; ++i) {
			for (let j = begin; j < begin + addiLength; ++j) {
				this._Array[i].push(CreateElement(initElement));
			}
		}
	},
	place: function (x, y, element) {
		this._Array[x][y] = CreateElement(element);
	},
	touch: function (x, y) {
		return this._Array[x][y];
	},
	remove: function (removeLength) {
		if (removeLength > this._Array.length) throw new Error("Cannot remove the number of elements that larger than array length.");
		this._Array.splice(this._Array.length - removeLength, removeLength);
		let newLength = this._Array.length;
		for (let i = 0; i < newLength; ++i) {
			this._Array[i].splice(newLength, removeLength);
		}
	},
	Array: function () { return this._Array },
	stringify: function () { return JSON.stringify(this._Array); }
}

module.exports = { StoryMatrix };