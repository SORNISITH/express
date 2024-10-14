const dummy = (blog) => {
  return blog.length === 0 ? 1 : 1;
};
const totallike = (list) => {
  if (list.length === 0) {
    return 0;
  } else if (list.length === 1) {
    return list[0].likes;
  }
  const findmaxlikeindex = list.reduce((prev, current, currentIndex, arr) => {
    return current.likes > arr[prev].likes ? currentIndex : prev;
  }, 0);
  return list[findmaxlikeindex].likes;
};
module.exports = {
  dummy,
  totallike,
};
