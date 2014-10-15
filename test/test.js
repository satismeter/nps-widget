var assert = require('chai').assert;
var dom = require('dom');
var happen = require('happen');
var Vue = require('vue');

// Function.bind polyfill for phantomjs testing
require('./bind');

var View = require('../index');

describe('view', function() {
    var view, $el;
    beforeEach(function(done) {
        view = new View();
        view.$appendTo(document.body);
        $el = dom(view.$el);
        view.show();
        Vue.nextTick(function() {done();});
    });
    afterEach(function() {
        view.$remove();
    });

    describe('widget initialization', function() {
        it('should render widget into root element', function() {
            assert.equal(dom(document.body).find('.nps-Survey').length, 1);
        });
        it('should be visible', function() {
            assert.isTrue(dom(view.$el).hasClass('nps-is-visible'));
        });
        it('should show first screen', function() {
            assert.match(dom(view.$el).text(), /How likely are you to recommend/);
        });
        it('should display powered by message', function() {
            assert.match(dom(view.$el).text(), /Powered by/);
        });
    });

    describe('not powered by', function() {
        it('should not display powered by message', function(done) {
            var view = new View({data: {poweredBy: false}});
            view.$appendTo(document.body);
            view.show();
            Vue.nextTick(function() {
                assert.notMatch(dom(view.$el).text(), /Powered by/);
                view.$remove();
                done();
            });
        });
    });

    describe('rating screen', function() {
        it('should display disabled submit', function() {
            assert.isNotNull($el.find('.nps-submit').attr('disabled'));
        });
        it('should highlight rating', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            Vue.nextTick(function() {
                assert.isTrue($el.find('.nps-Scale .nps-Scale-value').at(5)
                    .hasClass('nps-is-selected'));
                done();
            });
        });
        it('should enable button', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            Vue.nextTick(function() {
                assert.isNull($el.find('.nps-submit').attr('disabled'));
                done();
            });
        });
        it('should go to feedback screen', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            Vue.nextTick(function() {
                happen.click($el.find('.nps-submit')[0]);
                Vue.nextTick(function() {
                    assert.match($el.text(),
                        /Thanks for your feedback\. What could we do to improve\?/);
                    done();
                });
            });
        });
        it('should close window', function(done) {
            happen.click($el.find('.nps-Survey-close')[0]);
            Vue.nextTick(function() {
                assert.isFalse($el.hasClass('nps-visible'));
                done();
            });
        });
        it('should submit correct rating', function() {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);
            assert.equal(view.rating, 5);
        });
        it('should emit dismiss event', function(done) {
            var called = false;
            view.$on('dismiss', function() {
                called = true;
            });
            happen.click($el.find('.nps-Survey-close')[0]);
            Vue.nextTick(function() {
                assert.isTrue(called);
                done();
            });
        });
        it('should emit submit event', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            var called = false;
            view.$on('submit', function() {
                called = true;
            });

            Vue.nextTick(function() {
                happen.click($el.find('.nps-submit')[0]);
                Vue.nextTick(function() {
                    assert.isTrue(called);
                    done();
                });
            });
        });
    });

    describe('feedback screen', function() {
        beforeEach(function(done) {
            view.state = 'feedback';
            Vue.nextTick(function() {
                done();
            });
        });
        it('should display enabled submit', function() {
            assert.isNull($el.find('.nps-submit').attr('disabled'));
        });
        it('should submit empty feedback', function(done) {
            var called = false;
            view.$on('submit', function() {
                called = true;
            });
            Vue.nextTick(function() {
                happen.click($el.find('.nps-submit')[0]);
                Vue.nextTick(function() {
                    assert.isTrue(called);
                    assert.equal(view.feedback, '');
                    done();
                });
            });
        });
        it('should close window', function(done) {
            happen.click($el.find('.nps-Survey-close')[0]);
            Vue.nextTick(function() {
                assert.isFalse(dom(view.$el).hasClass('nps-visible'));
                done();
            });
        });
        it('should set feedback', function() {
            $el.find('.nps-text').value('Rubish');
            happen.once($el.find('.nps-text')[0], {type: 'input'});
            assert.equal(view.feedback, 'Rubish');
        });
        it('should go to thanks screen', function(done) {
            $el.find('.nps-text').value('Rubish');
            happen.keyup($el.find('.nps-text')[0]);
            Vue.nextTick(function() {
                happen.click($el.find('.nps-submit')[0]);
                Vue.nextTick(function() {
                    assert.match(dom(view.$el).text(),
                        /Thank you for your feedback/);
                    done();
                });
            });
        });
        it('should not emit dismiss event', function() {
            var called = false;
            view.$on('dismiss', function() {
                called = true;
            });
            happen.click($el.find('.nps-Survey-close')[0]);
            assert.isFalse(called);
        });
        it('should emit submit event', function(done) {
            $el.find('.nps-text').value('Rubish');
            happen.keyup($el.find('.nps-text')[0]);
            var called = false;
            view.$on('submit', function() {
                called = true;
            });
            Vue.nextTick(function() {
                happen.click($el.find('.nps-submit')[0]);
                Vue.nextTick(function() {
                    assert.isTrue(called);
                    done();
                });
            });
        });
    });

    describe('thanks screen', function() {
        beforeEach(function(done) {
            view.state = 'thanks';
            Vue.nextTick(done);
        });
        it('should display thanks message', function() {
            assert.match($el.text(), /Thank you/);
        });
        it('should close window', function(done) {
            happen.click($el.find('.nps-close')[0]);
            Vue.nextTick(function() {
                assert.isFalse(dom(view.$el).hasClass('nps-visible'));
                done();
            });
        });
        it('should not emit dismiss event', function() {
            var called = false;
            view.$on('dismiss', function() {
                called = true;
            });
            happen.click($el.find('.nps-Survey-close')[0]);
            assert.isFalse(called);
        });
    });

    describe('filled screen', function() {
        beforeEach(function(done) {
            view.state = 'filled';
            Vue.nextTick(done);
        });
        it('should display filled message', function() {
            assert.match($el.text(), /filled the survey/);
        });
    });

    describe('translations', function() {
        it('should use en as default', function() {
            assert.match(dom(view.$el).text(), /How likely/);
        });
        before(function(done) {
            view.language = 'cz';
            Vue.nextTick(done);
        });
        it('should translate to cz', function() {
            var view = new View({data: {language: 'cz'}});
            view.$appendTo(document.body);
            view.show();

            assert.match(dom(view.$el).text(), /Doporučili byste/);

            view.$remove();
        });
    });
});
