var MicroCode = (function () {
    return {
        init: function (inputSel, outputSel) {
            this.focusInput(inputSel);
            this.listenForInput(inputSel);
            this.renderOutput(outputSel, jQuery(inputSel)[0].value);
            this.listenerForScroll(inputSel, outputSel);
        },

        listenForInput: function (inputSel) {
            var self = this;

            jQuery(inputSel).on('input keydown', function (key) {
                var input = this,
                    selStartPos = input.selectionStart,
                    inputVal = input.value;

                if (key.keyCode === 9) {
                    input.value = inputVal.substring(0, selStartPos) + '    ' + inputVal.substring(selStartPos, input.value.length);
                    input.selectionStart = selStartPos + 4;
                    input.selectionEnd = selStartPos + 4;
                    key.preventDefault();
                }

                self.renderOutput('.code-output', this.value);
            });

            Prism.highlightAll();
        },

        listenerForScroll: function (inputSel, outputSel) {
            jQuery(inputSel).on('scroll', function () {
                console.log(this.scrollTop);
                jQuery(outputSel)[0].scrollTop = this.scrollTop;
            });
        },

        renderOutput: function (outputSel, value) {
            jQuery('code', outputSel)
				.html(value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
				.replace(/>/g, '&gt;') + '\n');

            Prism.highlightAll();
        },

        focusInput: function (inputSel) {
            var input = jQuery(inputSel);

            input.focus();

            input[0].selectionStart = input[0].value.length;
            input[0].selectionEnd = input[0].value.length;
        }
    };
}());

MicroCode.init('.code-input', '.code-output');
