// REF: https://ld246.com/article/1658220803290 
/* 增加监听sm链接单击事件 */
function addSmListener() {
    window.addEventListener('mouseup', jumpSm);
}

function jumpSm(e) {
    setTimeout(() => {
        let smid = e.target.getAttribute('custom-sm-id');
        // 判断e.target 是否包含`custom-sm-id`属性
        if (smid) {    
            console.log("跳转sm----" + "quicker:runaction:a3bc419b-b1d0-4b97-9344-d5ab06abe513?" + smid);
            location.href = "quicker:runaction:a3bc419b-b1d0-4b97-9344-d5ab06abe513?" + smid;
        }
    }, 10)
}
addSmListener();
