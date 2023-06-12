
$(document).ready(function () {
    $("#btnSubmit").click(function () {
        $("#lblmsg").html("");

        var name = $("#Fullname").val();
        var email = $("#Email").val();
        var mobile = $("#Mobile").val();
        var message = $("#Message").val();

        if (name !== "" && name !== " ") {
                if (email !== "" && $.bloooomUtilities.isValidEmailAddress(email)) {
                    if (mobile !== "" && $.bloooomUtilities.isValidMobileNumber(mobile)) {
                        if (message !== "" && message !== " ") {
                            ContactUs(name, email, mobile, message);
                        } else
                            $("#lblmsg").html("Please enter your message");
                    } else
                        $("#lblmsg").html("Please enter your mobile in a valid form");
                } else
                    $("#lblmsg").html("Please enter your email in a valid form");
            } else
            $("#lblmsg").html("Please enter your full name");
    });
});

function ContactUs(name, email, mobile, message) {
    $.bloooomUtilities.sendAjaxRequest("{'name':'" + name + "', 'email':'" + email + "', 'mobile':'" + mobile + "', 'message':'" + message + "'}", url + "ContactUs/ContactUs",
        function () {
            $("#btnSubmit").hide();
        }, function () {
            $("#btnSubmit").show();
        }, function (res) {
            $("#lblmsg").html(res.message);
        }, null, "json", "Post");
}