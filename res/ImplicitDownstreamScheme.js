/**
 * Created by mihail.nechaev on 23/10/14.
 */
function ImplicitDownstreamScheme(_velocity, _kappa, _dx, _dt, _data) {
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

    //AbstractImplicitScheme
    function nextTimeLayerInternal() {
        var coefficients = getSystemOfCoefficients();
        if (coefficients == null || coefficients.length != nodeNumber || coefficients[0].length != 4) {
            alert("getSystemOfCoefficients return incorrect array");
        }
        return solveSystem(coefficients);
    }

    function solveSystem(m) {
        var x = [nodeNumber];
        var alpha = [nodeNumber];
        var beta = [nodeNumber];
        alpha[0] = -m[0][2] / m[0][1];
        beta[0] = m[0][3] / m[0][1];
        var i;
        for (i = 1; i < nodeNumber; i++) {
            alpha[i] = -m[i][2] / (m[i][0] * alpha[i - 1] + m[i][1]);
            beta[i] = (m[i][3] - m[i][0] * beta[i - 1]) / (m[i][0] * alpha[i - 1] + m[i][1]);
        }
        x[nodeNumber - 1] = (m[nodeNumber - 1][3] - m[nodeNumber - 1][0] * beta[nodeNumber - 2]) / (m[nodeNumber - 1][0] * alpha[nodeNumber - 2] + m[nodeNumber - 1][1]);
        for (i = nodeNumber - 2; i >= 0; i--) {
            x[i] = alpha[i] * x[i + 1] + beta[i];
        }
        return x;
    }

    //ImplicitDownstreamScheme
    function getSystemOfCoefficients() {
        var result = [nodeNumber];
        for (var i = 0; i < nodeNumber; i++) {
            result[i] = [-r, 1 - s + 2 * r, s - r, previousTimeLayer[i]];
        }
        result[0][3] += r * leftPoint;
        result[nodeNumber - 1][3] -= (s - r) * rightPoint;
        return result;
    }

    return {
        nextTimeLayer : nextTimeLayer
    }
}
