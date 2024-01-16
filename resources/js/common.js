$(function () {
    const $elements = $.find('*[data-html-include]');
    if ($elements.length) {
        ui.include(function () {
            ui.init();
        });
    } else {
        ui.init();
    }
});

$(window).on('resize', function () {
    ui.vhChk();
});

const ui = {
    init: function () {
        ui.Device.viewport();
        ui.Device.check();

        const _this = this;

        _this.vhChk();
        _this.header();
        _this.top();
        _this.tab();
        _this.input();
        _this.forms();
        _this.sch();
        _this.etc();
        _this.tooltip.init();
        _this.select.init();
        _this.lottie();
        _this.keyboard();

        //퍼블리스트 확인용
        if (getUrlParams().pubPop) {
            ui.popup.open('#' + getUrlParams().pubPop);
        }
    },
    include: function (fn) {
        const $elements = $.find('*[data-html-include]');
        if ($elements.length) {
            // const $url = location.href;
            //if ($url.indexOf('http') >= 0) {
            if (location.host) {
                $.each($elements, function (i) {
                    const $this = $(this);
                    $this.empty();
                    const $html = $this.data('html-include');
                    const $htmlAry = $html.split('/');
                    const $htmlFile = $htmlAry[$htmlAry.length - 1];
                    const $docTitle = document.title;
                    let $title = null;
                    if ($docTitle.indexOf(' | ') > -1) {
                        $title = $docTitle.split(' | ')[0];
                    }
                    $this.load($html, function (res, sta, xhr) {
                        if (sta == 'success') {
                            if (!$this.attr('class') && !$this.attr('id')) $this.children().unwrap();
                            else $this.removeAttr('data-html-include');
                        }
                        if (i === $elements.length - 1) {
                            if (!!fn) fn();
                        }
                    });
                });
            } else {
                if (!!fn) fn();
            }
        }
    },
    vhChk: function () {
        const $vh = window.innerHeight * 0.01;
        $('html').css('--vh', $vh + 'px');
    },
    header: () => {
        let scrolling;
        const $header = $('.header');
        const headerHeight = $header.height();
        // 2023-08-31 개발 수정
        const statusBarHeight = location.pathname.includes('v2/page/login') ? 0 : window.statusBarHeight || 0;
        if (statusBarHeight) $('html').css('--statusBarHeight', statusBarHeight + 'px');

        const bodyLayer = $('.layerpopup-box.full.is-active');
        if (bodyLayer.length && !$('.wrap').length) {
            $('body').css('background-color', '#fff');
            if (bodyLayer.find('.challPop').length) {
                bodyLayer.addClass('like-not-full');
            } else {
                bodyLayer.addClass('body-layer');
            }
        }

        //header 이전 버전
        // $(window).on('scroll', (e) => {
        //     if ($(this).scrollTop() > headerHeight) {
        //         $header.addClass('is-focus');

        //         if (!scrolling) {
        //             $header.addClass('up');
        //         }

        //         clearTimeout(scrolling);
        //         scrolling = setTimeout(() => {
        //             $header.removeClass('up');
        //             scrolling = undefined;
        //         }, 250);
        //     } else {
        //         $header.removeClass('is-focus');
        //         $header.removeClass('up');
        //     }
        // });
        //header 새버전
        let prevSclTop = $(window).scrollTop();
        $(window).on('scroll', (e) => {
            const nowSclTop = $(window).scrollTop();
            if (nowSclTop > headerHeight) {
                const sclDirection = nowSclTop > prevSclTop ? 'down' : 'up';
                const sclDistance = Math.abs(nowSclTop - prevSclTop);
                if (sclDistance > 5) {
                    if (sclDirection === 'down') {
                        $header.addClass('up');
                    } else {
                        $header.removeClass('up');
                    }
                }
                $header.addClass('is-focus');
            } else {
                $header.removeClass('is-focus up');
            }

            prevSclTop = nowSclTop;
        });
    },
    sch: () => {
        const $delAll = $('.btn-all-del');
        const $inpSearch = $('input[data-name="search"]');
        const latestidx = $('.sch-latest-list li');

        $delAll.on('click', function () {
            $('.sch-latest-list li').remove();
            $(this).closest('.sch-latest-area').hide();
        });
        // 전체삭제

        const btndel = $('.btn-del');
        $(document).ready(function () {
            var latestitems = $('.sch-latest-list li').length;

            if (latestitems == 0) {
                $('.sch-latest-area').hide();
            }

            btndel.on('click', function () {
                $(this).parent('li').remove();
                var latestitems = $('.sch-latest-list li').length;

                if (latestitems == 0) {
                    $('.sch-latest-area').hide();
                }
            });
        });
        // 최근검색어 없을때

        $inpSearch.on('input', function () {
            if ($inpSearch.val().length >= 1) {
                $('.sch-latest-area').hide();
                $('.sch-auto-area').show();
            } else {
                if ($('.sch-latest-list li').length == 0) {
                    $('.sch-latest-area').hide();
                } else {
                    $('.sch-latest-area').show();
                }
                $('.sch-auto-area').hide();
            }
        });
    },
    top: () => {
        const $btnTop = $('.btn-top');

        $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('.quick_top').fadeIn();
            } else {
                $('.quick_top').fadeOut();
            }
        });
        $btnTop.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 400);
        });
    },
    tab: () => {
        const $tabBtn = $('.tab-button');

        $tabBtn.on('click', function () {
            const $tabBtnLeft = $(this).offset().left;
            const $tabCont = $('.tab-items ul');
            const tabContCenter = $tabCont.width() / 2;
            const currentScrollLeft = $tabCont.scrollLeft();
            const scrollLeft = currentScrollLeft + $tabBtnLeft - tabContCenter + $(this).width() / 2;

            $tabCont.stop().animate(
                {
                    scrollLeft: scrollLeft
                },
                500
            );

            var data = $(this).data('target'),
                id = $(this).attr('href'),
                $tab = $(this).parent();
            const _this = $(this);

            if ($tab.hasClass('on')) return false;

            _this.parent().addClass('on').siblings().removeClass('on');
            $('#' + data)
                .addClass('open')
                .siblings()
                .removeClass('open');
            // $(id).addClass('open').siblings().removeClass('open');
        });
    },
    tooltip: {
        className: {
            wrap: '.tooltip-box',
            btn: '.tooltip-btn',
            active: '.on',
            body: '.tooltip-body',
            inner: '.tooltip-inner',
            arrow: '.tooltip-arr',
            closeBtn: '.tooltip-close'
        },
        resize: function () {
            if (!$(ui.tooltip.className.btn + ui.tooltip.className.active).length) return;
            $(ui.tooltip.className.btn + ui.tooltip.className.active).each(function () {
                const $btn = $(this);
                const $wrap = $btn.closest(ui.tooltip.className.wrap);
                const $body = $wrap.find(ui.tooltip.className.body);
                const $arr = $wrap.find(ui.tooltip.className.arrow);
                const $winW = $(window).width();
                const $bodyW = $body.outerWidth();
                const $btnW = $btn.outerWidth();
                const $btnX = $btn.offset().left;
                const $btnCenter = $btnX + $btnW / 2;
                const $scrollEnd = $(window).height() + $(window).scrollTop();
                const $margin = 16;

                let $left = ($bodyW - $btnW) / 2;
                const $rightOver = $btnCenter + $bodyW / 2 - ($winW - $margin);
                const $leftOver = $btnCenter - $bodyW / 2 - $margin;
                if ($rightOver > 0) $left = $left + $rightOver;
                if ($leftOver < 0) $left = $left + $leftOver;

                if ($bodyW >= $winW - $margin * 2) $body.addClass('is-wrap');
                $body.css({
                    left: -$left
                });
                $arr.css({
                    left: $left + $btnW / 2
                });

                const $bodyY = $wrap.offset().top + $wrap.outerHeight() + parseInt($body.css('margin-top')) + parseInt($body.css('margin-bottom')) + $body.outerHeight();
                if ($body.hasClass('is-bottom')) $body.addClass('bottom');
                else if ($scrollEnd - 10 < $bodyY) $body.addClass('bottom');
                else $body.removeClass('bottom');
            });
        },
        position: function (tar) {
            const $tar = $(tar);

            if (!$tar.find(ui.tooltip.className.inner).length) $tar.wrapInner('<div class="' + ui.tooltip.className.inner.slice(1) + '"></div>');
            if (!$tar.find(ui.tooltip.className.arrow).length) $tar.prepend('<i class="' + ui.tooltip.className.arrow.slice(1) + '" aria-hidden="true"></i>');
            // if (!$tar.find(ui.tooltip.className.closeBtn).length) $tar.find(ui.tooltip.className.inner).append('<a href="#" class="' + ui.tooltip.className.closeBtn.slice(1) + '" role="button" aria-label="툴팁닫기"></a>');
            ui.tooltip.resize();
        },
        aria: function (element) {
            $(element).each(function (e) {
                const $btn = $(this).find(ui.tooltip.className.btn);
                const $body = $(this).find(ui.tooltip.className.body);
                let $bodyId = $body.attr('id');
                const $closeBtn = $(this).find(ui.tooltip.className.closeBtn);

                if (!$bodyId) $bodyId = 'ttCont-' + e;
                $btn.attr({
                    role: 'button'
                    // 'aria-describedby': $bodyId
                });
                $body.attr({
                    // id: $bodyId,
                    role: 'tooltip'
                });
                $closeBtn.attr('role', 'button');
            });
        },
        reInit: function () {
            ui.tooltip.aria(ui.tooltip.className.wrap);
        },
        init: function () {
            ui.tooltip.aria(ui.tooltip.className.wrap);

            //열기
            $(document).on('click', ui.tooltip.className.wrap + ' ' + ui.tooltip.className.btn, function (e) {
                e.preventDefault();
                $body = $(this).closest(ui.tooltip.className.wrap).find(ui.tooltip.className.body);
                if ($(this).hasClass('is-pop')) {
                    const $popContent = $body.html();
                    const $popTitle = $body.attr('title');
                    if ($popTitle !== undefined) {
                        Layer.tooltip($popContent, $popTitle);
                    } else {
                        Layer.tooltip($popContent);
                    }
                } else {
                    if ($(this).hasClass(ui.tooltip.className.active.slice(1))) {
                        $body.stop(true, false).fadeOut();
                        $(this).removeClass(ui.tooltip.className.active.slice(1));
                    } else {
                        $(ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
                        $(ui.tooltip.className.body).fadeOut();
                        $(this).addClass(ui.tooltip.className.active.slice(1));
                        $body.stop(true, false).fadeIn();
                        setTimeout(function () {
                            ui.tooltip.position($body);
                        }, 10);
                    }
                }
            });
            //닫기
            $(document).on('click', ui.tooltip.className.closeBtn, function (e) {
                e.preventDefault();
                const $body = $(this).closest(ui.tooltip.className.body);
                const $btn = $body.siblings(ui.tooltip.className.btn);
                $btn.removeClass(ui.tooltip.className.active.slice(1));
                $body.stop(true, false).fadeOut(500, function () {
                    $btn.focus();
                });
            });
            $(document)
                .on('click touchstart', function (e) {
                    $(ui.tooltip.className.body).stop(true, false).fadeOut();
                    $(ui.tooltip.className.wrap + ' ' + ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
                })
                .on('click touchstart', ui.tooltip.className.wrap, function (e) {
                    e.stopPropagation();
                });

            $(ui.tooltip.className.btn + ui.tooltip.className.active).each(function () {
                const $this = $(this);
                const $body = $this.siblings(ui.tooltip.className.body);
                const $hideTimer = $this.data('hide-timer');
                if ($body.length) {
                    $body.show();
                    ui.tooltip.position($body);
                    if ($hideTimer) {
                        $this.addClass('pointer-events-none');
                        setTimeout(function () {
                            $body.stop(true, false).fadeOut(500, function () {
                                $this.removeClass('pointer-events-none on');
                            });
                        }, $hideTimer);
                    }
                }
            });
        }
    },
    input: function () {
        const inpBox = $('.input-box');
        inpBox.each(function () {
            const _this = this;
            const _input = $(_this).find('input, textarea');
            if (_input.length && _input.attr('type') !== 'hidden') {
                ui.inputFocus(_input);
                if ($(_this).hasClass('error')) _input.addClass('error');
            }
            const _autoheightEl = $(_this).find('textarea.auto-height');
            if (_autoheightEl.length) {
                const $oldH = _autoheightEl.outerHeight();
                _autoheightEl.data('old-height', $oldH);
                ui.textareaHeight(_autoheightEl, true);
            }
        });
    },
    inputFocus: function (element) {
        const _closest = '.input-box, .text-box';
        const _val = $(element).val();
        if (_val.trim() !== '') {
            $(element).closest(_closest).addClass('focus');
        } else {
            $(element).closest(_closest).removeClass('focus');
        }
    },
    textareaHeight: function (elem, isLastScroll) {
        const $elem = $(elem);
        $elem[0].style.height = 'auto';
        const $maxLine = $(elem).data('max-line') || 2;
        const $lineH = parseInt($(elem).css('line-height'));
        const $pdH = parseInt($(elem).css('padding-top')) + parseInt($(elem).css('padding-bottom'));
        const $borderH = parseInt($(elem).css('border-top-width')) + parseInt($(elem).css('border-bottom-width'));
        const $maxH = $lineH * $maxLine + $pdH + $borderH;
        const $oldH = $(elem).data('old-height') || 48;
        const $newH = Math.min($maxH, $elem[0].scrollHeight + $borderH);
        $elem[0].style.height = '';
        if ($oldH < $newH) {
            $(elem)
                .closest('.input-box, .text-box')
                .css('--input-height', $newH + 'px');
        } else {
            $(elem).closest('.input-box, .text-box').css('--input-height', '');
        }

        const _el = $(elem)[0];
        if ((_el.selectionStart == _el.value.length && _el.selectionEnd == _el.value.length) || isLastScroll) {
            // 커서가 맨 마지막 줄에 있는지 확인
            const _elH = _el.offsetHeight;
            const _sclH = _el.scrollHeight + parseInt($(elem).css('border-top-width')) + parseInt($(elem).css('border-bottom-width'));
            if (_elH < _sclH) _el.scrollTop = _sclH - _elH;
        }
    },
    forms: () => {
        $(document).on('input change', '.input-box input, .input-box textarea', function () {
            const _this = this;
            ui.inputFocus(_this);
        });

        $(document).on('input change blur', 'textarea.auto-height', function () {
            const _this = this;
            ui.textareaHeight(_this);
        });

        $(document).on('click', '.btn-inp-del', function () {
            const $inp = $(this).siblings('input, textarea');
            $inp.val('').change().focus();
            $(this).closest('.input-box, .text-box').removeClass('focus');
        });

        $(document).on('click', '.btn-inp-pw', function (e) {
            e.preventDefault();

            $(this).toggleClass('is-show');
            $(this).attr('aria-label', '비밀번호 숨김');

            const $inp = $(this).siblings('input');

            if ($(this).hasClass('is-show')) {
                $inp.prop('type', 'text');
            } else {
                $inp.prop('type', 'password');
                $(this).attr('aria-label', '비밀번호 표시');
            }
        });
    },
    select: {
        className: {
            wrap: '.select-box',
            wrapSolo: '.select-box.solo',
            btn: '.btn-select',
            btnActive: '.open',
            optionsWrap: '.select-options',
            option: '.select-option',
            selectPopClass: '.select-pop',
            selectPopWrap: '.pop-select'
        },
        init: function () {
            ui.select.ready();
            ui.select.UI();
        },
        ready: function () {
            $(ui.select.className.wrap).each(function () {
                const $this = $(this);
                const $sel = $this.find('select');
                if (!$this.find(ui.select.className.btn).length) {
                    const $title = $sel.attr('title') || '선택';
                    const $btn = `<button class="${ui.select.className.btn.slice(1)}" title="${$title}"></button>`;
                    $sel.hide();
                    $this.append($btn);
                    ui.select.setBtnText($sel);
                }
            });
        },
        setBtnText(elem) {
            const $el = $(elem);
            const $btn = $el.siblings(ui.select.className.btn);
            if (!$el.length || !$btn.length) return;
            const $selectedTxt = $el.find(':selected').text();
            $btn.text($selectedTxt);
        },
        makeOptions: function (select, btn) {
            const $select = $(select);
            const $btn = $(btn);
            if (!$select.children().length) return;
            const isPop = $select.hasClass(ui.select.className.selectPopClass.slice(1));

            let $options = $(ui.select.className.optionsWrap);
            if ($options.length) ui.select.reset();

            const $title = $btn.attr('title');
            let $optionHtml = '';
            if (isPop) $optionHtml += '<div class="' + ui.select.className.selectPopWrap.slice(1) + '">';
            $optionHtml += '<div class="' + ui.select.className.optionsWrap.slice(1) + '">';
            $optionHtml += '<h1>' + $title + '</h1>';
            $optionHtml += '<ul>';
            $select.children().each(function () {
                const $this = $(this);
                const $val = $this.attr('value');
                const $text = $this.text();
                const $seletedClass = $this.prop('selected') ? ' selected' : '';
                $optionHtml += '<li><button class="' + ui.select.className.option.slice(1) + $seletedClass + '" data-val="' + $val + '">' + $text + '</button></li>';
            });
            $optionHtml += '</ul>';
            $optionHtml += '</div>';
            if (isPop) $optionHtml += '</div>';

            $('body').append($optionHtml);
            $options = $(ui.select.className.optionsWrap);
            $options.data('select', select);

            if (isPop) {
                $options.animate({ bottom: 0 }, 500);
            }

            if (!isPop) {
                let $top = $btn.offset().top + $btn.outerHeight();
                let $left = $btn.offset().left;
                const $width = $btn.outerWidth();
                if ($top + $options.outerHeight() > $(window).scrollTop() + $(window).height() + 20) {
                    $top = $top - $btn.outerHeight() - $options.outerHeight() - 2;
                }
                if ($left + $options.outerWidth() > $(window).scrollLeft() + $(window).width()) {
                    $left = $left + $btn.outerWidth() - $options.outerWidth();
                }
                $options.css({
                    top: $top + 2,
                    left: $left,
                    minWidth: $width
                });
            }
        },
        makeOptionsRadio: function (select, btn) {
            const $select = $(select);
            const $btn = $(btn);
            const $dataName = $('.select-rdo').data('name');
            const $btnSel = $('.select-box .btn-confirm').text();
            if (!$select.children().length) return;
            const isPop = $select.hasClass(ui.select.className.selectPopClass.slice(1));

            let $options = $(ui.select.className.optionsWrap);
            if ($options.length) ui.select.reset();

            const $title = $btn.attr('title');
            let $optionHtml = '';
            if (isPop) $optionHtml += '<div class="' + ui.select.className.selectPopWrap.slice(1) + '">';
            $optionHtml += '<div class="' + ui.select.className.optionsWrap.slice(1) + ' rdo-options' + '">';
            $optionHtml += '<h1>' + $title + '</h1>';
            $optionHtml += '<ul>';
            $select.children().each(function () {
                const $this = $(this);
                const $val = $this.attr('value');
                const $text = $this.text();
                const $seletedClass = $this.prop('selected') ? ' selected' : '';
                $optionHtml += '<li>';
                $optionHtml += '<div class="rdo-box cell">';
                $optionHtml += '<input type="radio" name="' + $dataName + '" id="' + 'rdo' + $val + '" class="' + ui.select.className.option.slice(1) + $seletedClass + ' rdo-sel' + '">';
                $optionHtml += '<label for="' + 'rdo' + $val + '">' + $text + '</label>';
                $optionHtml += '</div">';
                $optionHtml += '</li">';
            });
            $optionHtml += '</ul>';
            $optionHtml += '<div class="btn-bottom-box">';
            $optionHtml += '<button type="button" class="btn-primary btn-sel">' + $btnSel + '</button></div>';
            $optionHtml += '</div>';

            if (isPop) $optionHtml += '</div>';

            $('body').append($optionHtml);
            $options = $(ui.select.className.optionsWrap);
            $options.data('select', select);

            if (isPop) {
                $options.animate({ bottom: 0 }, 500);
            }

            if (!isPop) {
                let $top = $btn.offset().top + $btn.outerHeight();
                let $left = $btn.offset().left;
                const $width = $btn.outerWidth();
                if ($top + $options.outerHeight() > $(window).scrollTop() + $(window).height() + 20) {
                    $top = $top - $btn.outerHeight() - $options.outerHeight() - 2;
                }
                if ($left + $options.outerWidth() > $(window).scrollLeft() + $(window).width()) {
                    $left = $left + $btn.outerWidth() - $options.outerWidth();
                }
                $options.css({
                    top: $top + 2,
                    left: $left,
                    minWidth: $width
                });
            }
        },
        reset: function () {
            const $options = $(ui.select.className.optionsWrap);
            if (!$options.length) return;
            $options.each(function () {
                const $this = $(this);
                const $select = $($this.data('select'));
                if (!$select) return;
                const $btn = $select.siblings(ui.select.className.btn);
                if ($btn.length) $btn.removeClass(ui.select.className.btnActive.slice(1));
                const $wrap = $this.closest(ui.select.className.selectPopWrap).length ? $this.closest(ui.select.className.selectPopWrap) : $this;

                if ($this.parent('.pop-select').length) {
                    $wrap.find('.select-options').animate({ bottom: -100 + '%' }, 500, function () {
                        $wrap.remove();
                    });
                } else {
                    $wrap.remove();
                }
            });

            const $btn = $(ui.select.className.btn + ui.select.className.btnActive);
            if ($btn.length) $btn.removeClass(ui.select.className.btnActive.slice(1));
        },
        UI: function () {
            //select change
            $(document).on('change', ui.select.className.wrap + ' select', function (e) {
                ui.select.setBtnText(this);
            });

            //btn
            $(document).on('click', ui.select.className.btn, function (e) {
                e.preventDefault();
                const $this = $(this);
                const $select = $this.siblings('select');

                $('body').toggleClass('lock-body');

                if ($this.hasClass(ui.select.className.btnActive.slice(1))) {
                    ui.select.reset();
                } else if ($this.siblings('.select-rdo').length) {
                    ui.select.makeOptionsRadio($select, $this);
                } else {
                    $this.addClass(ui.select.className.btnActive.slice(1));
                    ui.select.makeOptions($select, $this);
                }
            });

            //option
            $(document).on('click', ui.select.className.option, function (e) {
                e.preventDefault();
                const $this = $(this);
                const $val = $this.data('val');
                const $closest = $this.closest(ui.select.className.optionsWrap);
                const $select = $closest.data('select');
                const $btn = $select.siblings(ui.select.className.btn);

                if ($this.hasClass('rdo-sel')) {
                    $('.btn-sel').on('click', function () {
                        $select.val($val).change();
                        ui.select.reset();
                        $btn.removeClass(ui.select.className.btnActive.slice(1)).focus();
                        $('body').removeClass('lock-body');
                    });
                } else {
                    $select.val($val).change();
                    ui.select.reset();
                    $btn.removeClass(ui.select.className.btnActive.slice(1)).focus();
                    $('body').removeClass('lock-body');
                }
            });

            //out click
            $(document)
                .on('click touchend', '.pop-select', function (e) {
                    ui.select.reset();
                    $('body').removeClass('lock-body');
                })
                .on('click touchend', ui.select.className.wrap + ',' + ui.select.className.optionsWrap, function (e) {
                    e.stopPropagation();
                    // $('body').removeClass('lock-body');
                });
        }
    },
    popup: {
        zIndex: 1001,
        popCnt: 0,

        toast: function (target) {
            var $toastPop = $(target),
                delayTime = 3000;

            $toastPop.close = null;

            clearTimeout($toastPop.close);

            $toastPop.fadeIn(100, function () {
                setTimeout(function () {
                    $toastPop.addClass('is-end');
                }, delayTime);
            });

            $toastPop.on('transitionend', function () {
                $toastPop.addClass('is-end').hide().removeClass('is-end');
            });

            $('.btn-close', $toastPop)
                .off('click')
                .on('click', function () {
                    clearTimeout($toastPop.close);
                    $toastPop.addClass('is-end');
                });
        },
        open: function (target, popOpen, param) {
            console.log('팝업열기 : ' + target.selector);

            let $layer = $(target);

            $(document).ready(function () {
                $('body').addClass('lock-body');
            });
            $layer.on('click', function (e) {
                const $layerPopup = $layer.find('.layer-popup');

                if ($layerPopup.has(e.target).length === 0) {
                    $('body').removeClass('lock-body');
                    $layer.removeClass('is-animation');
                    let eventEnd = () => {
                        $layer.removeClass('is-active');
                        $layer.off('transitionend', eventEnd);
                    };
                    $layer.on('transitionend', eventEnd);
                    return;
                }
            });

            $layer.each(function () {
                // const callback = $layer.data('callback');

                $layer.addClass('is-active');
                if (!$layer.hasClass('full')) {
                    setTimeout(function () {
                        $layer.addClass('is-animation');
                    }, 100);
                } else {
                    let btnBoxHeight = $layer.find('.layer-content').siblings('.btn-bottom-box').outerHeight(true);
                    if ($('.layer-content + .btn-bottom-box').length) {
                        $layer.find('.layer-content').css('padding-bottom', btnBoxHeight);
                    }
                }
            });
        },
        close: function (target, popOpen, param, callback) {
            console.log('팝업닫기 : ' + target.selector);
            let $layer = $(target);
            let $btnClose = $layer.find('.btn-pop-close');
            let $btnConfirm = $layer.find('.btn-pop-confirm');

            $('body').removeClass('lock-body');

            if ($layer.hasClass('full')) {
                $layer.removeClass('is-active');
                $layer.find('.layer-content').removeAttr('style');
            } else {
                $layer.removeClass('is-animation');
                let eventEnd = () => {
                    $layer.removeClass('is-active');
                    $layer.off('transitionend', eventEnd);
                };
                $layer.on('transitionend', eventEnd);
            }

            if (callback) {
                let callbackFunction = window[callback];

                if (typeof callbackFunction === 'function') {
                    callbackFunction(target, popOpen, param);
                }
            }

            $btnClose.on('click', function (e) {
                e.preventDefault();

                $('body').removeClass('lock-body');

                if ($layer.hasClass('full')) {
                    $layer.removeClass('is-active');
                    $layer.find('.layer-content').removeAttr('style');
                } else {
                    $layer.removeClass('is-animation');
                    let eventEnd = () => {
                        $layer.removeClass('is-active');
                        $layer.off('transitionend', eventEnd);
                    };
                    $layer.on('transitionend', eventEnd);
                }
            });

            $btnConfirm.on('click', function (e) {
                e.preventDefault();

                $('body').removeClass('lock-body');

                if ($layer.hasClass('full')) {
                    $layer.removeClass('is-active');
                    $layer.find('.layer-content').removeAttr('style');
                } else {
                    $layer.removeClass('is-animation');
                    let eventEnd = () => {
                        $layer.removeClass('is-active');
                        $layer.off('transitionend', eventEnd);
                    };
                    $layer.on('transitionend', eventEnd);
                }

                //콜백함수 경우
                let callback = $layer.data('callback');

                if (callback) {
                    ui.popup.close(target, popOpen);

                    let callbackFunction = window[callback];

                    if (typeof callbackFunction === 'function') {
                        callbackFunction(target, popOpen, param);
                    }
                }
            });
        },
        callbackPopup: function (message, callback) {
            var popupHtml = `
            <article class="layerpopup-box msg" role="dialog">
                <div class="layer-popup msg-box">
                    <p class="msg">${message}</p>
                    <div class="btn-box">
                        <button type="button" class="btn btn-primary btn-pop-confirm" title="확인">확인</button>
                    </div>
                </div>
            </article>
        `;

            // 팝업 열기 함수 호출
            this.open($(popupHtml), null, null);

            // 확인 버튼 클릭 시 콜백 함수 실행
            $('.btn-pop-confirm').on('click', function () {
                ui.popup.close($(this).closest('.layerpopup-box'), null, null, callback);
            });
        }
    },
    etc: () => {
        // 더보기
        const $btnMore = $('.btn-loadmore');
        const $batchNum = 5;
        const $listWrap = $btnMore.closest('.more-list').find('ul, ol');
        const $li = $listWrap.find('li');
        $li.hide();
        $li.slice(0, $batchNum).show();

        if ($li.length <= 5) {
            $btnMore.parent().hide();
        }

        function showNextBatch() {
            const start = Math.ceil($li.filter(':visible').length / $batchNum) * $batchNum;
            const end = start + $batchNum;

            if ($li.slice(start, end).filter(':hidden').length === 0) {
                $btnMore.parent().hide();
                return;
            } else if ($li.slice(start, end).filter(':hidden').length < 5) {
                $li.slice(start, end).show().parent().siblings().hide();
            }

            $li.slice(start, end).show();

            if ($li.filter(':visible').length >= 20) {
                $btnMore.parent().hide();
            }
        }

        function expandScroll() {
            let $SclVal = $btnMore.is(':visible') ? $btnMore.offset().top + $btnMore.outerHeight() :$listWrap.offset().top + $listWrap.outerHeight();
            if($(window).scrollTop() + $(window).height() < $SclVal) {
                $SclVal = Math.min($listWrap.offset().top - 10, $SclVal - $(window).height() + 10);
                $('html, body').stop().animate({ scrollTop: $SclVal }, 1000);
            }
        }

        function toggleItem() {
            if($btnMore.hasClass('open')){
                $li.slice(5, $li.length).hide();
                $btnMore.removeClass('open').text('더보기');
            }else{
                $li.show();
                $btnMore.addClass('open').text('접기');
            }
        }

        $btnMore.on('click', function (e) {
            e.preventDefault();
            if($btnMore.hasClass('ty2')){
                toggleItem()
            }else{
                showNextBatch();
            }
            expandScroll();
        });

        // 전체 체크 및 개별 체크
        $('input[name=chk_all]').on('change', function () {
            if ($('input[name=chk_all]').is(':checked')) $('input[name=chk]').prop('checked', true);
            else $('input[name=chk]').prop('checked', false);
        });

        $('input[name=chk]').on('change', function () {
            var total = $('input[name=chk]').length;
            var checked = $('input[name=chk]:checked').length;

            if (total != checked) $('input[name=chk_all]').prop('checked', false);
            else $('input[name=chk_all]').prop('checked', true);
        });

        // 재생
        var $btnPlay = $('.btn-play');
        $btnPlay.off('click').on('click', function (e) {
            e.preventDefault();
            $(this).closest('li').siblings().find('.btn-play').removeClass('is-stop');

            $(this).toggleClass('is-stop');

            if ($(this).hasClass('is-stop')) {
                $(this).find('.blind').text('정지');
            } else {
                $(this).find('.blind').text('재생');
            }
        });

        // $btnPlay.each(function () {});

        // 팔로워/팔로잉
        $('.btn-follow').on('click', function () {
            $(this).toggleClass('is-ing');

            if (!$(this).hasClass('is-ing')) {
                $(this).find('span').text('팔로우');
            } else {
                $(this).find('span').text('팔로잉');
            }
        });

        $('[data-ellipsis-line]').click(function (e) {
            const $this = $(this);
            const $line = $this.data('ellipsis-line') || 2;
            const $className = 'ellipsis' + $line;
            $this.toggleClass($className);
        });
    },
    lottie: function (readyEvt, completeEvt) {
        const $lottie = $('[data-lottie]');
        if (!$lottie.length) return;
        const $lottieInit = function () {
            $lottie.each(function () {
                const _this = this;
                const $this = $(this);
                // $this.empty();
                if (!$this.hasClass('lottie__init')) {
                    const $data = $this.data('lottie');
                    // $this.addClass('lottie__init').removeAttr('data-lottie').aria('hidden', true);
                    const $loopOpt = $this.hasClass('_loop');
                    const $stopOpt = $this.hasClass('_stop');
                    const $autoOpt = $this.hasClass('_auto');
                    const $sclAnimation = $this.data('animation');
                    // let $autoplayOpt = true;

                    if ($sclAnimation || $stopOpt) {
                        $autoplayOpt = false;
                    }
                    const $lottieOpt = lottie.loadAnimation({
                        container: this,
                        renderer: 'svg',
                        loop: $loopOpt,
                        autoplay: $autoOpt,
                        path: $data
                    });

                    $this.data('lottie-opt', $lottieOpt);

                    $lottieOpt.addEventListener('config_ready', function () {
                        if (!!readyEvt) readyEvt(_this, $lottieOpt);
                    });

                    if ($loopOpt) {
                        $lottieOpt.addEventListener('loopComplete', function () {
                            if (!!completeEvt) completeEvt(_this, $lottieOpt);
                        });
                    } else {
                        $lottieOpt.addEventListener('complete', function () {
                            if (!!completeEvt) completeEvt(_this, $lottieOpt);
                        });
                    }
                }
            });
        };
        $lottieInit();
    },
    keyboard: function () {
        const $commentInp = $('.comment-inp-box');
        let windowHeight = window.innerHeight;
        const isIOS = ui.Mobile.iOS();
        const isSafari = navigator.userAgent.match(/Safari/i) == null ? false : true;
        let prevHeight = null;
        let moveSCl = null;
        let lastSCl = null;
        function resiseHandler() {
            windowHeight = window.innerHeight;
        }
        function viewportHandler(event) {
            var viewport = event.target;
            const viewportHeight = viewport.height;
            if (windowHeight > viewportHeight) {
                // console.log('키패드 올리고');
                $('html').addClass('is-keyboard-active');
                if (isIOS) {
                    const sclNow = window.scrollY || window.pageYOffset;
                    const $maxScl = $('body').height() - viewportHeight;
                    let sclVal = null;
                    if (prevHeight) {
                        if (viewportHeight < prevHeight) {
                            // console.log('이모티콘 키패드');
                            moveSCl = prevHeight - viewportHeight;
                            sclVal = sclNow + moveSCl;
                            lastSCl = sclNow;
                            if ($maxScl < sclVal) {
                                sclVal = $maxScl;
                                if (isSafari) $commentInp.css('transform', 'translateY(-50%)');
                            }
                            $(window).scrollTop(sclVal);
                        } else {
                            // console.log('일반 키패드');
                            if (lastSCl) {
                                sclVal = Math.min($maxScl, lastSCl);
                                if (isSafari) {
                                    $(window).scrollTop(sclVal);
                                    if (sclNow !== lastSCl) $commentInp.css('transform', 'translateY(-50%)');
                                    else $commentInp.css('transform', '');
                                }
                            } else {
                                lastSCl = null;
                            }
                        }
                    }
                    prevHeight = viewportHeight;
                }
            } else {
                // console.log('키패드 내리고');
                $('html').removeClass('is-keyboard-active');
                if (isIOS) {
                    prevHeight = null;
                    if (isSafari) $commentInp.css('transform', '');
                }
            }
        }

        window.addEventListener('resize', resiseHandler);
        window.visualViewport.addEventListener('resize', viewportHandler);
        if (isIOS && $commentInp.length) {
            $commentInp.find('input, textarea').on('focusout', function () {
                if (isSafari) $commentInp.css('transform', '');
            });
        }
    }
};

//PC 디바이스 체크
ui.PC = {
    window: function () {
        return navigator.userAgent.match(/windows/i) == null ? false : true;
    },
    mac: function () {
        return navigator.userAgent.match(/macintosh/i) == null ? false : true;
    },
    chrome: function () {
        return navigator.userAgent.match(/chrome/i) == null ? false : true;
    },
    firefox: function () {
        return navigator.userAgent.match(/firefox/i) == null ? false : true;
    },
    opera: function () {
        return navigator.userAgent.match(/opera|OPR/i) == null ? false : true;
    },
    safari: function () {
        return navigator.userAgent.match(/safari/i) == null ? false : true;
    },
    edge: function () {
        return navigator.userAgent.match(/edge/i) == null ? false : true;
    },
    msie: function () {
        return navigator.userAgent.match(/rv:11.0|msie/i) == null ? false : true;
    },
    ie11: function () {
        return navigator.userAgent.match(/rv:11.0/i) == null ? false : true;
    },
    ie10: function () {
        return navigator.userAgent.match(/msie 10.0/i) == null ? false : true;
    },
    ie9: function () {
        return navigator.userAgent.match(/msie 9.0/i) == null ? false : true;
    },
    ie8: function () {
        return navigator.userAgent.match(/msie 8.0/i) == null ? false : true;
    },
    any: function () {
        return ui.PC.window() || ui.PC.mac();
    },
    check: function () {
        if (ui.PC.any()) {
            $('html').addClass('pc');
            if (ui.PC.window()) $('html').addClass('window');
            if (ui.PC.mac()) $('html').addClass('mac');
            if (ui.PC.msie()) $('html').addClass('msie');
            if (ui.PC.ie11()) $('html').addClass('ie11');
            if (ui.PC.ie10()) $('html').addClass('ie10');
            if (ui.PC.ie9()) $('html').addClass('ie9');
            if (ui.PC.ie8()) $('html').addClass('ie8');
            if (ui.PC.edge()) {
                $('html').addClass('edge');
            } else if (ui.PC.opera()) {
                $('html').addClass('opera');
            } else if (ui.PC.chrome()) {
                $('html').addClass('chrome');
            } else if (ui.PC.safari()) {
                $('html').addClass('safari');
            } else if (ui.PC.firefox()) {
                $('html').addClass('firefox');
            }
        }
    }
};

//모바일 디바이스 체크
ui.Mobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i) == null ? false : true;
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
    },
    iPhone: function () {
        return navigator.userAgent.match(/iPhone/i) == null ? false : true;
    },
    iPad: function () {
        return navigator.userAgent.match(/iPad/i) == null ? false : true;
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
    },
    tablet: function () {
        if (ui.Mobile.any()) {
            if (window.screen.width < window.screen.height) {
                return window.screen.width > 760 ? true : false;
            } else {
                return window.screen.height > 760 ? true : false;
            }
        }
    },
    any: function () {
        return ui.Mobile.Android() || ui.Mobile.iOS() || ui.Mobile.BlackBerry() || ui.Mobile.Opera() || ui.Mobile.Windows();
    },
    check: function () {
        if (ui.Mobile.any()) {
            $('html').addClass('mobile');
            if (ui.Mobile.tablet()) $('html').addClass('tablet');
        }
        if (ui.Mobile.iOS()) $('html').addClass('ios');
        if (ui.Mobile.Android()) $('html').addClass('android');
    }
};

