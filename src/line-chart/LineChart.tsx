var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React from "react";
import { Animated, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Circle, G, Path, Polygon, Polyline, Rect, Svg ,Image} from "react-native-svg";
import AbstractChart from "../AbstractChart";
import { LegendItem } from "./LegendItem";
var AnimatedCircle = Animated.createAnimatedComponent(Circle);
var LineChart = /** @class */ (function (_super) {
    __extends(LineChart, _super);
    function LineChart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = React.createRef();
        _this.state = {
            scrollableDotHorizontalOffset: new Animated.Value(0)
        };
        _this.getColor = function (dataset, opacity) {
            return (dataset.color || _this.props.chartConfig.color)(opacity);
        };
        _this.getStrokeWidth = function (dataset) {
            return dataset.strokeWidth || _this.props.chartConfig.strokeWidth || 3;
        };
        _this.getDatas = function (data) {
            return data.reduce(function (acc, item) { return (item.data ? __spreadArrays(acc, item.data) : acc); }, []);
        };
        _this.getPropsForDots = function (x, i) {
            var _a = _this.props, getDotProps = _a.getDotProps, chartConfig = _a.chartConfig;
            if (typeof getDotProps === "function") {
                return getDotProps(x, i);
            }
            var _b = chartConfig.propsForDots, propsForDots = _b === void 0 ? {} : _b;
            return __assign({ r: "4" }, propsForDots);
        };
        _this.renderDots = function (_a) {
            var data = _a.data, width = _a.width, height = _a.height, paddingTop = _a.paddingTop, paddingRight = _a.paddingRight, onDataPointClick = _a.onDataPointClick;
            var output = [];
            var datas = _this.getDatas(data);
            var baseHeight = _this.calcBaseHeight(datas, height);
            var _b = _this.props, getDotColor = _b.getDotColor, _c = _b.hidePointsAtIndex, hidePointsAtIndex = _c === void 0 ? [] : _c, _d = _b.renderDotContent, renderDotContent = _d === void 0 ? function () {
                return null;
            } : _d;
            var xMax = _this.getXMaxValues(data);
            data.forEach(function (dataset) {
                if (dataset.withDots == false)
                    return;
                dataset.data.forEach(function (x, i) {
                    if (hidePointsAtIndex.includes(i)) {
                        return;
                    }
                    var cx = paddingRight + (i * (width - paddingRight)) / xMax;
                    var cy = ((baseHeight - _this.calcHeight(x, datas, height)) / 4) * 3 +
                        paddingTop;
                    var onPress = function () {
                        if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
                            return;
                        }
                        onDataPointClick({
                            index: i,
                            value: x,
                            dataset: dataset,
                            x: cx,
                            y: cy,
                            getColor: function (opacity) { return _this.getColor(dataset, opacity); }
                        });
                    };
                     output.push(<Image x={cx - 15} y={cy - 15} href={{uri: 'https://somday.s3.ap-northeast-2.amazonaws.com/somday/ic_point.png'}} width={30} height={30} onPress={onPress}/>, renderDotContent({ x: cx, y: cy, index: i, indexData: x }));
                });
            });
            return output;
        };
        _this.renderScrollableDot = function (_a) {
            var data = _a.data, width = _a.width, height = _a.height, paddingTop = _a.paddingTop, paddingRight = _a.paddingRight, scrollableDotHorizontalOffset = _a.scrollableDotHorizontalOffset, scrollableDotFill = _a.scrollableDotFill, scrollableDotStrokeColor = _a.scrollableDotStrokeColor, scrollableDotStrokeWidth = _a.scrollableDotStrokeWidth, scrollableDotRadius = _a.scrollableDotRadius, scrollableInfoViewStyle = _a.scrollableInfoViewStyle, scrollableInfoTextStyle = _a.scrollableInfoTextStyle, _b = _a.scrollableInfoTextDecorator, scrollableInfoTextDecorator = _b === void 0 ? function (x) { return "" + x; } : _b, scrollableInfoSize = _a.scrollableInfoSize, scrollableInfoOffset = _a.scrollableInfoOffset;
            var output = [];
            var datas = _this.getDatas(data);
            var baseHeight = _this.calcBaseHeight(datas, height);
            var vl = [];
            var perData = width / data[0].data.length;
            for (var index = 0; index < data[0].data.length; index++) {
                vl.push(index * perData);
            }
            var lastIndex;
            scrollableDotHorizontalOffset.addListener(function (value) {
                var index = value.value / perData;
                if (!lastIndex) {
                    lastIndex = index;
                }
                var abs = Math.floor(index);
                var percent = index - abs;
                abs = data[0].data.length - abs - 1;
                if (index >= data[0].data.length - 1) {
                    _this.label.current.setNativeProps({
                        text: scrollableInfoTextDecorator(Math.floor(data[0].data[0]))
                    });
                }
                else {
                    if (index > lastIndex) {
                        // to right
                        var base = data[0].data[abs];
                        var prev = data[0].data[abs - 1];
                        if (prev > base) {
                            var rest = prev - base;
                            _this.label.current.setNativeProps({
                                text: scrollableInfoTextDecorator(Math.floor(base + percent * rest))
                            });
                        }
                        else {
                            var rest = base - prev;
                            _this.label.current.setNativeProps({
                                text: scrollableInfoTextDecorator(Math.floor(base - percent * rest))
                            });
                        }
                    }
                    else {
                        // to left
                        var base = data[0].data[abs - 1];
                        var next = data[0].data[abs];
                        percent = 1 - percent;
                        if (next > base) {
                            var rest = next - base;
                            _this.label.current.setNativeProps({
                                text: scrollableInfoTextDecorator(Math.floor(base + percent * rest))
                            });
                        }
                        else {
                            var rest = base - next;
                            _this.label.current.setNativeProps({
                                text: scrollableInfoTextDecorator(Math.floor(base - percent * rest))
                            });
                        }
                    }
                }
                lastIndex = index;
            });
            data.forEach(function (dataset) {
                if (dataset.withScrollableDot == false)
                    return;
                var perData = width / dataset.data.length;
                var values = [];
                var yValues = [];
                var xValues = [];
                var yValuesLabel = [];
                var xValuesLabel = [];
                for (var index = 0; index < dataset.data.length; index++) {
                    values.push(index * perData);
                    var yval = ((baseHeight -
                        _this.calcHeight(dataset.data[dataset.data.length - index - 1], datas, height)) /
                        4) *
                        3 +
                        paddingTop;
                    yValues.push(yval);
                    var xval = paddingRight +
                        ((dataset.data.length - index - 1) * (width - paddingRight)) /
                            dataset.data.length;
                    xValues.push(xval);
                    yValuesLabel.push(yval - (scrollableInfoSize.height + scrollableInfoOffset));
                    xValuesLabel.push(xval - scrollableInfoSize.width / 2);
                }
                var translateX = scrollableDotHorizontalOffset.interpolate({
                    inputRange: values,
                    outputRange: xValues,
                    extrapolate: "clamp"
                });
                var translateY = scrollableDotHorizontalOffset.interpolate({
                    inputRange: values,
                    outputRange: yValues,
                    extrapolate: "clamp"
                });
                var labelTranslateX = scrollableDotHorizontalOffset.interpolate({
                    inputRange: values,
                    outputRange: xValuesLabel,
                    extrapolate: "clamp"
                });
                var labelTranslateY = scrollableDotHorizontalOffset.interpolate({
                    inputRange: values,
                    outputRange: yValuesLabel,
                    extrapolate: "clamp"
                });
                output.push([
                    <Animated.View key={Math.random()} style={[
                        scrollableInfoViewStyle,
                        {
                            transform: [
                                { translateX: labelTranslateX },
                                { translateY: labelTranslateY }
                            ],
                            width: scrollableInfoSize.width,
                            height: scrollableInfoSize.height
                        }
                    ]}>
          <TextInput onLayout={function () {
                        _this.label.current.setNativeProps({
                            text: scrollableInfoTextDecorator(Math.floor(data[0].data[data[0].data.length - 1]))
                        });
                    }} style={scrollableInfoTextStyle} ref={_this.label}/>
        </Animated.View>,
                    <AnimatedCircle key={Math.random()} cx={translateX} cy={translateY} r={scrollableDotRadius} stroke={scrollableDotStrokeColor} strokeWidth={scrollableDotStrokeWidth} fill={scrollableDotFill}/>
                ]);
            });
            return output;
        };
        _this.renderShadow = function (_a) {
            var width = _a.width, height = _a.height, paddingRight = _a.paddingRight, paddingTop = _a.paddingTop, data = _a.data, useColorFromDataset = _a.useColorFromDataset;
            if (_this.props.bezier) {
                return _this.renderBezierShadow({
                    width: width,
                    height: height,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    data: data,
                    useColorFromDataset: useColorFromDataset
                });
            }
            var datas = _this.getDatas(data);
            var baseHeight = _this.calcBaseHeight(datas, height);
            return data.map(function (dataset, index) {
                return (<Polygon key={index} points={dataset.data
                    .map(function (d, i) {
                    var x = paddingRight +
                        (i * (width - paddingRight)) / dataset.data.length;
                    var y = ((baseHeight - _this.calcHeight(d, datas, height)) / 4) * 3 +
                        paddingTop;
                    return x + "," + y;
                })
                    .join(" ") +
                    (" " + (paddingRight +
                        ((width - paddingRight) / dataset.data.length) *
                            (dataset.data.length - 1)) + "," + ((height / 4) * 3 +
                        paddingTop) + " " + paddingRight + "," + ((height / 4) * 3 + paddingTop))} fill={"url(#fillShadowGradientFrom" + (useColorFromDataset ? "_" + index : "") + ")"} strokeWidth={0}/>);
            });
        };
        _this.renderLine = function (_a) {
            var width = _a.width, height = _a.height, paddingRight = _a.paddingRight, paddingTop = _a.paddingTop, data = _a.data, linejoinType = _a.linejoinType;
            if (_this.props.bezier) {
                return _this.renderBezierLine({
                    data: data,
                    width: width,
                    height: height,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop
                });
            }
            var output = [];
            var datas = _this.getDatas(data);
            var baseHeight = _this.calcBaseHeight(datas, height);
            var xMax = _this.getXMaxValues(data);
            var lastPoint;
            data.forEach(function (dataset, index) {
                var points = dataset.data.map(function (d, i) {
                    if (d === null)
                        return lastPoint;
                    var x = (i * (width - paddingRight)) / xMax + paddingRight;
                    var y = ((baseHeight - _this.calcHeight(d, datas, height)) / 4) * 3 +
                        paddingTop;
                    lastPoint = x + "," + y;
                    return x + "," + y;
                });
                output.push(<Polyline key={index} strokeLinejoin={linejoinType} points={points.join(" ")} fill="none" stroke={_this.getColor(dataset, 0.2)} strokeWidth={_this.getStrokeWidth(dataset)} strokeDasharray={dataset.strokeDashArray} strokeDashoffset={dataset.strokeDashOffset}/>);
            });
            return output;
        };
        _this.getXMaxValues = function (data) {
            return data.reduce(function (acc, cur) {
                return cur.data.length > acc ? cur.data.length : acc;
            }, 0);
        };
        _this.getBezierLinePoints = function (dataset, _a) {
            var width = _a.width, height = _a.height, paddingRight = _a.paddingRight, paddingTop = _a.paddingTop, data = _a.data;
            if (dataset.data.length === 0) {
                return "M0,0";
            }
            var datas = _this.getDatas(data);
            var xMax = _this.getXMaxValues(data);
            var x = function (i) {
                return Math.floor(paddingRight + (i * (width - paddingRight)) / xMax);
            };
            var baseHeight = _this.calcBaseHeight(datas, height);
            var y = function (i) {
                var yHeight = _this.calcHeight(dataset.data[i], datas, height);
                return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
            };
            return ["M" + x(0) + "," + y(0)]
                .concat(dataset.data.slice(0, -1).map(function (_, i) {
                var x_mid = (x(i) + x(i + 1)) / 2;
                var y_mid = (y(i) + y(i + 1)) / 2;
                var cp_x1 = (x_mid + x(i)) / 2;
                var cp_x2 = (x_mid + x(i + 1)) / 2;
                return ("Q " + cp_x1 + ", " + y(i) + ", " + x_mid + ", " + y_mid +
                    (" Q " + cp_x2 + ", " + y(i + 1) + ", " + x(i + 1) + ", " + y(i + 1)));
            }))
                .join(" ");
        };
        _this.renderBezierLine = function (_a) {
            var data = _a.data, width = _a.width, height = _a.height, paddingRight = _a.paddingRight, paddingTop = _a.paddingTop;
            return data.map(function (dataset, index) {
                var result = _this.getBezierLinePoints(dataset, {
                    width: width,
                    height: height,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    data: data
                });
                return (<Path key={index} d={result} fill="none" stroke={_this.getColor(dataset, 0.2)} strokeWidth={_this.getStrokeWidth(dataset)} strokeDasharray={dataset.strokeDashArray} strokeDashoffset={dataset.strokeDashOffset}/>);
            });
        };
        _this.renderBezierShadow = function (_a) {
            var width = _a.width, height = _a.height, paddingRight = _a.paddingRight, paddingTop = _a.paddingTop, data = _a.data, useColorFromDataset = _a.useColorFromDataset;
            return data.map(function (dataset, index) {
                var xMax = _this.getXMaxValues(data);
                var d = _this.getBezierLinePoints(dataset, {
                    width: width,
                    height: height,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    data: data
                }) +
                    (" L" + (paddingRight +
                        ((width - paddingRight) / xMax) *
                            (dataset.data.length - 1)) + "," + ((height / 4) * 3 +
                        paddingTop) + " L" + paddingRight + "," + ((height / 4) * 3 + paddingTop) + " Z");
                return (<Path key={index} d={d} fill={"url(#fillShadowGradientFrom" + (useColorFromDataset ? "_" + index : "") + ")"} strokeWidth={0}/>);
            });
        };
        _this.renderLegend = function (width, legendOffset) {
            var _a = _this.props.data, legend = _a.legend, datasets = _a.datasets;
            var baseLegendItemX = width / (legend.length + 1);
            return legend.map(function (legendItem, i) { return (<G key={Math.random()}>
        <LegendItem index={i} iconColor={_this.getColor(datasets[i], 0.9)} baseLegendItemX={baseLegendItemX} legendText={legendItem} labelProps={__assign({}, _this.getPropsForLabels())} legendOffset={legendOffset}/>
      </G>); });
        };
        return _this;
    }
    LineChart.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, data = _a.data, _b = _a.withScrollableDot, withScrollableDot = _b === void 0 ? false : _b, _c = _a.withShadow, withShadow = _c === void 0 ? true : _c, _d = _a.withDots, withDots = _d === void 0 ? true : _d, _e = _a.withInnerLines, withInnerLines = _e === void 0 ? true : _e, _f = _a.withOuterLines, withOuterLines = _f === void 0 ? true : _f, _g = _a.withHorizontalLines, withHorizontalLines = _g === void 0 ? true : _g, _h = _a.withVerticalLines, withVerticalLines = _h === void 0 ? true : _h, _j = _a.withHorizontalLabels, withHorizontalLabels = _j === void 0 ? true : _j, _k = _a.withVerticalLabels, withVerticalLabels = _k === void 0 ? true : _k, _l = _a.style, style = _l === void 0 ? {} : _l, decorator = _a.decorator, onDataPointClick = _a.onDataPointClick, _m = _a.verticalLabelRotation, verticalLabelRotation = _m === void 0 ? 0 : _m, _o = _a.horizontalLabelRotation, horizontalLabelRotation = _o === void 0 ? 0 : _o, _p = _a.formatYLabel, formatYLabel = _p === void 0 ? function (yLabel) { return yLabel; } : _p, _q = _a.formatXLabel, formatXLabel = _q === void 0 ? function (xLabel) { return xLabel; } : _q, segments = _a.segments, _r = _a.transparent, transparent = _r === void 0 ? false : _r, chartConfig = _a.chartConfig;
        var scrollableDotHorizontalOffset = this.state.scrollableDotHorizontalOffset;
        var _s = data.labels, labels = _s === void 0 ? [] : _s;
        var _t = style.borderRadius, borderRadius = _t === void 0 ? 0 : _t, _u = style.paddingTop, paddingTop = _u === void 0 ? 16 : _u, _v = style.paddingRight, paddingRight = _v === void 0 ? 64 : _v, _w = style.margin, margin = _w === void 0 ? 0 : _w, _x = style.marginRight, marginRight = _x === void 0 ? 0 : _x, _y = style.paddingBottom, paddingBottom = _y === void 0 ? 0 : _y;
        var config = {
            width: width,
            height: height,
            verticalLabelRotation: verticalLabelRotation,
            horizontalLabelRotation: horizontalLabelRotation
        };
        var datas = this.getDatas(data.datasets);
        var count = Math.min.apply(Math, datas) === Math.max.apply(Math, datas) ? 1 : 4;
        if (segments) {
            count = segments;
        }
        var legendOffset = this.props.data.legend ? height * 0.15 : 0;
        return (<View style={style}>
        <Svg height={height + paddingBottom + legendOffset} width={width - margin * 2 - marginRight}>
          <Rect width="100%" height={height + legendOffset} rx={borderRadius} ry={borderRadius} fill="url(#backgroundGradient)" fillOpacity={transparent ? 0 : 1}/>
          {this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)}
          <G x="0" y={legendOffset}>
            {this.renderDefs(__assign(__assign(__assign({}, config), chartConfig), { data: data.datasets }))}
            <G>
              {withHorizontalLines &&
            (withInnerLines
                ? this.renderHorizontalLines(__assign(__assign({}, config), { count: count, paddingTop: paddingTop,
                    paddingRight: paddingRight }))
                : withOuterLines
                    ? this.renderHorizontalLine(__assign(__assign({}, config), { paddingTop: paddingTop,
                        paddingRight: paddingRight }))
                    : null)}
            </G>
            <G>
              {withHorizontalLabels &&
            this.renderHorizontalLabels(__assign(__assign({}, config), { count: count, data: datas, paddingTop: paddingTop, paddingRight: paddingRight, formatYLabel: formatYLabel, decimalPlaces: chartConfig.decimalPlaces }))}
            </G>
            <G>
              {withVerticalLines &&
            (withInnerLines
                ? this.renderVerticalLines(__assign(__assign({}, config), { data: data.datasets[0].data, paddingTop: paddingTop, paddingRight: paddingRight }))
                : withOuterLines
                    ? this.renderVerticalLine(__assign(__assign({}, config), { paddingTop: paddingTop, paddingRight: paddingRight }))
                    : null)}
            </G>
            <G>
              {withVerticalLabels &&
            this.renderVerticalLabels(__assign(__assign({}, config), { labels: labels, paddingTop: paddingTop, paddingRight: paddingRight, formatXLabel: formatXLabel }))}
            </G>
            <G>
              {this.renderLine(__assign(__assign(__assign({}, config), chartConfig), { paddingRight: paddingRight, paddingTop: paddingTop, data: data.datasets }))}
            </G>
            <G>
              {withShadow &&
            this.renderShadow(__assign(__assign({}, config), { data: data.datasets, paddingRight: paddingRight, paddingTop: paddingTop, useColorFromDataset: chartConfig.useShadowColorFromDataset }))}
            </G>
            <G>
              {withDots &&
            this.renderDots(__assign(__assign({}, config), { data: data.datasets, paddingTop: paddingTop, paddingRight: paddingRight, onDataPointClick: onDataPointClick }))}
            </G>
            <G>
              {withScrollableDot &&
            this.renderScrollableDot(__assign(__assign(__assign({}, config), chartConfig), { data: data.datasets, paddingTop: paddingTop, paddingRight: paddingRight, onDataPointClick: onDataPointClick,
                scrollableDotHorizontalOffset: scrollableDotHorizontalOffset }))}
            </G>
            <G>
              {decorator &&
            decorator(__assign(__assign({}, config), { data: data.datasets, paddingTop: paddingTop,
                paddingRight: paddingRight }))}
            </G>
          </G>
        </Svg>
        {withScrollableDot && (<ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={{ width: width * 2 }} showsHorizontalScrollIndicator={false} scrollEventThrottle={16} onScroll={Animated.event([
            {
                nativeEvent: {
                    contentOffset: { x: scrollableDotHorizontalOffset }
                }
            }
        ], { useNativeDriver: false })} horizontal bounces={false}/>)}
      </View>);
    };
    return LineChart;
}(AbstractChart));
export default LineChart;
