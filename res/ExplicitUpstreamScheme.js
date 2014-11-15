/**
 * Created by mihail.nechaev on 23/10/14.
 */
function ExplicitUpstreamScheme(_velocity, _kappa, _dx, _dt, _data) {
    var
        leftPoint = _data[0],
        rightPoint = _data[_data.length - 1],
        nodeNumber = _data.length,
        s = _velocity * _dt / _dx,
        r = _kappa * _dt / (_dx * _dx),
        previousTimeLayer = _data,
        currTimeLayerNumber = 0;

    function nextTimeLayer() {
        currTimeLayerNumber++;
        previousTimeLayer = nextTimeLayerInternal();
        return previousTimeLayer;
    }

    //AbstractExplicitScheme
    function nextTimeLayerInternal() {
        var nextLayer = [nodeNumber];
        for (var i = 0; i < nodeNumber; i++) {
            if (i == 0) {
                nextLayer[i] = leftPoint;
            } else if (i == nodeNumber - 1) {
                nextLayer[i] = rightPoint;
            } else {
                nextLayer[i] = calculateInnerNodeValue(i);
            }
        }
        return nextLayer;
    }

    //ExplicitUpstreamScheme
    function calculateInnerNodeValue(i){
        return (r + s) * previousTimeLayer[i - 1] + (1 - 2 * r - s) * previousTimeLayer[i] + r * previousTimeLayer[i + 1];
    }

    return {
        nextTimeLayer : nextTimeLayer
    }
}