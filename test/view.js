var assert = require('chai').assert;
var dom = require('dom');
var happen = require('happen');
var frame = require('raf-queue');

var View = require('nps-widget');

describe('view', function() {
    var view;
    beforeEach(function(done) {
        view = new View();
        view.appendTo(document.body);
        view.show();
        frame.defer(function() {done();});
    });
    afterEach(function() {
        view.remove();
    });

    describe('widget initialization', function() {
        it('should render widget into root element', function() {
            assert.equal(dom(document.body).find('.nps').length, 1);
        });
        it('should be visible', function() {
            assert.isTrue(dom(view.el).hasClass('nps-visible'));
        });
        it('should show first screen', function() {
            assert.isTrue(dom(view.el).hasClass('nps-rating-visible'));
        });
        it('should display powered by message', function() {
            assert.isTrue(dom(view.el).hasClass('nps-is-powered-by'));
            assert.match(dom(view.el).text(), /Powered by/);
        });
    });

    describe('not powered by', function() {
        it('should not display powered by message', function(done) {
            var view = new View({poweredBy: false});
            view.appendTo(document.body);
            view.show();
            frame.defer(function() {
                assert.isFalse(dom(view.el).hasClass('nps-is-powered-by'));
                view.remove();
                done();
            });
        });
    });

    describe('rating screen', function() {
        var $rating;
        beforeEach(function() {
            $rating = dom(view.el).find('.nps-rating');
        });

        it('should display disabled submit', function() {
            assert.isNotNull($rating.find('.nps-submit').attr('disabled'));
        });
        it('should highlight rating', function(done) {
            happen.click($rating.find('.nps-scale .nps-value[data-value="5"]')[0]);

            frame.defer(function() {
                assert.isTrue($rating.find('.nps-scale .nps-value[data-value="5"]')
                    .hasClass('nps-selected'));
                done();
            });
        });
        it('should enable button', function(done) {
            happen.click($rating.find('.nps-scale .nps-value[data-value="5"]')[0]);

            frame.defer(function() {
                assert.isNull($rating.find('.nps-submit').attr('disabled'));
                done();
            });
        });
        it('should go to feedback screen', function(done) {
            happen.click($rating.find('.nps-scale .nps-value[data-value="5"]')[0]);

            frame.defer(function() {
                happen.click($rating.find('.nps-submit')[0]);
                frame.defer(function() {
                    assert.isTrue(dom(view.el).hasClass('nps-feedback-visible'));
                    done();
                });
            });
        });
        it('should close window', function(done) {
            happen.click($rating.find('.nps-dismiss')[0]);
            frame.defer(function() {
                assert.isFalse(dom(view.el).hasClass('nps-visible'));
                done();
            });
        });
        it('should submit correct rating', function() {
            happen.click($rating.find('.nps-scale .nps-value[data-value="5"]')[0]);
            assert.equal(view.get('rating'), 5);
        });
        it('should emit dismiss event', function(done) {
            var called = false;
            view.on('dismiss', function() {
                called = true;
            });
            happen.click($rating.find('.nps-dismiss')[0]);
            frame.defer(function() {
                assert.isTrue(called);
                done();
            });
        });
        it('should emit submit event', function(done) {
            happen.click($rating.find('.nps-scale .nps-value[data-value="5"]')[0]);

            var called = false;
            view.on('submit', function() {
                called = true;
            });

            frame.defer(function() {
                happen.click($rating.find('.nps-submit')[0]);
                frame.defer(function() {
                    assert.isTrue(called);
                    done();
                });
            });
        });
    });

    describe('feedback screen', function() {
        var $feedback;
        beforeEach(function(done) {
            view.set('state', View.FEEDBACK_STATE);
            frame.defer(function() {
                $feedback = dom(view.el).find('.nps-feedback');
                done();
            });
        });
        it('should display disabled submit', function() {
            assert.isNotNull($feedback.find('.nps-submit').attr('disabled'));
        });
        it('should enable submit', function(done) {
            $feedback.find('.nps-text').value('Rubish');
            happen.keyup($feedback.find('.nps-text')[0]);
            frame.defer(function() {
                assert.isNull($feedback.find('.nps-submit').attr('disabled'));
                done();
            });
        });
        it('should close window', function(done) {
            happen.click($feedback.find('.nps-close')[0]);
            frame.defer(function() {
                assert.isFalse(dom(view.el).hasClass('nps-visible'));
               done();
           });
        });
        it('should set feedback', function() {
            $feedback.find('.nps-text').value('Rubish');
            happen.keyup($feedback.find('.nps-text')[0]);
            assert.equal(view.get('feedback'), 'Rubish');
        });
        it('should go to thanks screen', function(done) {
            $feedback.find('.nps-text').value('Rubish');
            happen.keyup($feedback.find('.nps-text')[0]);
            frame.defer(function() {
                happen.click($feedback.find('.nps-submit')[0]);
                frame.defer(function() {
                    assert.isTrue(dom(view.el).hasClass('nps-thanks-visible'));
                    done();
                });
            });
        });
        it('should not emit dismiss event', function() {
            var called = false;
            view.on('dismiss', function() {
                called = true;
            });
            happen.click($feedback.find('.nps-close')[0]);
            assert.isFalse(called);
        });
        it('should emit submit event', function(done) {
            $feedback.find('.nps-text').value('Rubish');
            happen.keyup($feedback.find('.nps-text')[0]);
            var called = false;
            view.on('submit', function() {
                called = true;
            });
            frame.defer(function() {
                happen.click($feedback.find('.nps-submit')[0]);
                frame.defer(function() {
                    assert.isTrue(called);
                    done();
                });
            });
        });
    });

    describe('thanks screen', function() {
        var $thanks;
        beforeEach(function() {
            view.set('state', view.THANKS_STATE);
            $thanks = dom(view.el).find('.nps-thanks');
        });
        it('should display thanks message', function() {
            assert.match($thanks.text(), /Thank you/);
        });
        it('should close window', function(done) {
            happen.click($thanks.find('.nps-close')[0]);
            frame.defer(function() {
                assert.isFalse(dom(view.el).hasClass('nps-visible'));
                done();
            });
        });
        it('should not emit dismiss event', function() {
            var called = false;
            view.on('dismiss', function() {
                called = true;
            });
            happen.click($thanks.find('.nps-close')[0]);
            assert.isFalse(called);
        });
    });

describe('filled screen', function() {
    var $filled;
    beforeEach(function() {
        view.set('state', view.FILLED_STATE);
        $filled = dom(view.el).find('.nps-filled');
    });
    it('should display filled message', function() {
        assert.match($filled.text(), /filled the survey/);
    });
});
    describe('translations', function() {
        it('should use en as default', function() {
            assert.match(dom(view.el).text(), /How likely/);
        });
        it('should translate to cz', function() {
            var view = new View({language: 'cz'});
            view.appendTo(document.body);
            view.show();

            assert.match(dom(view.el).text(), /Doporučili byste/);

            view.remove();
        });
    });
});
