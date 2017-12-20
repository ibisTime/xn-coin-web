const getImg = function(pic, suffix) {
  if (!pic) {
    return "";
  }
  if (pic) {
    pic = pic.split(/\|\|/)[0];
  }
  if (!/^http/i.test(pic)) {
    suffix = suffix || '?imageMogr2/auto-orient';
    pic = PIC_PREFIX + '/' + pic + suffix;
  }
  return pic
}