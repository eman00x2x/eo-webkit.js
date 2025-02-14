
'use strict';

const epochToTime = () => {
    const id = document.getElementById('epoch');
    let result = eo.epochToTimeString(id.value);
    console.log(result);
    document.querySelector('.epochResult').text = result;
};

const serializeFormDataResult = () => {
    const btn = document.querySelector(".btn-serializeFormData");
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        let text = '';
        const form = document.getElementById('serializeFormDataForm');
        const formData = new FormData(form);
        const result = eo.serializeFormData(formData);
        
        text += '{<br/>';
        Object.keys(result).forEach(key => {
            text += '&nbsp; &nbsp; ' + key + ': "' + result[key] + '",<br />';
        });
        text += '}';
        document.querySelector('.serializeFormDataFormResult').innerHTML = text;
    })
};

window.addEventListener('load', function () {
    epochToTime();
    serializeFormDataResult();
});