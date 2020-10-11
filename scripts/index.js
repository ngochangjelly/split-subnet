/* IP netword is devided into 2 parts net-host
- net + host = 32 bits
=> Issue: calculte how many bits for netID and how many bits for hostID
=> use subnet mask
VD: 172.29.5.128/252.255.192.0
hostip:     (1010 1100.0001 1101.00)00 0101. 1000.0000
subnetmask: (1111 1111.1111 1111.11)00 0000.0000 0000 => co 18 con so 1 => 172.29.5.128/18

hostip nhung bit tuong ung ma bit o subnet mask = 1
*/

// program to convert decimal to binary
function convertToBinary(x) {
  let bin = 0;
  let rem, i = 1, step = 1;
  while (x != 0) {
    rem = x % 2;
    x = parseInt(x / 2);
    bin = bin + rem * i;
    i = i * 10;
  }
  return bin
}
console.log(convertToBinary(15))
console.log(convertToBinary(19))
console.log(convertToBinary(18))
console.log(convertToBinary(29))
function bin_to_dec(bstr) {
  return parseInt((bstr + '')
    .replace(/[^01]/gi, ''), 2);
}
console.log(bin_to_dec(11111111))
function getClassFromIPAdress(address) {
  const classIndex = parseInt(address.slice(0, 3))
  if (1 <= classIndex && classIndex <= 126) {
    return 'A'
  }
  if (128 <= classIndex && classIndex <= 191) {
    return 'B'
  }
  if (192 <= classIndex && classIndex <= 223) {
    return 'C'
  }
  if (224 <= classIndex && classIndex <= 239) {
    return 'D'
  }
  if (240 <= classIndex && classIndex <= 255) {
    return 'E'
  }
}
const ipClass = [{ key: 'A', numberAfterSlash: 8, firstBytesForNet: 1 }, { key: 'B', numberAfterSlash: 16, firstBytesForNet: 2 }, { key: 'C', numberAfterSlash: 32, firstBytesForNet: 3 }]
const getNetAddressOfIPAddress = (ip) => {
  const splitArr = ip.split('.')
  const zeroArr = ['0', '0', '0', '0']
  const totalBitsOfIP = 4
  console.log("getNetAddressOfIPAddress -> splitArr", splitArr)
  const firstBytesForNet = ipClass.find(i => i.key === getClassFromIPAdress(ip)).firstBytesForNet
  console.log("getNetAddressOfIPAddress -> firstBytesForNet", firstBytesForNet)
  let res = splitArr.slice(0, firstBytesForNet).join('.')
  console.log("getNetAddressOfIPAddress -> res", res)
  for (let i = 0; i < totalBitsOfIP - 1; i + 1) {
    console.log(i)
    res += '.0'
  }
  return res
}

console.log(getNetAddressOfIPAddress('172.29.7.10'))
console.log(getNetAddressOfIPAddress('172.29.7.10'))

