/**
 * Handles the code editor.
 */
var SFEditor = (function () {
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

SFEditor.init('.code-input', '.code-output');

/**
 * Renders the result of the script execution.
 *
 * @param {object} result from the server
 */
function renderResult(result) {
    console.log(result);
    jQuery('.window-result').text('');
    if (result.buffer) {
        result.buffer.forEach(function (element) {
            jQuery('.window-result').append('<pre class="' + (element.error ? 'err' : 'print') + '">' + element.msg + '</pre>');
        });
        if (result.error) {
            jQuery('.window-result').css('border-top', '3px solid #dc3545');
            jQuery('.window-result').append('<pre class="stack">' + JSON.stringify(result.exception, null, 4) + '</pre>');
        } else {
            jQuery('.window-result').css('border-top', '3px solid #28a745');
        }
    }

    if (result.codeResult) {
        jQuery('.window-result').append('<pre class="eval"> &gt; ' + result.codeResult + '</pre>');
    }
}

// Binds the Run button
jQuery('#js-nodeinterpreter-run').on('click', function (e) {
    e.preventDefault();
    jQuery('.window-result').css('border-top', '3px solid #007bff');
    jQuery('.window-result').text('');
    jQuery('.window-result').append('<pre>Executing...</pre>');
    var href = jQuery('#js-nodeinterpreter-run').data('href');
    jQuery.post(href,
        {
            code: jQuery('.code-input').val()
        })
    .done(function (data) {
        renderResult(data);
    }).fail(function (xhr, status, error) {
        jQuery('.window-result').css('border-top', '3px solid #dc3545');
        console.error(error);
    });
});
