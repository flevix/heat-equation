/**
 * Created by mikhail.nechaev on 22/11/14.
 */

Scheme = function(s, r, currLayer) {
    this._N = currLayer.length;
    this._S = s;
    this._R = r;
    this._currLayer = currLayer;
    this._leftPoint = currLayer[0];
    this._rightPoint = currLayer[currLayer.length - 1];
};

Scheme.prototype._nextLayer = function(){};
Scheme.prototype.nextLayer = function() {
    this._currLayer = this._nextLayer();
    return this._currLayer;
};
//-----------------------
ExplicitScheme = function(s, r, currLayer) {
    Scheme.call(this, s, r, currLayer);
};
ExplicitScheme.prototype = Object.create(Scheme.prototype);
ExplicitScheme.prototype.constructor = ExplicitScheme;

ExplicitScheme.prototype._getNewNodeValue = function(){};
ExplicitScheme.prototype._nextLayer = function() {
    var nextLayer = [],
        i;
    nextLayer.push(this._leftPoint);
    for (i = 1; i < this._N - 1; i++) {
        nextLayer.push(this._getNewNodeValue(i))
    }
    nextLayer.push(this._rightPoint);
    return nextLayer;
};
//==========
ImplicitScheme = function(s, r, currLayer) {
    Scheme.call(this, s, r, currLayer);
};
ImplicitScheme.prototype = Object.create(Scheme.prototype);
ImplicitScheme.prototype.constructor = ImplicitScheme;

ImplicitScheme.prototype._getSystem = function(){};
ImplicitScheme.prototype._solveSystem = function(/* coefficients */ c) {
    var x = [], /* alpha */ a = [], /* beta */ b = [], i;
    a.push(-c[0][2] / c[0][1]);
    b.push(c[0][3] / c[0][1]);
    for (i = 1; i < this._N; i++) {
        a.push(-c[i][2] / (c[i][1] + c[i][0] * a[i - 1]));
        b.push((c[i][3] - c[i][0] * b[i - 1]) / (c[i][0] * a[i - 1] + c[i][1]));
    }
    x[this._N - 1] = (c[this._N - 1][3] - c[this._N - 1][0] * b[this._N - 2]) /
                     (c[this._N - 1][1] + c[this._N - 1][0] * a[this._N - 2]);
    for (i = this._N - 2; i >= 0; i--) {
        x[i] = b[i] + a[i] * x[i + 1];
    }
    return x;
};
ImplicitScheme.prototype._nextLayer = function() {
    return this._solveSystem(this._getSystem());
};
//==========
StaggeredGridScheme = function(s, r, currLayer) {
    Scheme.call(this, s, r, currLayer);
    this.prevLayer = (new ExplicitUpstreamScheme(s, r, currLayer)).nextLayer();
};
StaggeredGridScheme.prototype = Object.create(Scheme.prototype);
StaggeredGridScheme.prototype.constructor = StaggeredGridScheme;

StaggeredGridScheme.prototype._nextLayer = function() {
    var nextLayer = [], i;
    nextLayer.push(this._leftPoint);
    for (i = 1; i < this._N - 1; i++) {
        nextLayer[i] = (
                        this.prevLayer[i] -
                        this._S * (this._currLayer[i + 1] - this._currLayer[i - 1]) +
                        2 * this._R * (this._currLayer[i + 1] + this._currLayer[i - 1] - this.prevLayer[i])
                        ) / (1 + 2 * this._R);
    }
    nextLayer.push(this._rightPoint);
    this.prevLayer = this._currLayer;
    return nextLayer;
};
//-----------------------
ExplicitDownstreamScheme = function(s, r, currLayer) {
    ExplicitScheme.call(this, s, r, currLayer);
};
ExplicitDownstreamScheme.prototype = Object.create(ExplicitScheme.prototype);
ExplicitDownstreamScheme.prototype.constructor = ExplicitDownstreamScheme;

ExplicitDownstreamScheme.prototype._getNewNodeValue = function(i) {
    return  this._currLayer[i - 1] * this._R +
            this._currLayer[i]     * (1 - 2 * this._R + this._S) +
            this._currLayer[i + 1] * (this._R - this._S);
};
//----------
ExplicitUpstreamScheme = function(s, r, currLayer) {
    ExplicitScheme.call(this, s, r, currLayer);
};
ExplicitUpstreamScheme.prototype = Object.create(ExplicitScheme.prototype);
ExplicitUpstreamScheme.prototype.constructor = ExplicitUpstreamScheme;

ExplicitUpstreamScheme.prototype._getNewNodeValue = function(i) {
    return  this._currLayer[i - 1] * (this._R + this._S) +
            this._currLayer[i]     * (1 - 2 * this._R - this._S) +
            this._currLayer[i + 1] * this._R;
};
//==========
ImplicitDownstreamScheme = function(s, r, currLayer) {
    ImplicitScheme.call(this, s, r, currLayer);
};
ImplicitDownstreamScheme.prototype = Object.create(ImplicitScheme.prototype);
ImplicitDownstreamScheme.prototype.constructor = ImplicitDownstreamScheme;

ImplicitDownstreamScheme.prototype._getSystem = function() {
    var /* coefficients */ c = [], i;
    for (i = 0; i < this._N; i++) {
        c.push([
            -this._R,
            1 - this._S + 2 * this._R,
            this._S - this._R,
            this._currLayer[i]
        ]);
    }
    c[0][3] += this._R * this._leftPoint;
    c[this._N - 1][3] -= (this._S - this._R) * this._rightPoint;
    return c;
};
//----------
ImplicitUpstreamScheme = function(s, r, currLayer) {
    ImplicitScheme.call(this, s, r, currLayer);
};
ImplicitUpstreamScheme.prototype = Object.create(ImplicitScheme.prototype);
ImplicitUpstreamScheme.prototype.constructor = ImplicitUpstreamScheme;

ImplicitUpstreamScheme.prototype._getSystem = function() {
    var /* coefficients */ c = [], i;
    for (i = 0; i < this._N; i++) {
        c.push([
            -(this._S + this._R),
            1 + this._S + 2 * this._R,
            -this._R,
            this._currLayer[i]
        ]);
    }
    c[0][3] += (this._S + this._R) * this._leftPoint;
    c[this._N - 1][3] += this._R * this._rightPoint;
    return c;
};
