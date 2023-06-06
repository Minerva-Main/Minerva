function viewfullimage(element) {
	var src = element.src;
	$("#fullimage").attr("src", src);
	$("#smallimages").css("display", "none");
	$("#fullimagediv").css("display", "block");
}

function goback() {
	$("#fullimagediv").css("display", "none");
	$("#smallimages").css("display", "inline");
}