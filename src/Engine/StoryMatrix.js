
function StoryMatrix(Length, initElement) {
	this._Array = [];
	if (Length) {
		this.build(Length, initElement);
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
	place:function(x,y,element){
		this._Array[x][y] = CreateElement(element);
	},
	touch:function(x,y){
		return this._Array[x][y];
	},
	remove: function (removeLength) {
		if(removeLength>this._Array.length) throw new Error("Cannot remove the number of elements that larger than array length.");
		this._Array.splice(this._Array.length - removeLength, removeLength);
		let newLength = this._Array.length;
		for (let i = 0; i < newLength; ++i) {
			this._Array[i].splice(newLength,removeLength);
		}
	},
	Array: function () { return this._Array }
}


module.exports = { StoryMatrix };