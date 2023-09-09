function validate()
{
    document.getElementsByClassName('msg')[0].innerHTML = "";

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    const confm = document.getElementById('confm').value;

    check('name', name);
    check('email', email);
    check('pass', pass);
    check('confm', confm);

    if(email != "")
        if(!validateEmail(email))
            document.getElementById('emailspan').innerHTML = " ! invalid email";
        else
            document.getElementById('emailspan').innerHTML = "";
    
    if(pass != '' && confm != '')
        if(pass != confm)
            document.getElementById('passspan').innerHTML = ' ! passwords not matching';

    if(name!=''&&email!=''&&pass!=''&&confm!=''&&validateEmail(email)&&pass==confm)
        return true;
    else
        return false;
}

function check(f, v)
{
    if(v == "")
        document.getElementById(f + 'span').innerHTML = " * required";
    else
        document.getElementById(f + 'span').innerHTML = "";
}

function validateEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
}