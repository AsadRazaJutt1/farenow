
$(document).ready(function () {
    $("#user-phone-signup").addClass("d-none");
});

const API = 'http://127.0.0.1:8000/api/';

const handleNameChange = ({ name, value, error, arg }) => {
    let regex = /^[a-zA-Z ]{1,30}$/;
    if (regex.test(value)) {
        $(error).text('');
        return true;
    } else {
        $(error).text(`please enter vaild ${arg ? arg : name}`);
        return false;
    }
}

const handleEmailChange = ({ email, error }) => {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let result = regex.test(email);
    if (result) {
        $(error).text('');
        return true
    } else {
        $(error).text('please enter vaild email');
        return false
    }
};

const handlePasswordChange = ({ value, error }) => {

    let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!regex.test(value)) {
        $(error).text('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');
        return false;
    }
    $(error).text('');
    return true
}

const handlePhoneChange = ({ value, error }) => {
    let regex = /^[0-9]{10,11}$/
    let result = regex.test(value);
    if (result && ($('#user_code').val() == "+1" || $('#user_code').val() == "+92") && value.length == 10) {
        $(error).text('');
        return true;
    } else {
        $(error).text(`please enter vaild phone number, 10 digits`);
        return false;
    }
};

const handleOtpChange = ({ value, error }) => {
    let regex = /^[0-9]{4,4}$/
    if (regex.test(otp)) {
        $('#step-2').prop('disabled', false);
        $('#otpErr').text('');
        return true;
    } else {
        $('#otpErr').text('please enter 4 digit otp');
        $('#step-2').prop('disabled', true);
        return false;
    }
}

$("#step-2-user-back").click(function () {
    $("#user-phone-signup").removeClass("d-none");
    $("#user-otp").addClass("d-none");
});

$("#step-3-user-back").click(function () {
    $(".step-2-user").removeClass("d-none");
    $(".step-3-user").addClass("d-none");
});

$('#register-user-btn').on('click', function (event) {
    event.preventDefault();
    $(".login-from").addClass("d-none");
    $("#user-phone-signup").removeClass("d-none");
    // $("#user-step3").removeClass("d-none");
});

$('#register-provider-btn').on('click', function (event) {
    event.preventDefault();
    $(".step-1").removeClass("d-none");
    $("#user-phone-signup").addClass("d-none");
});


$('#registerUser #first_name').on('input', function (e) {
    const { name, value } = e.target;
    handleNameChange({ name, value, error: `#user_${name}Err`, arg: 'First Name' });
});

$('#registerUser #last_name').on('input', function (e) {
    const { name, value } = e.target;
    handleNameChange({ name, value, error: `#user_${name}Err`, arg: 'Last Name' });
});

$('#registerUser #email').on('input', function (e) {
    const { name, value } = e.target;
    handleEmailChange({ email: value, error: `#user_${name}Err` });
});

$('#registerUser #phone').on('input', function (e) {
    const { name, value } = e.target;
    handlePhoneChange({ value, error: `#user_${name}Err` });
});

$('#registerUser #password').on('input', function (e) {
    const { name, value } = e.target;
    handlePasswordChange({ value, error: `#user_${name}Err` });
});

$('#registerUser #password_confirmation').on('input', function (e) {
    const { name, value } = e.target;
    handlePasswordChange({ value, error: `#user_${name}Err` });
});

// function handleNameChange (e) {
//   var fname = e;
//   console.log(fname);
// }

$('#user_phone').on('input', function (e) {
    handlePhoneChange({ value: e.target.value, error: '#user_phoneErr' });
});

$('#signupUser').on('submit', function (e) {
    e.preventDefault();
    if (handlePhoneChange({ value: $('#user_phone').val(), error: '#user_phoneErr' }) == false) {
        return false
    }
    var phone_ = $('#user_code').val() + $('#user_phone').val();
    console.log(phone_);
    localStorage.setItem('user_phone', phone_);
    $.ajax({
        url: `${API}user/signup/phone`,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        data: {
            phone: phone_
        },
        cache: false,
        beforeSend: function () { },
        success: function (response) {
            $("#responsemessage").html('<p class="text" style="background-color: aliceblue;color:red;/* border: aliceblue; */border-radius: 14px;padding: 17px;">' + response.message + '</p>');

            $("#user-phone-signup").addClass("d-none");
            $("#user-otp").removeClass("d-none");
            $("#userphone_").val(phone_);


        }, error: function (request, status, error) {
            if (request?.status == 422) {
                $("#responsemessage").html('<p class="text" style="background-color: aliceblue;color:red;/* border: aliceblue; */border-radius: 14px;padding: 17px;">' + request?.responseJSON?.message?.phone + '</p>');
            }
            if (request?.status == 500) {
                $("#responsemessage").html('<p class="text" style="background-color: aliceblue;color:red;/* border: aliceblue; */border-radius: 14px;padding: 17px;">' + `${request.responseText}` + '</p>');
            }
        }
    });

});


