export function validNumberInput(val) {
  // 숫자만 남기고, 맨 앞 0 여러개 방지, 1000 이상 방지
  let num = val.replace(/[^0-9]/g, '').replace(/^0+/, '');
  if (num === '') return '';
  if (Number(num) >= 10000) return '9999';
  return num;
}