var lastSeen=[0,0];function checkScroll(b,a){if(!b||!a){return}var c=(b.scrollTop-lastSeen[0]);if(c==null){return}if(a.scrollTop==lastSeen[1]){a.scrollTop=(lastSeen[1]+c)}lastSeen[0]=b.scrollTop;lastSeen[1]=a.scrollTop}$(document).ready(function(){$("#scroller").bind("click",function(){$(".txt_container").toggleClass("hide_overflow");if($(this).hasClass("hide_arrows")){$(this).removeClass("hide_arrows");$(this).addClass("show_arrows")}else{$(this).removeClass("show_arrows");$(this).addClass("hide_arrows")}});$("#linker").bind("click",function(){if($(this).hasClass("unlink_windows")){$(this).removeClass("unlink_windows");$(this).addClass("link_windows");if($("#linker_2").hasClass("link_windows_2")){$("#linker_2").removeClass("link_windows_2");$("#linker_2").addClass("unlink_windows_2");window.clearInterval(interval_two);lastSeen=[0,0];window.setInterval("checkScroll(document.getElementById('txt_window_2'), document.getElementById('txt_window'))",100000000000)}interval_one=window.setInterval("checkScroll(document.getElementById('txt_window'), document.getElementById('txt_window_2'))",0)}else{$(this).removeClass("link_windows");$(this).addClass("unlink_windows");window.clearInterval(interval_one);lastSeen=[0,0];window.setInterval("checkScroll(document.getElementById('txt_window'), document.getElementById('txt_window_2'))",100000000000)}});$("#linker_2").bind("click",function(){if($(this).hasClass("unlink_windows_2")){$(this).removeClass("unlink_windows_2");$(this).addClass("link_windows_2");if($("#linker").hasClass("link_windows")){$("#linker").removeClass("link_windows");$("#linker").addClass("unlink_windows");window.clearInterval(interval_one);lastSeen=[0,0];window.setInterval("checkScroll(document.getElementById('txt_window'), document.getElementById('txt_window_2'))",100000000000)}interval_two=window.setInterval("checkScroll(document.getElementById('txt_window_2'), document.getElementById('txt_window'))",0)}else{$(this).removeClass("link_windows_2");$(this).addClass("unlink_windows_2");window.clearInterval(interval_two);lastSeen=[0,0];window.setInterval("checkScroll(document.getElementById('txt_window_2'), document.getElementById('txt_window'))",100000000000)}})});