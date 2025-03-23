export default function getPageInfo() {
  return {
    url: window.location.href,
    referrer: document.referrer, // The previous page the user came from
  };
}
