function validate()
{
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    document.getElementsByClassName('msg')[0].innerHTML = "";

    if(email == '')
        document.getElementById('emailspan').innerHTML = ' * required';
    else {
        document.getElementById('emailspan').innerHTML = "";
        if(validateEmail(email))
            document.getElementById('emailspan').innerHTML = "";
        else
            document.getElementById('emailspan').innerHTML = " ! invalid email";
    }

    if(pass == '')
        document.getElementById('passspan').innerHTML = ' * required';
    else 
        document.getElementById('passspan').innerHTML = "";
    

    if(email!='' && pass!='' && validateEmail(email))
        return true;
    else
        return false;
}

function validateEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
}