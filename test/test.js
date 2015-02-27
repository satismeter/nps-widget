var assert = require('chai').assert;
var happen = require('happen');
var Vue = require('vue');
var insertCss = require('insert-css');
var $ = require('jquery');
var browser = require('bowser').browser;
var autoprefixer = require('autoprefixer-core');
var Promise = require('rsvp').Promise;

var View = require('../src/index');

function wait(done) {
    return new Promise(function(resolve) {
        Vue.nextTick(function() {
            if (done) {
                done();
            }
            resolve();
        });
    });
}

describe('view', function() {
    before(function () {
        if (!browser.msie || browser.version >= 10) {
            Vue.config.debug = true;
        }
        insertCss(autoprefixer.process('* {transition: none !important;}').css);
    });

    var view, $el;
    beforeEach(function(done) {
        view = new View({visible: true, test: true});
        $el = $(view.el);
        wait(done);
    });
    afterEach(function() {
        view.destroy();
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
            view.poweredBy = false;
            wait(function() {
                assert.notMatch($(view.el).text(), /Powered by/);
                done();
            });
        });
    });

    describe('rating screen', function() {
        it('should not display submit', function() {
            assert.lengthOf($el.find('.nps-Feedback-submit'), 0);
        });
        it('should move to next step', function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);

            wait(function() {
                assert.equal(view.state, 'feedback');
                done();
            });
        });
        it('should not display feedback form', function() {
            assert.lengthOf($el.find('.nps-Feedback-textContainer'), 0);
        });
        it('should close window', function(done) {
            happen.click($el.find('.nps-Dialog-close')[0]);
            wait(function() {
                assert.isFalse(view.visible);
                done();
            });
        });
        it('should set correct rating', function() {
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
    });

    describe('feedback screen', function() {
        beforeEach(function(done) {
            happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);
            wait(done);
        });
        it('should display button', function() {
            assert.equal($el.find('.nps-Feedback-submit').length, 1);
        });
        it('should show feedback form', function() {
            assert.lengthOf($el.find('.nps-Feedback-text'), 1);
        });
        it('should close window', function(done) {
            happen.click($el.find('.nps-Dialog-close')[0]);
            wait(function() {
                assert.isFalse(view.visible);
                done();
            });
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
            var called = false;
            view.on('submit', function() {
                called = true;
            });

            happen.click($el.find('.nps-Feedback-submit')[0]);
            wait(function() {
                assert.isTrue(called);
                done();
            });
        });
    });

    describe('written feedback', function() {
        beforeEach(function(done) {
            view.rating = 10;
            view.state = 'feedback';
            wait(done);
        });

        it('should submit empty feedback', function(done) {
            var called = false;
            view.on('submit', function() {
                called = true;
            });
            wait(function() {
                happen.click($el.find('.nps-Feedback-submit')[0]);
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

        it('should handle empty reason', function(done) {
            view.translation = {REASONS: ['a', 'b']};
            wait(function() {
                wait(function() {
                    assert.equal(view.reason, '');
                    done();
                });
            });
        });

        it('should set reason', function(done) {
            view.translation = {REASONS: ['a', 'b']};
            wait(function() {
                happen.click($el.find('.nps-Feedback-reason input')[0]);
                wait(function() {
                    assert.equal(view.reason, 'a');
                    done();
                });
            });
        });

        if (!browser.msie || browser.version >= 10) {
            it('should not set placeholder by default', function() {
                var placeholder = $el.find('.nps-Feedback-text').attr('placeholder');
                assert.isUndefined(placeholder);
            });
        }

        it('should go to thanks screen', function(done) {
            $el.find('.nps-Feedback-text').val('Rubish');
            happen.keyup($el.find('.nps-Feedback-text')[0]);
            wait(function() {
                happen.click($el.find('.nps-Feedback-submit')[0]);
                wait(function() {
                    assert.match($el.text(),
                        /Thank you for your feedback/);
                    done();
                });
            });
        });
        it('should close window on submit', function(done) {
            happen.click($el.find('.nps-Feedback-submit')[0]);
            setTimeout(function() {
                assert.isFalse(view.visible);
                done();
            }, 800 /* wait */ + 500 /* animation */ + 100 /* buffer */);
        });
    });

    describe('thanks screen', function() {
        beforeEach(function(done) {
            view.state = 'thanks';
            wait(done);
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
        it('should translate to cs', function(done) {
            view.language = 'cs';
            wait(function() {
                assert.match($(view.el).text(), /Doporučili byste/);
                done();
            });
        });
        it('should handle cz alias', function(done) {
            view.language = 'cz';
            wait(function() {
                assert.match($(view.el).text(), /Doporučili byste/);
                done();
            });
        });
        it('should handle invalid language', function(done) {
            view.language = 'xx';
            wait(function() {
                assert.match($(view.el).text(), /How likely/);
                done();
            });
        });
    });

    describe('positioning', function() {
        it('should use tr as default', function() {
            assert.equal(view.position, 'cr');
        });
    });

    describe('custom translation', function() {
        if (!browser.msie || browser.version >= 10) {
            it('should show custom placeholder', function(done) {
                view.translation = {
                    DETAILS: 'What the fuck?'
                };
                view.rating = 10;
                view.state = 'feedback';
                wait(function() {
                    assert.equal($el.find('.nps-Feedback-text').attr('placeholder'), 'What the fuck?');
                    done();
                });
            });
        }

        it('should show custom message', function(done) {
            view.translation = {
                HOW_LIKELY: 'Doporucil bys vole?'
            };
            wait(function() {
                assert.match($el.text(), /Doporucil bys vole?/);
                done();
            });
        });

        it('should handle null', function(done) {
            view.translation = null;
            view.rating = 10;
            wait(function() {
                assert.match($(view.el).text(), /How likely/);
                done();
            });
        });

        it('should handle undefined', function(done) {
            view.translation = undefined;
            view.rating = 10;
            wait(function() {
                assert.match($(view.el).text(), /How likely/);
                done();
            });
        });

        if (!browser.msie || browser.version >= 10) {
            describe('conditional followup', function() {
                beforeEach(function() {
                    view.translation = {
                        THANKS_IMPROVE_DETRACTOR: 'Proc?',
                        THANKS_IMPROVE_PASSIVE: 'Co muzeme zlepsit?',
                        THANKS_IMPROVE_PROMOTER: 'Co muzeme zhorsit?'
                    };
                    view.state = 'feedback';
                });
                it('should show detractor followup', function(done) {
                    view.rating = 0;
                    wait(function() {
                        assert.equal($el.find('.nps-Title').text(), 'Proc?');
                        done();
                    });
                });
                it('should show passive followup', function(done) {
                    view.rating = 7;
                    wait(function() {
                        assert.equal($el.find('.nps-Title').text(), 'Co muzeme zlepsit?');
                        done();
                    });
                });
                it('should show promoter followup', function(done) {
                    view.rating = 10;
                    wait(function() {
                        assert.equal($el.find('.nps-Title').text(), 'Co muzeme zhorsit?');
                        done();
                    });
                });
            });
        }
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
            wait().then(function () {
                console.log('wait done!');
                assert.include($el.text(), '<script>alert("aaa")</script>');
            }).then(done).catch(done);
        });
    });

    describe('walkthrough', function() {
        ['panel', 'dialog', 'bar'].forEach(function(skin) {
            it('should work for skin ' + skin, function(done) {
                view.skin = skin;
                view.translation = {
                    REASONS: ['a', 'b']
                };
                wait().then(function() {
                    happen.click($el.find('.nps-Scale .nps-Scale-value')[5]);
                    return wait();
                }).then(function() {
                    $el.find('.nps-Feedback-text').val('Rubish');
                    happen.once($el.find('.nps-Feedback-text')[0], {type: 'input'});
                    return wait();
                }).then(function() {
                    happen.click($el.find('.nps-Feedback-reason input')[0]);
                    return wait();
                }).then(function() {
                    happen.click($el.find('.nps-Feedback-submit')[0]);
                    return wait();
                }).then(function() {
                    assert.equal(view.rating, 5);
                    assert.equal(view.feedback, 'Rubish');
                    assert.equal(view.reason, 'a');
                }).then(done).catch(done);
            });
        });
    });

});