//디바이스체크 실행
ui.Device = {
    screenH: window.screen.height,
    screenW: window.screen.width,
    check: function () {
        ui.Mobile.check();
        ui.PC.check();
        if (ui.Mobile.any()) {
            const $pixelRatio = Math.round(window.devicePixelRatio);
            if (!!$pixelRatio) $('html').addClass('pixel-ratio-' + $pixelRatio);
        }

        //가로, 세로 회전시
        if (ui.Mobile.any()) {
            if (window.orientation == 0) {
                $('html').removeClass('landscape');
            } else {
                $('html').addClass('landscape');
            }
            $(window).on('orientationchange', function () {
                if (window.orientation == 0) {
                    $('html').removeClass('landscape');
                } else {
                    $('html').addClass('landscape');
                }
            });
        }
    },
    viewport: function () {
        // 최소기준 디바이스(가로)크기보다 작으면 meta[name="viewport"] 수정
        const deviceMinWidth = 360;
        if ($(window).width() < deviceMinWidth) {
            const $viewport = $('meta[name="viewport"]');
            // const $content = $viewport.attr('content');
            const $newContent = 'width=' + deviceMinWidth + ',user-scalable=no,viewport-fit=cover';
            $viewport.attr('content', $newContent);
        }
    }
};

//파라미터 값 갖고오기
const getUrlParams = function () {
    const params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
        params[key] = value;
    });
    return params;
};
