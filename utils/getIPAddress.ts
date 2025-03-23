export default async function getIPAddress() {
  const res = await fetch("https://api64.ipify.org?format=json");
  const data = await res.json();
  return data.ip; // Returns IP address
}
