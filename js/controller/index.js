$(function () {
	init();

	function init() {
		initPics();
    initLink();
	}
  // 初始化页面图片
	function initPics() {
    fetch(805806, { type: 2 }).then((data) => {
      var bannerData = [];
      if (data.length) {
        data.forEach((item, i) => {
          if (item.location === 'web_banner') {
            bannerData.push(item);
          } else if (item.location === 'web_download') {
            initQrCode('downImg', item);
          } else if (item.location === 'web_qq') {
            initQrCode('qqImg', item);
          } else if (item.location === 'web_weibo') {
            initQrCode('wbImg', item);
          } else if (item.location === 'web_wechat') {
            initQrCode('wxImg', item);
          }
        });
        initBanner(bannerData);
      }
    });
	}
  // 初始化下载链接
  function initLink() {
    fetch(625915, {
      start: 1,
      limit: 10,
      type: 'android-c'
    }).then((data) => {
      data.list.forEach((item) => {
        if (item.ckey === 'downloadUrl') {
          $('#androidDown').attr('href', item.cvalue);
        }
      });
    });
    fetch(625915, {
      start: 1,
      limit: 10,
      type: 'ios-c'
    }).then((data) => {
      data.list.forEach((item) => {
        if (item.ckey === 'downloadUrl') {
          $('#iosDown').attr('href', item.cvalue);
        }
      });
    });
  }
  // 初始化banner
  function initBanner(data) {
    var bannerHtml = '', dotHtml = '';
    data.forEach((item, i) => {
      bannerHtml += getBannerHtml(item, i);
      dotHtml += getDotHtml(item, i);
    });
    $('#bannerWrap').html(bannerHtml);
    $('#dots').html(dotHtml);
  }

  function getBannerHtml(item, i) {
    return `
      <div class="mbr-box mbr-section mbr-section--relative mbr-section--fixed-size mbr-section--bg-adapted item dark center mbr-section-cd-height ${i==0?'active':''}"
        style="background-image: url(${getImg(item.pic)});">
        <div class="mbr-box__magnet mbr-box__magnet--sm-padding mbr-after-navbar">
          <div class=" container">
              <div class="row">
                <div class="col-sm-8 col-sm-offset-2">
                  <div class="mbr-hero">
                    <h1 class="mbr-hero__text"></h1>
                  </div>
                  <div class="mbr-buttons btn-inverse mbr-buttons--center"></div>
                </div>
              </div>
          </div>
        </div>
      </div>`;
  }

  function getDotHtml(item, i) {
    return `<li data-app-prevent-settings="" data-target="#slider-38" class="${i==0?'active':''}" data-slide-to="${i}"></li>`;
  }
  // 初始化二維碼
  function initQrCode(id, item) {
    $('#' + id).attr('src', getImg(item.pic));
  }
});