var assert = require('chai').assert;
var happen = require('happen');
var Vue = require('vue');
var insertCss = require('insert-css');
var $ = require('jquery');
var browser = require('bowser').browser;

var View = require('../src/index');

function wait(done) {
    setTimeout(function() {
        done();
    }, 100);
}
function waitAnimation(done) {
    setTimeout(function() {
        done();
    }, 100);
}

describe('view', function() {
    before(function () {
        insertCss('* { transition-duration: 1ms !important; }');
    });

    var view, $el;
    beforeEach(function(done) {
        view = new View({visible: true});
        $el = $(view.el);
        wait(done);
    });
    afterEach(function() {
        view.remove();
    });

    describe('widget initialization', function() {
        it('should render widget into root element', function() {
            assert.equal($(document.body).find('.nps-Survey').length, 1);
        });
        it('should be visible', function() {
            assert.isTrue(view.visible);
        });
        it('should show first screen', function() {
            assert.match($el.text(), /How likely are you to recommend/);
        });
        it('should display powered by message', function() {
            assert.match($el.text(), /Powered by/);
        });
    });

    describe('not powered by', function() {
        it('should not display powered by message', function(done) {
            var view = new View({visible: true, poweredBy: false});
            wait(function() {
                assert.notMatch($(view.el).text(), /Powered by/);
                view.destroy();
                done();
            });
        });
    });

    describe('feedback screen', function() {
        it('should not display submit', function() {
            assert.equal($el.find('.nps-Survey-submit').length, 0);
        });
        it('should highlight rating', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            wait(function() {
                assert.isTrue($($el.find('.nps-Scale .nps-Scale-value')[5])
                    .hasClass('nps-is-selected'));
                done();
            });
        });
        it('should display button', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            wait(function() {
                assert.equal($el.find('.nps-Survey-submit').length, 1);
                done();
            });
        });
        it('should not display feedback form', function() {
            assert.equal($el.find('.nps-Feedback-textContainer').css('display'), 'none');
        });
        it('should show feedback form', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            wait(function() {
                assert.equal($el.find('.nps-Feedback-textContainer').css('display'), 'block');
                done();
            });
        });
        it('should close window', function(done) {
            happen.click($el.find('.nps-Dialog-close')[0]);
            wait(function() {
                assert.isFalse(view.visible);
                done();
            });
        });
        it('should submit correct rating', function() {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);
            assert.equal(view.rating, 5);
        });
        it('should emit dismiss event', function(done) {
            var called = false;
            view.on('dismiss', function() {
                called = true;
            });
            happen.click($el.find('.nps-Dialog-close')[0]);
            wait(function() {
                assert.isTrue(called);
                done();
            });
        });
        it('should emit submit event', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            var called = false;
            view.on('submit', function() {
                called = true;
            });

            wait(function() {
                happen.click($el.find('.nps-Survey-submit')[0]);
                wait(function() {
                    assert.isTrue(called);
                    done();
                });
            });
        });
    });

    describe('written feedback', function() {
        beforeEach(function(done) {
            view.rating = 10;
            wait(done);
        });

        it('should submit empty feedback', function(done) {
            var called = false;
            view.on('submit', function() {
                called = true;
            });
            wait(function() {
                happen.click($el.find('.nps-Survey-submit')[0]);
                wait(function() {
                    assert.isTrue(called);
                    assert.equal(view.feedback, '');
                    done();
                });
            });
        });

        it('should set feedback', function(done) {
            $el.find('.nps-Feedback-text').val('Rubish');
            happen.once($el.find('.nps-Feedback-text')[0], {type: 'input'});
            wait(function() {
                assert.equal(view.feedback, 'Rubish');
                done();
            });
        });

        if (!browser.msie || browser.version >= 10) {
            it('should set placeholder', function() {
                var placeholder = $el.find('.nps-Feedback-text').attr('placeholder');
                assert.equal(placeholder, 'What could we do to improve?');
            });
        }

        it('should go to thanks screen', function(done) {
            $el.find('.nps-Feedback-text').val('Rubish');
            happen.keyup($el.find('.nps-Feedback-text')[0]);
            wait(function() {
                happen.click($el.find('.nps-Survey-submit')[0]);
                waitAnimation(function() {
                    assert.match($el.text(),
                        /Thank you for your feedback/);
                    done();
                });
            });
        });
        it('should close window on submit', function(done) {
            happen.click($el.find('.nps-Survey-submit')[0]);
            setTimeout(function() {
                assert.isFalse(view.visible);
                done();
            }, 800 /* wait */ + 500 /* animation */ + 100 /* buffer */);
        });
    });

    describe('thanks screen', function() {
        beforeEach(function(done) {
            view.state = 'thanks';
            waitAnimation(done);
        });
        it('should display thanks message', function() {
            assert.match($el.text(), /Thank you/);
        });
    });

    describe('filled screen', function() {
        beforeEach(function(done) {
            view.state = 'filled';
            wait(done);
        });
        it('should display filled message', function() {
            assert.match($el.text(), /filled the survey/);
        });
    });

    describe('translations', function() {
        it('should use en as default', function() {
            assert.match($(view.el).text(), /How likely/);
        });
        it('should translate to cs', function() {
            var view = new View({visible: true, language: 'cs'});

            assert.match($(view.el).text(), /Doporučili byste/);

            view.destroy();
        });
        it('should handle cz alias', function() {
            var view = new View({visible: true, language: 'cz'});

            assert.match($(view.el).text(), /Doporučili byste/);

            view.destroy();
        });
    });

    describe('positioning', function() {
        it('should use tr as default', function() {
            assert.equal(view.position, 'cr');
        });
        // it('should show on top left', function(done) {
        //     view.position = 'tl';
        //     view.distance = 10;
        //     waitAnimation(function() {
        //         assert.equal(getComputedStyle(view.el).top, '10px');
        //         assert.equal(getComputedStyle(view.el).left, '0px');
        //         done();
        //     });
        // });
        // it('should show on bottom right', function(done) {
        //     view.position = 'br';
        //     view.distance = 20;
        //     setTimeout(function () {
        //         assert.equal(getComputedStyle(view.el).bottom, '20px');
        //         assert.equal(getComputedStyle(view.el).right, '0px');
        //         done();
        //     }, 500);
        //     // 500ms - phantom ignores the transition duration
        // });
    });

    describe('custom translation', function() {
        beforeEach(function(done) {
            view.translation = {
                HOW_LIKELY: 'Doporucil bys vole?',
                IMPROVE: 'What the fuck?'
            };
            view.rating = 10;
            wait(done);
        });
        if (!browser.msie || browser.version >= 10) {
            it('should show custom placeholder', function() {
                assert.equal($el.find('.nps-Feedback-text').attr('placeholder'), 'What the fuck?');
            });
        }
        it('should show custom message', function() {
            assert.match($el.text(), /Doporucil bys vole?/);
        });
        it('should handle null', function(done) {
            view.translation = null;
            wait(function () {
                assert.notMatch($el.text(), /Doporucil bys vole?/);
                assert.match($(view.el).text(), /How likely/);
                done();
            });
        });
        it('should handle undefined', function(done) {
            view.translation = undefined;
            wait(function () {
                assert.notMatch($el.text(), /Doporucil bys vole?/);
                assert.match($(view.el).text(), /How likely/);
                done();
            });
        });
    });

    describe('service name', function() {
        it('should show default service name', function() {
            assert.include($el.text(), 'How likely are you to recommend us to your friends and colleagues?');
            assert.include($el.html(), 'How likely are you to recommend us to your friends and colleagues?');
        });
        it('should show custom service name', function(done) {
            view.serviceName = 'Google';
            wait(function () {
                assert.include($el.text(), 'How likely are you to recommend Google to your friends and colleagues?');
                assert.include($el.html(), 'How likely are you to recommend <b>Google</b> to your friends and colleagues?');
                done();
            });
        });
        it('should handle empty space', function(done) {
            view.serviceName = '';
            wait(function () {
                assert.include($el.text(), 'How likely are you to recommend us to your friends and colleagues?');
                done();
            });
        });
        it('should trim to empty space', function(done) {
            view.serviceName = ' ';
            wait(function () {
                assert.include($el.text(), 'How likely are you to recommend us to your friends and colleagues?');
                done();
            });
        });
        it('should escape service name', function(done) {
            view.serviceName = '<script>alert("aaa")</script>';
            wait(function () {
                assert.include($el.text(), '<script>alert("aaa")</script>');
                done();
            });
        });
    });


});
