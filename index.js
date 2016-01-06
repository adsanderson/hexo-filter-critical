'use strict';

var critical = hexo.config.critical || {};

var priority = critical.priority || 1000;

hexo.extend.filter.register('after_generate', require('./lib/critical'), priority);
