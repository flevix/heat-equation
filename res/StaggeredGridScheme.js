/**
 * Created by mihail.nechaev on 23/10/14.
 */
function StaggeredGridScheme(_velocity, _kappa, _dx, _dt, _data, _second) {
    var
        leftPoint = _data[0],
        rightPoint = _data[_data.length - 1],
        nodeNumber = _data.length,
        s = _velocity * _dt / _dx,
        r = _kappa * _dt / (_dx * _dx),
        previousTimeLayer = _data,
        currTimeLayerNumber = 0,
        beforePrevTimeLayer = _second;

    function nextTimeLayer() {
        currTimeLayerNumber++;
        previousTimeLayer = nextTimeLayerInternal();
        return previousTimeLayer;
    }

    //StaggeredGridScheme
    function nextTimeLayerInternal() {
        var nextLayer = [nodeNumber];
        nextLayer[0] = leftPoint;
        nextLayer[nodeNumber - 1] = rightPoint;
        for (var i = 1; i < nodeNumber - 1; i++) {
            nextLayer[i] =
                (beforePrevTimeLayer[i]
                    - s * (previousTimeLayer[i + 1] - previousTimeLayer[i - 1])
                    + 2 * r * (previousTimeLayer[i + 1] + previousTimeLayer[i - 1] -  beforePrevTimeLayer[i])) /
                (1 + 2 * r);
        }
        beforePrevTimeLayer = previousTimeLayer;
        previousTimeLayer = nextLayer;
        return nextLayer;
    }

    return {
        nextTimeLayer : nextTimeLayer
    }
}