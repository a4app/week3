function validate()
{
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    if(name == "")
        document.getElementById('name').style.border = "2px solid #FF0000";
    else
        document.getElementById('name').style.border = "2px solid #FFFFFF";

    if(email == "")
        document.getElementById('email').style.border = "2px solid #FF0000";
    else {
        if(validateEmail(email))
            document.getElementById('email').style.border = "2px solid #FFFFFF";
        else
            document.getElementById('email').style.border = "2px solid #FF0000";
    }
    
    if(pass == "")
        document.getElementById('pass').style.border = "2px solid #FF0000";
    else
        document.getElementById('pass').style.border = "2px solid #FFFFFF";

    if(name!="" && email!="" && validateEmail(email) && pass!="")
        return true;
    else
        return false;
}


function validateEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
}