$('#otpVerify').on('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
        url: `${API}user/signup/phone/verify`,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () { },
        success: function (response) {
            $('#registerUser #phone').val(localStorage.getItem('user_phone'));
            $("#responsemessage").html('<p class="text" style="background-color: aliceblue;color:red;/* border: aliceblue; */border-radius: 14px;padding: 17px;">OTP Verified. Please Register</p>');

            $("#user-otp").addClass("d-none");
            $("#user-step3").removeClass("d-none");


        }, error: function (request, status, error) {
            if (request?.status == 422) {
                $("#responsemessage").html('<p class="text" style="background-color: aliceblue;color:red;/* border: aliceblue; */border-radius: 14px;padding: 17px;">' + `${request.responseJSON?.message}` + '</p>');
            }
            if (request?.status == 500) {
                $("#responsemessage").html('<p class="text" style="background-color: aliceblue;color:red;/* border: aliceblue; */border-radius: 14px;padding: 17px;">' + `${request.responseText}` + '</p>');
            }

        }
    });

});

// $('#user_resend').on('click', function () {
//     let phone = localStorage.getItem('user_phone');
//     $.ajax({
//         url: `${API}provider/signup/phone/verify/resend`,
//         type: "post",
//         data: { phone },
//         dataType: "json"
//     }).done(function (response) {
//         $('#user_resend_success').removeClass('d-none');
//         $('#user_resend_success').text('otp sent successfully');
//     }).fail(function (jqXHR) {
//         if (jqXHR.status === 500) {
//             $('#user_resend_fail').removeClass('d-none');
//             $('#user_resend_fail').text(jqXHR.responseJSON.message || jqXHR.responseText);
//         }
//     })
// });

$('#registerUser').on('submit', function (e) {
    e.preventDefault();

    let error = false;
    let first_name = $('#registerUser #first_name').val();
    let last_name = $('#registerUser #last_name').val();
    let email = $('#registerUser #email').val();
    let password = $('#registerUser #password').val();
    let password_confirmation = $('#registerUser #password_confirmation').val();
    let zip_code = $('#registerUser #zip_code').val();

    if (handleNameChange({ name: 'first_name', value: first_name, error: `#user_first_nameErr`, arg: 'First Name' }) == false) {
        error = true;
    }
    if (handleNameChange({ name: 'lastname', value: last_name, error: `#user_last_nameErr`, arg: 'Last Name' }) == false) {
        error = true;
    }
    if (handleEmailChange({ email, error: `#user_emailErr` }) == false) {
        error = true;
    }
    if (handlePasswordChange({ value: password, error: `#user_passwordErr` }) == false) {
        error = true;
    }
    if (handlePasswordChange({ value: password_confirmation, error: `#user_password_confirmationErr` }) == false) {
        error = true;
    }
    if (zip_code == '' || zip_code == undefined) {
        $('#user_zip_codeErr').text('Zip Code is required');
        error = true;
    } else if (zip_code) {
        $('#user_zip_codeErr').text('');
    }
    if (error) {
        return false;
    }

    var formData = new FormData(this);

    $.ajax({
        url: `${API}user/signup`,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () { },
        success: function (response) {
            $(this).trigger('reset');
            $('#registerUser').trigger("reset");
            $("#user-step3").addClass("d-none");
            $("#user-phone-signup").removeClass("d-none");
            $('#signupUser').trigger("reset");
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Thank you for your interest. We will let you know when we launch.',
                confirmButtonText: 'Close',
            });
        }, error: function (request, status, error) {
            if (request?.status == 422) {
                const { message } = request.responseJSON;
                if (message.first_name) {
                    $("#user_first_nameErr").text(message.first_name);
                }
                if (message.last_name) {
                    $("#user_last_nameErr").text(message.last_name);
                }
                if (message.email) {
                    $("#user_emailErr").text(message.email);
                }
                if (message.password) {
                    $("#user_passwordErr").text(message.password);
                }
                if (message.confirm_password) {
                    $("#user_confirm_passwordErr").text(message.confirm_password);
                }
                if (message.phone) {
                    $("#user_phoneErr").text(message.phone);
                }
                if (message.zip_code) {
                    $("#user_zip_codeErr").text(message.zip_code);
                }
            }
            if (request?.status == 500) {
                $("#responsemessage").html('<p class="text" style="background-color: aliceblue;color:red;/* border: aliceblue; */border-radius: 14px;padding: 17px;">' + `${request.responseJSON?.message || request.responseText}` + '</p>');
            }
        }
    });

});