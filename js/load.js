Img = new Array("../images/load/1.png", "../images/load/2.png", "../images/load/3.png", "../images/load/4.png", "../images/load/5.png", "../images/load/6.png", "../images/load/7.png", "../images/load/8.png", "../images/load/9.png", "../images/load/10.png", "../images/load/11.png", "../images/load/12.png");
size = Img.length;
i = 0;

function chImg() {
    picID.src = Img[i];
    i++;
    if (i >= size) i = 0;
    setTimeout("chImg()", 500);
}
chImg();