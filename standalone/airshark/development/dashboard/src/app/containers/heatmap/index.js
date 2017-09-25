'use strict';

import angular from 'angular';

import './heatmap.scss';
import template from './heatmap.html';

class heatmapController {
  /* @ngInject */
  constructor($log, $element, D3, Airshark) {
    this._$log = $log;
    this._$element = $element;
    this.d3 = D3.d3;
    this.socket = Airshark.socket;
  }

  $onInit() {
    this.colours = [
      '#6363FF', '#6373FF', '#63A3FF', '#63E3FF', '#63FFFB', '#63FFCB',
      '#63FF9B', '#63FF6B', '#7BFF63', '#BBFF63', '#DBFF63', '#FBFF63',
      '#FFD363', '#FFB363', '#FF8363', '#FF7363', '#FF6364'];

    this.heatmapColourScale = this.d3.scaleLinear()
      .domain(this.d3.range(0, 1, 1.0 / (this.colours.length - 1)))
      .range(this.colours);

    this.maxCount = 40;
    const heatmapWrapper = this.d3.select(this._$element[0]).select('.heatmap-wrapper');
    this.heatmapWrapperHeight = Math.floor(heatmapWrapper.node().getBoundingClientRect().width / 2);

    this.initHeatmap();
    this.initLegend();

    this.socket.on('heatmap', this.onAirsharkMessage.bind(this));
  }

  $onDestroy() {
    this.socket.off('heatmap', this.onAirsharkMessage.bind(this));
  }

  heatMapColour(count) {
    return this.heatmapColourScale(count / this.maxCount);
  }

  initHeatmap() {
    const heatmapContainer = this.d3.select(this._$element[0]).select('.heatmap');
    const containerWidth = Math.floor(heatmapContainer.node().getBoundingClientRect().width);
    const containerHeight = this.heatmapWrapperHeight;

    const margin = {top: 50, right: 60, bottom: 20, left: 60};
    this.width = containerWidth - margin.left - margin.right;
    this.height = containerHeight - margin.top - margin.bottom;
    const freqMin = 2403.25;
    const freqMax = 2480.75;
    const powerMax = -10;
    const powerMin = -140;

    this.freqStep = 0.3125;
    this.powerStep = 0.5;
    this.columnCount = Math.floor((freqMax - freqMin) / this.freqStep);
    this.rowCount = Math.floor((powerMax - powerMin) / this.powerStep);

    this.svg = heatmapContainer.append('svg')
                                .attr('width', containerWidth)
                                .attr('height', containerHeight)
                              .append('g')
                                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.xScale = this.d3.scaleLinear()
      .range([0, this.width])
      .domain([freqMin, freqMax]);

    this.yScale = this.d3.scaleLinear()
      .range([0, this.height])
      .domain([powerMax, powerMin]);

    const xAxis = this.d3.axisTop(this.xScale)
      .tickValues([2407, 2412, 2417, 2422, 2427, 2432, 2437, 2442, 2447, 2452, 2457, 2462, 2467, 2472, 2477]);
    const yAxis = this.d3.axisLeft(this.yScale);

    this.svg.append('g')
      .attr('class', 'heatmap-axis')
      .attr('transform', 'translate(0,' + 0 + ')')
      .call(xAxis);

    this.svg.append('text')
      .attr('transform', 'translate(' + (this.width / 2) + ', -30)')
      .attr('class', 'heatmap-axis-label')
      .style('text-anchor', 'middle')
      .text('Frequency (MHz)');

    this.svg.append('g')
      .attr('class', 'heatmap-axis')
      .call(yAxis);

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 10)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em')
      .attr('class', 'heatmap-axis-label')
      .style('text-anchor', 'middle')
      .text('Signal Strength (dBm)');
  }

  initLegend() {
    const legendContainer = this.d3.select(this._$element[0]).select('.legend');
    const legendWidth = Math.floor(legendContainer.node().getBoundingClientRect().width);
    const legendHeight = this.heatmapWrapperHeight;
    const margin = {top: 50, right: 0, bottom: 20, left: 0};

    this.legendSvg = legendContainer.append('svg')
                                      .attr('width', legendWidth)
                                      .attr('height', legendHeight)
                                    .append('g')
                                      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const legend = [];
    for (let i = 0; i < this.colours.length; i++) {
      legend.push([i, this.colours[i]]);
    }

    const legendStep = legendHeight / this.colours.length;

    const legendScale = this.d3.scaleLinear()
      .domain([0, this.colours.length - 1])
      .range([legendHeight - margin.bottom - legendStep, 0]);

    const selection = this.legendSvg.selectAll('rect')
      .data(legend)
      .attr('x', 0)
      .attr('y', d => legendScale(d[0] + 1))
      .attr('width', legendStep)
      .attr('height', legendStep)
      .attr('fill', d => d[1]);

    selection.enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => legendScale(d[0] + 1))
      .attr('width', legendStep)
      .attr('height', legendStep)
      .attr('fill', d => d[1]);

    selection.exit().remove();

    this.legendSvg.append('text')
      .attr('y', 0)
      .attr('x', legendStep * 1.2)
      .attr('class', 'legend-label')
      .style('text-anchor', 'left')
      .text('> ' + this.maxCount);

    this.legendSvg.append('text')
      .attr('y', legendHeight - margin.top)
      .attr('x', legendStep * 1.2)
      .attr('class', 'legend-label')
      .style('text-anchor', 'left')
      .text('> 0');
  }

  updateHeatmap() {
    const cellWidth = this.width / this.columnCount;
    const cellHeight = this.height / this.rowCount;

    const selection = this.svg.selectAll('rect')
      .data(this.heatmapD3Data)
      .attr('x', d => this.xScale(d[0] - (this.freqStep / 2.0)))
      .attr('y', d => this.yScale(d[1] + (this.powerStep / 2.0)))
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('fill', d => this.heatMapColour(d[2]));

    selection.enter()
      .append('rect')
      .attr('x', d => this.xScale(d[0] - (this.freqStep / 2.0)))
      .attr('y', d => this.yScale(d[1] + (this.powerStep / 2.0)))
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('fill', d => this.heatMapColour(d[2]));

    selection.exit().remove();
  }

  processHeatmapData(heatmapData) {
    this.heatmapD3Data = [];
    for (const subcarrierFreq in heatmapData) {
      for (const power in heatmapData[subcarrierFreq]) {
        const count = heatmapData[subcarrierFreq][power];
        this.heatmapD3Data.push([parseFloat(subcarrierFreq), parseFloat(power), count]);
      }
    }

    this.updateHeatmap();
  }

  onAirsharkMessage(msg) {
    const heatmapData = angular.fromJson(msg);
    this.processHeatmapData(heatmapData);
  }
}

const heatmapComponent = {
  restrict: 'E',
  template,
  controller: heatmapController
};

const heatmap = angular.module('airsharkDemo.heatmap', [
])
.component('heatmap', heatmapComponent);

export default heatmap.name;
