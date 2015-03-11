"use strict";

var utils = require('../../../../src/utils');

describe('Blocks: Markdown support', function() {
  var data, block;

  var createBlock = function(type, data) {
    var element = $("<textarea>");
    var editor = new SirTrevor.Editor({ el: element });
    var options = editor.block_manager.blockOptions;
    var Klass = SirTrevor.Blocks[utils.classify(type)];
    var block = new Klass(data, editor.id, editor.mediator, options);

    block.render();
    return block;
  };

  describe('TextBlock', function() {
    beforeEach(function() {
      data = {text: 'test'};
    });

    describe('with convertToMarkdown', function() {
      beforeEach(function() {
        spyOn(SirTrevor.Blocks.Text.prototype, 'toMarkdown').and.callThrough();
      });

      describe('turned on', function() {
        beforeEach(function() { 
          SirTrevor.setDefaults({
            convertFromMarkdown: true,
            convertToMarkdown: true
          });
        });

        it('calls toMarkdown on a block', function() {
          block = createBlock('Text', data);
          block.getBlockData();

          expect(block.toMarkdown).toHaveBeenCalled();
        });

        it('sets isHtml to false', function() {
          block = createBlock('Text', data);
          var serializedData = block.getBlockData();

          expect(serializedData.isHtml).toEqual(false);
        });
      });

      describe('turned off', function() {
        beforeEach(function() { 
          SirTrevor.setDefaults({
            convertFromMarkdown: true,
            convertToMarkdown: false
          });
        });

        it('doesn\'t call toMarkdown on the block', function() {
          block = createBlock('Text', data);
          block.getBlockData();

          expect(block.toMarkdown).not.toHaveBeenCalled();
        });

        it('sets isHtml to true', function() {
          block = createBlock('Text', data);
          var serializedData = block.getBlockData();

          expect(serializedData.isHtml).toEqual(true);
        });
      });
    });

    describe('with convertFromMarkdown', function() {
      beforeEach(function() {
        spyOn(SirTrevor.Blocks.Text.prototype, 'toHTML').and.callThrough();
      });

      describe('turned on', function() {
        beforeEach(function() { 
          SirTrevor.setDefaults({
            convertFromMarkdown: true,
            convertToMarkdown: false
          });
        });

        it('calls toHtml on objects without isHtml set', function() {
          block = createBlock('Text', data);
          var serializedData = block.getBlockData();

          expect(block.toHTML).toHaveBeenCalled();
          expect(serializedData.text).toEqual('<p>test</p>');
        });

        it('doesn\'t call toHtml on objects with isHtml set', function() {
          data.isHtml = true;
          block = createBlock('Text', data);
          var serializedData = block.getBlockData();

          expect(serializedData.text).toEqual(data.text);
          expect(block.toHTML).not.toHaveBeenCalled();
        });
      });

      describe('turned off', function() {
        beforeEach(function() { 
          SirTrevor.setDefaults({
            convertFromMarkdown: false,
            convertToMarkdown: false
          });
        });

        it('doesn\'t call toHtml', function() {
          block = createBlock('Text', data);
          var serializedData = block.getBlockData();

          expect(block.toHTML).not.toHaveBeenCalled();
          expect(serializedData.text).toEqual(data.text);
        });

        it('ignores isHtml value', function() {
          data.isHtml = false;

          block = createBlock('Text', data);
          var serializedData = block.getBlockData();

          expect(block.toHTML).not.toHaveBeenCalled();
          expect(serializedData.text).toEqual(data.text);
        });
      });
    });
  });

  describe('List Block', function() {
    beforeEach(function() {
      data = {text: ' - one\n - two\n - three'};
    });
    // convertToMarkdown code is defined in block.js
    // and tested as a part of TextBlock test above

    describe('with convertFromMarkdown', function() {
      beforeEach(function() {
        spyOn(SirTrevor.Blocks.List.prototype, 'toHTML').and.callThrough();
      });

      describe('turned on', function() {
        beforeEach(function() { 
          SirTrevor.setDefaults({
            convertFromMarkdown: true,
            convertToMarkdown: false
          });
        });

        it('calls toHtml on objects without isHtml set', function() {
          block = createBlock('List', data);
          var serializedData = block.getBlockData();

          expect(block.toHTML).toHaveBeenCalled();
          expect(serializedData.text).
            toEqual("<ul><li>one</li><li>two</li><li>three</li></ul>");
        });

        it('doesn\'t call toHtml on objects with isHtml set', function() {
          data.isHtml = true;

          block = createBlock('List', data);
          var serializedData = block.getBlockData();

          expect(block.toHTML).not.toHaveBeenCalled();
          expect(serializedData.text).toEqual(data.text);
        });
      });

      describe('turned off', function() {
        beforeEach(function() {
          SirTrevor.setDefaults({
            convertFromMarkdown: false,
            convertToMarkdown: false
          });
        });

        it('doesn\'t call toHtml', function() {
          block = createBlock('List', data);
          var serializedData = block.getBlockData();

          expect(block.toHTML).not.toHaveBeenCalled();
          expect(serializedData.text).toEqual(data.text);
        });

        it('ignores isHtml value', function() {
          data.isHtml = false;
          block = createBlock('List', data);
          var serializedData = block.getBlockData();

          expect(block.toHTML).not.toHaveBeenCalled();
          expect(serializedData.text).toEqual(data.text);
        });
      });
    });
  });
});
