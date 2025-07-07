export function validNumberInput(val) {
  // 숫자와 소수점만 남기고, 맨 앞 0 여러개 방지, 소수점 2자리까지, 10000 이상 방지
  let num = val.replace(/[^0-9.]/g, '');
  
  // 소수점이 여러 개 입력되는 것 방지
  const parts = num.split('.');
  if (parts.length > 2) {
    num = parts[0] + '.' + parts[1];
  }

  // 소수점 이하 2자리까지만 허용
  if (num.includes('.')) {
    const [intPart, decPart] = num.split('.');
    num = intPart.replace(/^0+/, '') || '0';
    num += '.' + decPart.slice(0, 2);
  } else {
    num = num.replace(/^0+/, '');
  }

  if (num === '' || num === '.') return '';
  if (Number(num) >= 10000) return '9999.99';
  return num;
}