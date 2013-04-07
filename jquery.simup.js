
	!(function($){

		"use strict"; // jshint ;_

		var methods = {
			init: function(options){
				var settings = $.extend( {
					html: "Cargando...",
					close: true,
					title: null,
					show: true,
					scroll: true
				}, options);
				if(this instanceof $){
					if($(this).data("modal") !== undefined){
						if($(this).data("modal-title") !== undefined){
							settings.title = $(this).data("modal-title");
						}
						if($(this).data("modal-html") !== undefined){
							settings.html = $(this).data("modal-html");
						}
						if($(this).data("modal-close") !== undefined){
							settings.close = $(this).data("modal-close");
						}
						if($(this).data("modal-scroll") !== undefined){
							settings.scroll = Boolean($(this).data("modal-scroll"));
						}
						return this.each(function(){
							$(this).click(function(){
								var t = this;
								if($(this).data("modal-ajax") !== undefined){
									this.disabled = true;
									$.ajax({
										url: this.href,
										success: function(data){
											t.disabled = false;
											settings.html = data;
											methods.setup(settings);
											$(".modal form:first :text:first").focus();
										}
									});
								}else{
									methods.setup(settings);
								}
								return false;
							});
						});
					}
				}else{
					methods.setup(settings);
				}
				
			},
			setup: function(settings){
				var closeHtml = "<a href='#' class='modal-close close'>×</a>";
				var modal = $("<div class='modal-wrapper'><div class='modal-overlay'></div><div class='modal'>" + (settings.title ? "<div class='modal-header'>" + settings.title + closeHtml + "</div>" : closeHtml) + "<div class='modal-body'>" + settings.html + "</div></div></div>").appendTo("body");
				if(settings.append){
					$(".modal-body", modal).html("").append(settings.append);
				}
				var close = $(".modal-close", modal).click(function(){
					$(".modal", modal).animate({
						y: $(window).height(),
						x: "-=100",
						rotate: 30
					});
					modal.animate({
						opacity: 0
					}, function(){
						modal.remove();
					});
					return false;
				});
				$(".modal-body", modal).css({
					overflow: settings.scroll ? "auto" : "hidden"
				});
				$(".close", modal).css({
					position: "absolute",
					top: 6,
					right: 10,
					zIndex: 50
				});
				$(".modal-header", modal).css({
					backgroundColor: "#f2f2f2",
					fontSize: 16,
					padding: "9px 30px 6px 15px",
					borderRadius: "6px 6px 0 0"
				});
				if(!settings.close){
					close.hide();
				}
				var overlay = $(".modal-overlay", modal).css({
					background: "#666",
					opacity: 0.5,
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: 99
				}).animate({
					opacity: 0.5
				});
				var content = $(".modal", modal);
				if(settings.show){
					methods.show();
				}
			},
			show: function(){
				var content = $(".modal");
				content.css({
					zIndex: 999,
					margin: 0,
					width: "auto !important",
					top: - content.height() - 50,
					left: "50%",
					marginLeft: - (content.width() / 2)
				}).animate({
					top: ($(window).height() / 2) - (content.height() / 2)
				});
				$("form:first :text:first", content).focus();
			},
			close: function(){
				$(".modal-wrapper").remove();
			}
		};

		$.fn.modal = $.modal = function(method){
			if ( methods[method] ) {
				return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
				return methods.init.apply( this, arguments );
			}
		};

		$("[data-modal]").modal();

	})(window.jQuery);