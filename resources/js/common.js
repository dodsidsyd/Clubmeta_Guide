var ui = {
	init: () => {
		var _this = this;

        _this.tab();
    },
    tab: () => {
        console.log(23);
    },
};

$(document).ready(() => {
	ui.init();
});