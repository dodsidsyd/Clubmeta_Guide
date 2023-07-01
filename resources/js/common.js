const ui = {
    init: function () {
        const _this = this;

        // _this.header();
        // _this.footer();
        _this.tab();
        _this.tooltip.init();

        // fnb
        let fnbButton = $('.bottom-nav > a');
        fnbButton.on('click touchend', function () {
            $(this).addClass('on').siblings().removeClass('on');
        });
    },
    header: () => {
        console.log('header');
    },
    footer: () => {
        console.log('footer');
    },
    tab: () => {
        console.log('tab');
    },
    tooltip: {
        className: {
            wrap: '.tooltip-wrap',
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
                const $cont = $wrap.find(ui.tooltip.className.body);
                const $winW = $(window).width() - 40;
                const $btnW = $btn.outerWidth();
                const $btnX = Math.min($winW + $btnW / 2 - 2, $btn.offset().left) - 20;
                let $scrollEnd = $(window).height() + $(window).scrollTop();

                if ($(ui.className.bottomFixed + ':visible').length) $scrollEnd = $scrollEnd - $(ui.className.bottomFixed).children().outerHeight();

                const $left = Math.max(-4, $btnX);
                $cont.children(ui.tooltip.className.arrow).css({
                    left: $left + $btnW / 2
                });
                $cont.css({
                    width: $winW,
                    left: -$left
                });

                const $contY = $wrap.offset().top + $wrap.outerHeight() + parseInt($cont.css('margin-top')) + parseInt($cont.css('margin-bottom')) + $cont.outerHeight();
                if ($cont.hasClass('is-bottom')) {
                    $cont.addClass('bottom');
                } else {
                    if ($scrollEnd - 10 < $contY) {
                        $cont.addClass('bottom');
                    } else {
                        $cont.removeClass('bottom');
                    }
                }
            });
        },
        position: function (tar) {
            const $tar = $(tar);

            if (!$tar.find(ui.tooltip.className.inner).length) $tar.wrapInner('<div class="' + ui.tooltip.className.inner.slice(1) + '"></div>');
            if (!$tar.find(ui.tooltip.className.arrow).length) $tar.prepend('<i class="' + ui.tooltip.className.arrow.slice(1) + '" aria-hidden="true"></i>');
            if (!$tar.find(ui.tooltip.className.closeBtn).length) $tar.find(ui.tooltip.className.inner).append('<a href="#" class="' + ui.tooltip.className.closeBtn.slice(1) + '" role="button" aria-label="툴팁닫기"></a>');
            ui.tooltip.resize();
        },
        aria: function (element) {
            $(element).each(function (e) {
                const $btn = $(this).find(ui.tooltip.className.btn);
                const $cont = $(this).find(ui.tooltip.className.body);
                let $contId = $cont.attr('id');
                const $closeBtn = $(this).find(ui.tooltip.className.closeBtn);

                if (!$contId) $contId = 'ttCont-' + e;
                $btn.attr({
                    role: 'button'
                    // 'aria-describedby': $contId
                });
                $cont.attr({
                    // id: $contId,
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

                $cont = $(this).closest(ui.tooltip.className.wrap).find(ui.tooltip.className.body);
                if ($(this).hasClass('is-pop')) {
                    const $popContent = $cont.html();
                    const $popTitle = $cont.attr('title');
                    if ($popTitle !== undefined) {
                        Layer.tooltip($popContent, $popTitle);
                    } else {
                        Layer.tooltip($popContent);
                    }
                } else {
                    if ($(this).hasClass(ui.tooltip.className.active.slice(1))) {
                        $cont.stop(true, false).fadeOut();
                        $(this).removeClass(ui.tooltip.className.active.slice(1));
                    } else {
                        $(ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
                        $(ui.tooltip.className.body).fadeOut();
                        $(this).addClass(ui.tooltip.className.active.slice(1));
                        $cont.stop(true, false).fadeIn();
                        setTimeout(function () {
                            ui.tooltip.position($cont);
                        }, 30);
                    }
                }
            });
            //닫기
            $(document).on('click', ui.tooltip.className.closeBtn, function (e) {
                e.preventDefault();
                const $cont = $(this).closest(ui.tooltip.className.body);
                const $btn = $cont.siblings(ui.tooltip.className.btn);
                $btn.removeClass(ui.tooltip.className.active.slice(1));
                $cont.stop(true, false).fadeOut(500, function () {
                    $btn.focus();
                });
            });
            $(document)
                .on('click touchend', function (e) {
                    $(ui.tooltip.className.body).stop(true, false).fadeOut();
                    $(ui.tooltip.className.wrap + ' ' + ui.tooltip.className.btn).removeClass(ui.tooltip.className.active.slice(1));
                })
                .on('click touchend', ui.tooltip.className.wrap, function (e) {
                    e.stopPropagation();
                });
        }
    }
};

$(document).ready(() => {
    ui.init();

    //탭 패널 열기
    function tabPanel() {
        $('.tabMenu a')
            .off('click touchend')
            .on('click touchend', function () {
                let id = $(this).attr('href'),
                    $tab = $(this).parent();
                if ($tab.hasClass('on')) return false;
                $tab.addClass('on').siblings('.tabMenu').removeClass('on');
                $(id).show().siblings('.tabCon').hide();
            })
            .off('focus')
            .on('focus', function () {
                $(this).click();
            });
    }

    //탭 메뉴 스크롤
    function tabMenuScroll() {
        let sliders = document.querySelectorAll('.deal-scroll');

        sliders.forEach((slider) => {
            let mouseDown = false;
            let startX, scrollLeft;
            let startDragging = function (e) {
                mouseDown = true;
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            };
            let stopDragging = function (event) {
                mouseDown = false;
            };
            slider.addEventListener('mousemove', (e) => {
                e.preventDefault();
                if (!mouseDown) {
                    return;
                }
                const x = e.pageX - slider.offsetLeft;
                const scroll = x - startX;
                slider.scrollLeft = scrollLeft - scroll;
            });
            slider.addEventListener('mousedown', startDragging, false);
            slider.addEventListener('mouseup', stopDragging, false);
            slider.addEventListener('mouseleave', stopDragging, false);
        });
    }

    //탭 클릭시 라인 이동
    function jqTabLine(wrap) {
        const $active = $(wrap).find('.tab.active');
        const $activeLeft = $active.position().left;
        const $activeWidth = $active.outerWidth();
        const $line = $(wrap).find('.tab-line');
        $line.stop().animate(
            {
                left: $activeLeft,
                width: $activeWidth
            },
            300
        );
    }
    function jqTab() {
        $('.act-tab a').click(function (e) {
            e.preventDefault();
            const $href = $(this).attr('href');
            $(this).parent().addClass('active').siblings().removeClass('active');
            $(this)
                .parent()
                .siblings()
                .each(function (e) {
                    const $btn = $(this).find('a');
                    const $btnHref = $btn.attr('href');
                    $($btnHref).removeClass('active');
                });
            $($href).addClass('active');
            jqTabLine($(this).closest('.ui-tab'));
        });
    }
    function jqTabReady() {
        $('.ui-tab').each(function () {
            jqTabLine(this);
        });
    }
    jqTabReady();
    jqTab();
    $(window).resize(jqTabReady);
    tabMenuScroll();
    tabPanel();
});
